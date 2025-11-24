import mongoose, { Schema, Document } from 'mongoose';


export interface IEvent extends Document {
  id: number;
  start: string;
  end: string;
  title: string;
  category: string;
  location: string;
  description: string;
}


const eventSchema = new Schema<IEvent>({
  id: { type: Number, required: true, unique: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  title: { type: String, required: true, minlength: 1 },
  category: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true }
}, { 
  timestamps: true 
});

// Transformación para JSON
// Nota: 'any' requerido por la API de Mongoose para toJSON transform
eventSchema.set("toJSON", {
  transform: (_: Document, returnedObject: any) => {
    returnedObject.id = returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const EventModel = mongoose.model<IEvent>("Event", eventSchema);

export default EventModel;
