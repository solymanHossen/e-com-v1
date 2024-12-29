"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const cart_model_1 = require("../models/cart.model");
const order_model_1 = require("../models/order.model");
const user_model_1 = require("../models/user.model");
const product_model_1 = require("../models/product.model");
const promotion_service_1 = require("./promotion.service");
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const order_service_1 = require("./order.service");
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
});
const TAX_RATE = 0.1; // 10% tax rate
const SHIPPING_COST = 10; // $10 flat shipping rate
class CheckoutService {
    static createCheckoutSession(userId, shippingAddress, billingAddress, promotionCode) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const cart = yield cart_model_1.Cart.findOne({ user: userId })
                .populate({
                path: 'items',
                populate: {
                    path: 'product',
                    model: 'Product',
                },
            });
            if (!cart || cart.items.length === 0) {
                throw new Error("Cart is empty");
            }
            const cartItems = cart.items;
            const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            const tax = subtotal * TAX_RATE;
            const total = subtotal + tax + SHIPPING_COST;
            let discountAmount = 0;
            if (promotionCode) {
                const promotion = yield promotion_service_1.PromotionService.getPromotionByCode(promotionCode);
                if (promotion) {
                    discountAmount = yield promotion_service_1.PromotionService.applyPromotion(promotion, total);
                }
            }
            const finalAmount = total - discountAmount;
            const order = yield order_service_1.OrderService.createOrder({
                user: userId,
                items: cartItems,
                totalAmount: total,
                subtotal,
                tax,
                shippingCost: SHIPPING_COST,
                discountAmount,
                finalAmount,
                shippingAddress,
                billingAddress,
                paymentMethod: 'credit_card',
                status: 'pending',
                paymentStatus: 'pending',
            });
            /*   await order.save();*/
            const sessionParams = {
                payment_method_types: ["card"],
                line_items: cartItems.map((item) => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.product.name,
                            images: [item.product.imageUrl],
                        },
                        unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
                    },
                    quantity: item.quantity,
                })),
                mode: "payment",
                success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
                customer_email: (_b = (_a = (yield user_model_1.User.findById(userId))) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "",
                metadata: {
                    orderId: (_c = order === null || order === void 0 ? void 0 : order._id) === null || _c === void 0 ? void 0 : _c.toString(),
                },
            };
            const session = yield stripe.checkout.sessions.create(sessionParams);
            return { sessionId: session.id, orderId: order === null || order === void 0 ? void 0 : order._id };
        });
    }
    static confirmOrder(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const session = yield stripe.checkout.sessions.retrieve(sessionId);
            const orderId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
            if (!orderId) {
                throw new Error("Order ID not found in session metadata");
            }
            const order = yield order_model_1.Order.findById(orderId);
            if (!order) {
                throw new Error("Order not found");
            }
            if (session.payment_status === "paid") {
                order.paymentStatus = "paid";
                order.status = "processing";
                order.paymentIntentId = session.payment_intent;
                yield order.save();
                // Update product stock
                const updatePromises = order.items.map(item => product_model_1.Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }));
                yield Promise.all(updatePromises);
                // Clear the user's cart
                yield cart_model_1.Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
            }
            else {
                order.paymentStatus = "failed";
                order.status = "cancelled";
                yield order.save();
            }
            return order;
        });
    }
    static getOrderSummary(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield order_model_1.Order.findById(orderId).populate("items.product");
            if (!order) {
                throw new Error("Order not found");
            }
            return order;
        });
    }
}
exports.CheckoutService = CheckoutService;
