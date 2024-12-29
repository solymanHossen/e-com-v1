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
exports.deleteReview = exports.updateReview = exports.getReviewsByProduct = exports.createReview = void 0;
const review_service_1 = require("../services/review.service");
const logger_1 = __importDefault(require("../utils/logger"));
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewData = Object.assign({ user: req.user._id, product: req.params.productId }, req.body);
        const review = yield review_service_1.ReviewService.createReview(reviewData);
        res.status(201).json(review);
    }
    catch (error) {
        res.status(400).json({ error: 'Error creating review' });
    }
});
exports.createReview = createReview;
const getReviewsByProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield review_service_1.ReviewService.getReviewsByProduct(req.params.productId);
        res.json(reviews);
    }
    catch (error) {
        res.status(400).json({ error: 'Error fetching reviews' });
    }
});
exports.getReviewsByProduct = getReviewsByProduct;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield review_service_1.ReviewService.updateReview(req.params.reviewId, req.body);
        if (!review) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        if (review.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ error: 'Not authorized to update this review' });
            return;
        }
        res.json(review);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: 'Error updating review' });
    }
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const reviewId = req.params.reviewId;
    try {
        const review = yield review_service_1.ReviewService.getReviewsByReview(reviewId);
        if (!review) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        if (review[0].user._id.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            res.status(403).json({ error: 'Not authorized to delete this review' });
            return;
        }
        yield review_service_1.ReviewService.deleteReview(reviewId);
        res.json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        logger_1.default.error(`Error deleting review with ID ${reviewId}: ${error.message}`);
        res.status(400).json({ error: 'Error deleting review' });
    }
});
exports.deleteReview = deleteReview;
