import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    htmlDescription: string;
    price: number;
    category: string[];
    imageUrl: string;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    htmlDescription: { type: String, required: true },
    price: { type: Number, required: true },
    category: [{ type: String, required: true }],
    imageUrl: { type: String, required: true },
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', productSchema);