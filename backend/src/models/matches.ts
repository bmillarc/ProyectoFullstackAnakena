import mongoose, { Schema, Document } from 'mongoose';


interface MatchResult {
  anakena: number;
  opponent: number;
}


export interface IMatch extends Document {
  id: number;
  teamId: number;
  opponent: string;
  date: string;
  time: string;
  location: string;
  type: 'local' | 'visitante';
  status: 'scheduled' | 'finished' | 'cancelled';
  result?: MatchResult;
  tournament: string;
}


const matchResultSchema = new Schema<MatchResult>({
  anakena: { type: Number, required: true },
  opponent: { type: Number, required: true }
}, { _id: false });


const matchSchema = new Schema<IMatch>({
  id: { type: Number, required: true, unique: true },
  teamId: { type: Number, required: true, ref: 'Team' },
  opponent: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true, enum: ['local', 'visitante'] },
  status: { type: String, required: true, enum: ['scheduled', 'finished', 'cancelled'] },
  result: { type: matchResultSchema, required: false },
  tournament: { type: String, required: true }
}, { 
  timestamps: true 
});

// Transformación para JSON
// Nota: 'any' requerido por la API de Mongoose para toJSON transform
matchSchema.set("toJSON", {
  transform: (_: Document, returnedObject: any) => {
    returnedObject.id = returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const MatchModel = mongoose.model<IMatch>("Match", matchSchema);

export default MatchModel;
