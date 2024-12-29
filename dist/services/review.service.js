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
exports.ReviewService = void 0;
const review_model_1 = require("../models/review.model");
const product_model_1 = require("../models/product.model");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
class ReviewService {
    static createReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const review = new review_model_1.Review(reviewData);
                yield review.save({ session });
                const product = yield product_model_1.Product.findById(review.product).session(session);
                if (!product) {
                    throw new Error('Product not found');
                }
                product.reviews.push(review._id);
                product.reviewCount += 1;
                product.averageRating = (product.averageRating * (product.reviewCount - 1) + review.rating);
                yield product.save({ session });
                yield session.commitTransaction();
                return review;
            }
            catch (error) {
                yield session.abortTransaction();
                logger_1.default.error(error);
                throw error;
            }
            finally {
                yield session.endSession();
            }
        });
    }
    static getReviewsByProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return review_model_1.Review.find({ product: productId }).populate('user', 'name');
        });
    }
    static getReviewsByReview(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return review_model_1.Review.find({ _id: reviewId }).populate('user', 'name');
        });
    }
    static updateReview(reviewId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const review = yield review_model_1.Review.findByIdAndUpdate(reviewId, updateData, { new: true, session });
                if (!review) {
                    throw new Error('Review not found');
                }
                const product = yield product_model_1.Product.findById(review.product).session(session);
                if (!product) {
                    throw new Error('Product not found');
                }
                const reviews = yield review_model_1.Review.find({ product: product._id }).session(session);
                const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                product.averageRating = totalRating / reviews.length;
                yield product.save({ session });
                yield session.commitTransaction();
                return review;
            }
            catch (error) {
                yield session.abortTransaction();
                logger_1.default.error(error);
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    static deleteReview(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const review = yield review_model_1.Review.findByIdAndDelete(reviewId).session(session);
                if (!review) {
                    throw new Error('Review not found');
                }
                const product = yield product_model_1.Product.findById(review.product).session(session);
                if (!product) {
                    throw new Error('Product not found');
                }
                product.reviews = product.reviews.filter((r) => r.toString() !== reviewId);
                product.reviewCount -= 1;
                if (product.reviewCount > 0) {
                    const reviews = yield review_model_1.Review.find({ product: product._id }).session(session);
                    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                    product.averageRating = totalRating / reviews.length;
                }
                else {
                    product.averageRating = 0;
                }
                yield product.save({ session });
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
}
exports.ReviewService = ReviewService;
