import mongoose, { Document, Schema } from 'mongoose';
import {IReview} from "./review.model";

export interface IProduct extends Document {
    name: string;
    description: string;
    htmlDescription: string;
    price: number;
    category: string[];
    imageUrl: string;
    reviews: IReview['_id'][];
    averageRating: number;
    reviewCount: number;
    stock:number;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    htmlDescription: { type: String, required: true },
    price: { type: Number, required: true },
    category: [{ type: String, required: true }],
    imageUrl: { type: String, required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    stock:{ type: Number,required: true },
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', productSchema);