import mongoose, { Schema, Document } from 'mongoose';


export interface ITournament extends Document {
  id: number;
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  teams: number;
  status: 'active' | 'completed' | 'cancelled';
}


const tournamentSchema = new Schema<ITournament>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, minlength: 1 },
  sport: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  teams: { type: Number, required: true, min: 2 },
  status: { type: String, required: true, enum: ['active', 'completed', 'cancelled'] }
}, { 
  timestamps: true 
});

// Transformación para JSON
// Nota: 'any' requerido por la API de Mongoose para toJSON transform
tournamentSchema.set("toJSON", {
  transform: (_: Document, returnedObject: any) => {
    returnedObject.id = returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const TournamentModel = mongoose.model<ITournament>("Tournament", tournamentSchema);

export default TournamentModel;
