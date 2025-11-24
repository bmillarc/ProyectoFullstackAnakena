import mongoose, { Schema, Document } from 'mongoose';


export interface IPlayer extends Document {
  id: number;
  name: string;
  teamId: number;
  position: string;
  number: number;
  age: number;
  carrera: string;
  isCaptain: boolean;
}


const playerSchema = new Schema<IPlayer>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, minlength: 1 },
  teamId: { type: Number, required: true, ref: 'Team' },
  position: { type: String, required: true },
  number: { type: Number, required: true, min: 1 },
  age: { type: Number, required: true, min: 18, max: 100 },
  carrera: { type: String, required: true },
  isCaptain: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

// Transformación para JSON
// Nota: 'any' requerido por la API de Mongoose para toJSON transform
playerSchema.set("toJSON", {
  transform: (_: Document, returnedObject: any) => {
    returnedObject.id = returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const PlayerModel = mongoose.model<IPlayer>("Player", playerSchema);

export default PlayerModel;
