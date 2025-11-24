import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import path from 'path';
import TeamModel from "./models/teams";
import PlayerModel from "./models/players";
import MatchModel from "./models/matches";
import NewsModel from "./models/news";
import TournamentModel from "./models/tournaments";
import EventModel from "./models/events";
import StoreItemModel from "./models/store";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
let skipDb = process.env.SKIP_DB === 'true';
const redactMongoUri = (uri: string) => uri.replace(/:?\/\/([^:@]+):([^@]+)@/, '://$1:***@');

// Middleware para bloquear rutas si no hay DB
const dbGuard = (req: Request, res: Response, next: NextFunction) => {
  if (skipDb) {
    return res.status(503).json({ error: 'Database disabled (SKIP_DB=true)' });
  }
  next();
};

// CORS configuration to allow credentials (cookies)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://fullstack.dcc.uchile.cl:7112',
      'https://fullstack.dcc.uchile.cl:7112',
      `http://fullstack.dcc.uchile.cl:${PORT}`,
      `https://fullstack.dcc.uchile.cl:${PORT}`,
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // En desarrollo, log del origen rechazado para debug
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const requestLogger = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

// Auth routes
app.use('/api/auth', authRoutes);

// Aplicar guard a todas las rutas de datos si SKIP_DB
app.use('/api/teams', dbGuard);
app.use('/api/players', dbGuard);
app.use('/api/matches', dbGuard);
app.use('/api/news', dbGuard);
app.use('/api/tournaments', dbGuard);
app.use('/api/events', dbGuard);
app.use('/api/store', dbGuard);

// Teams routes
app.get("/api/teams", (_request, response, next) => {
  TeamModel.find({})
    .then((teams) => {
      response.json(teams);
    })
    .catch((error) => next(error));
});


app.get("/api/teams/:id", (request, response, next) => {
  const id = Number(request.params.id);
  TeamModel.findOne({ id })
    .then((team) => {
      if (team) {
        response.json(team);
      } else {
        response.status(404).json({ error: "Team not found" });
      }
    })
    .catch((error) => next(error));
});


app.post("/api/teams", (request, response, next) => {
  const body = request.body;

  const team = new TeamModel({
    id: body.id,
    sport: body.sport,
    name: body.name,
    category: body.category,
    description: body.description,
    founded: body.founded,
    captain: body.captain,
    playersCount: body.playersCount,
    achievements: body.achievements || [],
    nextMatch: body.nextMatch,
    image: body.image,
  });

  team.save()
    .then((savedTeam) => {
      response.status(201).json(savedTeam);
    })
    .catch((error) => next(error));
});


app.put("/api/teams/:id", (request, response, next) => {
  const id = Number(request.params.id);
  const body = request.body;

  TeamModel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true, runValidators: true }
  )
    .then((updatedTeam) => {
      if (updatedTeam) {
        response.json(updatedTeam);
      } else {
        response.status(404).json({ error: "Team not found" });
      }
    })
    .catch((error) => next(error));
});


app.delete("/api/teams/:id", (request, response, next) => {
  const id = Number(request.params.id);

  TeamModel.findOneAndDelete({ id })
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Team not found" });
      }
    })
    .catch((error) => next(error));
});


app.get("/api/players", (request, response, next) => {
  const teamId = request.query.teamId;
  const filter = teamId ? { teamId: Number(teamId) } : {};

  PlayerModel.find(filter)
    .then((players) => {
      response.json(players);
    })
    .catch((error) => next(error));
});


app.get("/api/players/:id", (request, response, next) => {
  const id = Number(request.params.id);
  PlayerModel.findOne({ id })
    .then((player) => {
      if (player) {
        response.json(player);
      } else {
        response.status(404).json({ error: "Player not found" });
      }
    })
    .catch((error) => next(error));
});


app.post("/api/players", (request, response, next) => {
  const body = request.body;

  const player = new PlayerModel({
    id: body.id,
    name: body.name,
    teamId: body.teamId,
    position: body.position,
    number: body.number,
    age: body.age,
    carrera: body.carrera,
    isCaptain: body.isCaptain || false,
  });

  player.save()
    .then((savedPlayer) => {
      response.status(201).json(savedPlayer);
    })
    .catch((error) => next(error));
});


app.put("/api/players/:id", (request, response, next) => {
  const id = Number(request.params.id);
  const body = request.body;

  PlayerModel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true, runValidators: true }
  )
    .then((updatedPlayer) => {
      if (updatedPlayer) {
        response.json(updatedPlayer);
      } else {
        response.status(404).json({ error: "Player not found" });
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/players/:id", (request, response, next) => {
  const id = Number(request.params.id);

  PlayerModel.findOneAndDelete({ id })
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Player not found" });
      }
    })
    .catch((error) => next(error));
});


