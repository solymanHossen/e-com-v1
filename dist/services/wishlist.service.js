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
exports.WishlistService = void 0;
const wishlist_model_1 = require("../models/wishlist.model");
const user_model_1 = require("../models/user.model");
const product_model_1 = require("../models/product.model");
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
class WishlistService {
    static getWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return wishlist_model_1.Wishlist.findOne({ user: userId }).populate('products');
        });
    }
    static addToWishlist(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                let wishlist = yield wishlist_model_1.Wishlist.findOne({ user: userId }).session(session);
                if (!wishlist) {
                    wishlist = new wishlist_model_1.Wishlist({ user: userId, products: [] });
                    yield wishlist.save({ session });
                    yield user_model_1.User.findByIdAndUpdate(userId, { wishlist: wishlist._id }, { session });
                }
                const product = yield product_model_1.Product.findById(productId).session(session);
                if (!product) {
                    throw new Error('Product not found');
                }
                if (!wishlist.products.includes(productId)) {
                    wishlist.products.push(productId);
                    yield wishlist.save({ session });
                }
                yield session.commitTransaction();
                return wishlist;
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
    static removeFromWishlist(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wishlist = yield wishlist_model_1.Wishlist.findOne({ user: userId });
            if (!wishlist) {
                throw new Error('Wishlist not found');
            }
            const product = wishlist.products;
            wishlist.products = product.filter(id => id.toString() !== productId);
            yield wishlist.save();
            return wishlist;
        });
    }
    static clearWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wishlist = yield wishlist_model_1.Wishlist.findOne({ user: userId });
            console.log(wishlist, 'this is wishlist');
            if (!wishlist) {
                throw new Error('Wishlist not found');
            }
            wishlist.products = [];
            yield wishlist.save();
        });
    }
    static generateShareableLink(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wishlist = yield wishlist_model_1.Wishlist.findOne({ user: userId });
            if (!wishlist) {
                throw new Error('Wishlist not found');
            }
            if (!wishlist.shareableLink) {
                wishlist.shareableLink = crypto_1.default.randomBytes(16).toString('hex');
                yield wishlist.save();
            }
            return wishlist.shareableLink;
        });
    }
    static getWishlistByShareableLink(shareableLink) {
        return __awaiter(this, void 0, void 0, function* () {
            return wishlist_model_1.Wishlist.findOne({ shareableLink }).populate('products');
        });
    }
    static checkForDiscounts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wishlist = yield wishlist_model_1.Wishlist.findOne({ user: userId }).populate('products');
            if (!wishlist) {
                throw new Error('Wishlist not found');
            }
            const discountedItems = wishlist.products.map((product) => {
                if (product.discountPercentage > 0) {
                    return { productId: product._id, discount: product.discountPercentage };
                }
                return null;
            }).filter(item => item !== null);
            return discountedItems;
        });
    }
}
exports.WishlistService = WishlistService;
