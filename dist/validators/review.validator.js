"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateReview = exports.validateCreateReview = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../utils/logger"));
const reviewSchema = joi_1.default.object({
    rating: joi_1.default.number().integer().min(1).max(5).required(),
    title: joi_1.default.string().max(100).required(),
    comment: joi_1.default.string().max(1000).required(),
});
const updateReviewSchema = joi_1.default.object({
    rating: joi_1.default.number().integer().min(1).max(5),
    title: joi_1.default.string().max(100),
    comment: joi_1.default.string().max(1000)
});
const validateCreateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateCreateReview = validateCreateReview;
const validateUpdateReview = (req, res, next) => {
    const { error } = updateReviewSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateUpdateReview = validateUpdateReview;