app.get("/api/matches", (request, response, next) => {
  const teamId = request.query.teamId;
  const filter = teamId ? { teamId: Number(teamId) } : {};

  MatchModel.find(filter)
    .then((matches) => {
      response.json(matches);
    })
    .catch((error) => next(error));
});


app.get("/api/matches/:id", (request, response, next) => {
  const id = Number(request.params.id);
  MatchModel.findOne({ id })
    .then((match) => {
      if (match) {
        response.json(match);
      } else {
        response.status(404).json({ error: "Match not found" });
      }
    })
    .catch((error) => next(error));
});


app.post("/api/matches", (request, response, next) => {
  const body = request.body;

  const match = new MatchModel({
    id: body.id,
    teamId: body.teamId,
    opponent: body.opponent,
    date: body.date,
    time: body.time,
    location: body.location,
    type: body.type,
    status: body.status,
    result: body.result,
    tournament: body.tournament,
  });

  match.save()
    .then((savedMatch) => {
      response.status(201).json(savedMatch);
    })
    .catch((error) => next(error));
});


app.put("/api/matches/:id", (request, response, next) => {
  const id = Number(request.params.id);
  const body = request.body;

  MatchModel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true, runValidators: true }
  )
    .then((updatedMatch) => {
      if (updatedMatch) {
        response.json(updatedMatch);
      } else {
        response.status(404).json({ error: "Match not found" });
      }
    })
    .catch((error) => next(error));
});


app.delete("/api/matches/:id", (request, response, next) => {
  const id = Number(request.params.id);

  MatchModel.findOneAndDelete({ id })
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Match not found" });
      }
    })
    .catch((error) => next(error));
});


app.get("/api/news", (request, response, next) => {
  const featured = request.query.featured;
  const filter = featured === 'true' ? { featured: true } : {};

  NewsModel.find(filter)
    .then((news) => {
      response.json(news);
    })
    .catch((error) => next(error));
});


app.get("/api/news/:id", (request, response, next) => {
  const id = Number(request.params.id);
  NewsModel.findOne({ id })
    .then((news) => {
      if (news) {
        response.json(news);
      } else {
        response.status(404).json({ error: "News not found" });
      }
    })
    .catch((error) => next(error));
});


app.post("/api/news", (request, response, next) => {
  const body = request.body;

  const news = new NewsModel({
    id: body.id,
    title: body.title,
    summary: body.summary,
    content: body.content,
    date: body.date,
    author: body.author,
    category: body.category,
    image: body.image,
    teamId: body.teamId,
    featured: body.featured || false,
  });

  news.save()
    .then((savedNews) => {
      response.status(201).json(savedNews);
    })
    .catch((error) => next(error));
});


app.put("/api/news/:id", (request, response, next) => {
  const id = Number(request.params.id);
  const body = request.body;

  NewsModel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true, runValidators: true }
  )
    .then((updatedNews) => {
      if (updatedNews) {
        response.json(updatedNews);
      } else {
        response.status(404).json({ error: "News not found" });
      }
    })
    .catch((error) => next(error));
});


app.delete("/api/news/:id", (request, response, next) => {
  const id = Number(request.params.id);

  NewsModel.findOneAndDelete({ id })
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "News not found" });
      }
    })
    .catch((error) => next(error));
});


app.get("/api/tournaments", (request, response, next) => {
  TournamentModel.find({})
    .then((tournaments) => {
      response.json(tournaments);
    })
    .catch((error) => next(error));
});


app.get("/api/tournaments/:id", (request, response, next) => {
  const id = Number(request.params.id);
  TournamentModel.findOne({ id })
    .then((tournament) => {
      if (tournament) {
        response.json(tournament);
      } else {
        response.status(404).json({ error: "Tournament not found" });
      }
    })
    .catch((error) => next(error));
});


app.post("/api/tournaments", (request, response, next) => {
  const body = request.body;

  const tournament = new TournamentModel({
    id: body.id,
    name: body.name,
    sport: body.sport,
    startDate: body.startDate,
    endDate: body.endDate,
    teams: body.teams,
    status: body.status,
  });

  tournament.save()
    .then((savedTournament) => {
      response.status(201).json(savedTournament);
    })
    .catch((error) => next(error));
});


app.put("/api/tournaments/:id", (request, response, next) => {
  const id = Number(request.params.id);
  const body = request.body;

  TournamentModel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true, runValidators: true }
  )
    .then((updatedTournament) => {
      if (updatedTournament) {
        response.json(updatedTournament);
      } else {
        response.status(404).json({ error: "Tournament not found" });
      }
    })
    .catch((error) => next(error));
});


