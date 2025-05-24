import mongoose, { Document, Schema } from 'mongoose';
import {IReview} from "./review.model";
 export interface IGalleryImage {
    _id?: any;
    url?: string | undefined;
    publicId?: string | undefined;
}

export interface IProduct extends Document {
    name: string;
    description: string;
    htmlDescription: string;
    price: number;
    category: string[];
    imageUrl: string;
    imagePublicId?: string
    gallery?: IGalleryImage[]
    reviews: IReview['_id'][];
    averageRating: number;
    reviewCount: number;
    stock:number | null;
}
const GalleryImageSchema = new Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
})
const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    htmlDescription: { type: String, required: true },
    price: { type: Number, required: true },
    category: [{ type: String, required: true }],
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String },
    gallery: [GalleryImageSchema],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    stock:{ type: Number,required: true },
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', productSchema);