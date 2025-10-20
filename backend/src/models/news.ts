import mongoose, { Schema, Document } from 'mongoose';


export interface INews extends Document {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  teamId: number | null;
  featured: boolean;
}


const newsSchema = new Schema<INews>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, minlength: 1 },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  teamId: { type: Number, default: null, ref: 'Team' },
  featured: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

// Transformación para JSON
// Nota: 'any' requerido por la API de Mongoose para toJSON transform
newsSchema.set("toJSON", {
  transform: (_: Document, returnedObject: any) => {
    returnedObject.id = returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const NewsModel = mongoose.model<INews>("News", newsSchema);

export default NewsModel;