app.delete("/api/tournaments/:id", (request, response, next) => {
  const id = Number(request.params.id);

  TournamentModel.findOneAndDelete({ id })
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Tournament not found" });
      }
    })
    .catch((error) => next(error));
});


app.get("/api/events", (request, response, next) => {
  EventModel.find({})
    .then((events) => {
      response.json(events);
    })
    .catch((error) => next(error));
});


app.get("/api/events/:id", (request, response, next) => {
  const id = Number(request.params.id);
  EventModel.findOne({ id })
    .then((event) => {
      if (event) {
        response.json(event);
      } else {
        response.status(404).json({ error: "Event not found" });
      }
    })
    .catch((error) => next(error));
});


app.post("/api/events", (request, response, next) => {
  const body = request.body;

  const event = new EventModel({
    id: body.id,
    start: body.start,
    end: body.end,
    title: body.title,
    category: body.category,
    location: body.location,
    description: body.description,
  });

  event.save()
    .then((savedEvent) => {
      response.status(201).json(savedEvent);
    })
    .catch((error) => next(error));
});


app.put("/api/events/:id", (request, response, next) => {
  const id = Number(request.params.id);
  const body = request.body;

  EventModel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true, runValidators: true }
  )
    .then((updatedEvent) => {
      if (updatedEvent) {
        response.json(updatedEvent);
      } else {
        response.status(404).json({ error: "Event not found" });
      }
    })
    .catch((error) => next(error));
});


app.delete("/api/events/:id", (request, response, next) => {
  const id = Number(request.params.id);

  EventModel.findOneAndDelete({ id })
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Event not found" });
      }
    })
    .catch((error) => next(error));
});


app.get("/api/store", (request, response, next) => {
  StoreItemModel.find({})
    .then((items) => {
      response.json(items);
    })
    .catch((error) => next(error));
});


app.get("/api/store/:id", (request, response, next) => {
  const id = Number(request.params.id);
  StoreItemModel.findOne({ id })
    .then((item) => {
      if (item) {
        response.json(item);
      } else {
        response.status(404).json({ error: "Store item not found" });
      }
    })
    .catch((error) => next(error));
});


app.post("/api/store", (request, response, next) => {
  const body = request.body;

  const item = new StoreItemModel({
    id: body.id,
    label: body.label,
    price: body.price,
    image: body.image,
    category: body.category,
  });

  item.save()
    .then((savedItem) => {
      response.status(201).json(savedItem);
    })
    .catch((error) => next(error));
});


app.put("/api/store/:id", (request, response, next) => {
  const id = Number(request.params.id);
  const body = request.body;

  StoreItemModel.findOneAndUpdate(
    { id },
    { $set: body },
    { new: true, runValidators: true }
  )
    .then((updatedItem) => {
      if (updatedItem) {
        response.json(updatedItem);
      } else {
        response.status(404).json({ error: "Store item not found" });
      }
    })
    .catch((error) => next(error));
});


app.delete("/api/store/:id", (request, response, next) => {
  const id = Number(request.params.id);

  StoreItemModel.findOneAndDelete({ id })
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Store item not found" });
      }
    })
    .catch((error) => next(error));
});


const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error("Error name:", error.name);
  console.error("Error message:", error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "Malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// Servir frontend compilado (si existe) - DEBE IR AL FINAL
const frontendPath = __dirname;
if (process.env.SERVE_UI === 'true') {
  app.use(express.static(frontendPath));
  // Catch-all solo para rutas que no son API
  app.get('*', (_req, res, next) => {
    // No interceptar rutas de API
    if (_req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Error loading application');
      }
    });
  });
}

async function start() {
  if (skipDb) {
    console.warn('[WARN] SKIP_DB=true -> no se intenta conexión a MongoDB');
  } else {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string, {
        dbName: process.env.MONGODB_DBNAME
      });
      console.log('✅ MongoDB conectado');
      skipDb = false; // Confirmamos que DB está disponible
    } catch (err) {
      console.error('❌ Error conectando a MongoDB:', err);
      console.warn('[WARN] Continuando sin DB (modo degradado)');
      skipDb = true; // Marcamos que DB no está disponible
    }
  }
  app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT} (skipDb=${skipDb})`);
    if (process.env.MONGODB_URI) {
      console.log(`📊 MongoDB URI: ${redactMongoUri(process.env.MONGODB_URI)} dbName: ${process.env.MONGODB_DBNAME}`);
    }
  });
}

start();




