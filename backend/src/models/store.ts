import mongoose, { Schema, Document } from 'mongoose';


export interface IStoreItem extends Document {
  id: number;
  label: string;
  price: string;
  image: string;
  category: string;
}


const storeItemSchema = new Schema<IStoreItem>({
  id: { type: Number, required: true, unique: true },
  label: { type: String, required: true, minlength: 1 },
  price: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true }
}, { 
  timestamps: true 
});

// Transformación para JSON
// Nota: 'any' requerido por la API de Mongoose para toJSON transform
storeItemSchema.set("toJSON", {
  transform: (_: Document, returnedObject: any) => {
    returnedObject.id = returnedObject.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const StoreItemModel = mongoose.model<IStoreItem>("StoreItem", storeItemSchema);

export default StoreItemModel;
