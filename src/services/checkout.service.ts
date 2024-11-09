import { Cart } from '../models/cart.model';
import { Order, IOrder } from '../models/order.model';
import { User } from '../models/user.model';
import {IProduct, Product} from '../models/product.model';
import { PromotionService } from './promotion.service';
import Stripe from 'stripe';
import {Schema} from "mongoose";
import {ICartItem} from "../models/cart-item.model";
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-10-28.acacia',
});

const TAX_RATE = 0.1; // 10% tax rate
const SHIPPING_COST = 10; // $10 flat shipping rate

export class CheckoutService {
    static async createCheckoutSession(userId: string | Schema.Types.ObjectId, shippingAddress: IOrder['shippingAddress'], billingAddress: IOrder['billingAddress'], promotionCode?: string): Promise<{ sessionId: string; orderId: string }> {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }
        const cartItems = cart.items as unknown as ICartItem[];

        const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax + SHIPPING_COST;

        let discountAmount = 0;
        if (promotionCode) {
            const promotion = await PromotionService.getPromotionByCode(promotionCode);
            if (promotion) {
                discountAmount = await PromotionService.applyPromotion(promotion, total);
            }
        }

        const finalAmount = total - discountAmount;

        const order = new Order({
            user: userId,
            items: cart.items,
            totalAmount: total,
            subtotal,
            tax,
            shippingCost: SHIPPING_COST,
            discountAmount,
            finalAmount,
            shippingAddress,
            billingAddress,
            paymentMethod: 'credit_card', // Default to credit card, can be changed later
        });

        await order.save();

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: cartItems.map((item: ICartItem) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: (item.product as IProduct).name,
                        images: [(item.product as IProduct).imageUrl],
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
            customer_email: (await User.findById(userId))?.email ?? "",
            metadata: {
                orderId: order?.id.toString() as IOrder['_id'] as string,
            },
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

        return { sessionId: session.id, orderId: order?.id.toString() };
    }

/*    static async confirmOrder(sessionId: string): Promise<IOrder> {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const orderId = session.metadata?.orderId;

        if (!orderId) {
            throw new Error('Order ID not found in session metadata');
        }

        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        if (session.payment_status === 'paid') {
            order.paymentStatus = 'paid';
            order.status = 'processing';
            order.paymentIntentId = session.payment_intent as string;
            await order.save();

            // Update product stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
            }

            // Clear the user's cart
            await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
        }

        return order;
    }

    static async getOrderSummary(orderId: string): Promise<IOrder> {
        const order = await Order.findById(orderId).populate('items.product');
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }*/
}