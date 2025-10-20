import dotenv from 'dotenv';
dotenv.config();

import mongoose, { Schema, Document } from 'mongoose';

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

mongoose.set("strictQuery", false);
if (url) {
  mongoose.connect(url, { dbName }).catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
}


interface NextMatch {
  id: number;
  date: string;
  opponent: string;
  location: string;
  time: string;
}


export interface ITeam extends Document {
  id: number;
  sport: string;
  name: string;
  category: string;
  description: string;
  founded: string;
  captain: string;
  playersCount: number;
  achievements: string[];
  nextMatch: NextMatch;
  image: string;
}


const nextMatchSchema = new Schema<NextMatch>({
  id: { type: Number, required: true },
  date: { type: String, required: true },
  opponent: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: String, required: true }
}, { _id: false });


const teamSchema = new Schema<ITeam>({
  id: { type: Number, required: true, unique: true },
  sport: { type: String, required: true, minlength: 1 },
  name: { type: String, required: true, minlength: 1 },
  category: { type: String, required: true, enum: ['Masculino', 'Femenino', 'Mixto'] },
  description: { type: String, required: true },
  founded: { type: String, required: true },
  captain: { type: String, required: true },
  playersCount: { type: Number, required: true, min: 1 },
  achievements: [{ type: String }],
  nextMatch: { type: nextMatchSchema, required: true },
  image: { type: String, required: true }
}, { 
  timestamps: true 
});

// Transformación para JSON
// Nota: Se usa 'any' aquí porque es el tipo requerido por la API de Mongoose para toJSON transform
// Esta es una función de transformación interna de Mongoose que no se puede tipar más específicamente
teamSchema.set("toJSON", {
  transform: (_: Document, returnedObject: any) => {
    returnedObject.id = returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const TeamModel = mongoose.model<ITeam>("Team", teamSchema);

export default TeamModel;
