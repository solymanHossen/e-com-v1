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
exports.CartService = void 0;
const cart_model_1 = require("../models/cart.model");
const cart_item_model_1 = require("../models/cart-item.model");
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
class CartService {
    static getCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return cart_model_1.Cart.findOne({ user: userId }).populate({
                path: 'items',
                populate: { path: 'product' }
            });
        });
    }
    static addToCart(userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                let cart = yield cart_model_1.Cart.findOne({ user: userId }).session(session);
                if (!cart) {
                    cart = new cart_model_1.Cart({ user: userId, items: [], totalAmount: 0 });
                    yield cart.save({ session });
                    yield user_model_1.User.findByIdAndUpdate(userId, { cart: cart._id }, { session });
                }
                const product = yield product_model_1.Product.findById(productId).session(session);
                if (!product) {
                    throw new Error('Product not found');
                }
                if (((_a = product.stock) !== null && _a !== void 0 ? _a : 0) < quantity) {
                    throw new Error('Not enough stock');
                }
                let cartItem = yield cart_item_model_1.CartItem.findOne({ cart: cart._id, product: productId }).session(session);
                if (cartItem) {
                    cartItem.quantity += quantity;
                    cartItem.price = product.price * cartItem.quantity;
                    yield cartItem.save({ session });
                }
                else {
                    cartItem = new cart_item_model_1.CartItem({
                        product: productId,
                        quantity,
                        price: product.price * quantity
                    });
                    yield cartItem.save({ session });
                    cart.items.push(cartItem._id);
                }
                cart.totalAmount = yield this.calculateCartTotal(cart._id, session);
                yield cart.save({ session });
                yield session.commitTransaction();
                return cart;
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    static removeFromCart(userId, cartItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const cart = yield cart_model_1.Cart.findOne({ user: userId }).session(session);
                if (!cart) {
                    throw new Error('Cart not found');
                }
                cart.items = cart.items.filter(item => item.toString() !== cartItemId);
                yield cart_item_model_1.CartItem.findByIdAndDelete(cartItemId).session(session);
                cart.totalAmount = yield this.calculateCartTotal(cart._id, session);
                yield cart.save({ session });
                yield session.commitTransaction();
                return cart;
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    static updateCartItemQuantity(userId, cartItemId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const cart = yield cart_model_1.Cart.findOne({ user: userId }).session(session);
                if (!cart) {
                    throw new Error('Cart not found');
                }
                const cartItem = yield cart_item_model_1.CartItem.findById(cartItemId).populate('product').session(session);
                if (!cartItem) {
                    throw new Error('Cart item not found');
                }
                const product = cartItem.product;
                if (cartItem) {
                    if (((_a = product.stock) !== null && _a !== void 0 ? _a : 0) < quantity) {
                        throw new Error('Not enough stock');
                    }
                }
                cartItem.quantity = quantity;
                cartItem.price = product.price * quantity;
                yield cartItem.save({ session });
                cart.totalAmount = yield this.calculateCartTotal(cart._id, session);
                yield cart.save({ session });
                yield session.commitTransaction();
                return cart;
            }
            catch (error) {
                logger_1.default.error(error);
                yield session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    static clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const cart = yield cart_model_1.Cart.findOne({ user: userId }).session(session);
                if (!cart) {
                    throw new Error('Cart not found');
                }
                yield cart_item_model_1.CartItem.deleteMany({ _id: { $in: cart.items } }).session(session);
                cart.items = [];
                cart.totalAmount = 0;
                yield cart.save({ session });
                yield session.commitTransaction();
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    static calculateCartTotal(cartId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const cartItems = yield cart_item_model_1.CartItem.find({ _id: { $in: (_a = (yield cart_model_1.Cart.findById(cartId).session(session))) === null || _a === void 0 ? void 0 : _a.items } }).session(session);
            return cartItems.reduce((total, item) => total + item.price, 0);
        });
    }
}
exports.CartService = CartService;
