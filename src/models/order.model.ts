import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';
import { IProduct } from './product.model';
import {IPromotion} from "./promotion.model";

export interface IOrderItem {
    product: IProduct['_id'];
    quantity: number;
}

export interface IOrder extends Document {
    user:IUser['_id'] | undefined;
    items: IOrderItem[];
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    promotion?: IPromotion['_id'];
}

const orderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
    promotion: { type: Schema.Types.ObjectId, ref: 'Promotion' },
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', orderSchema);