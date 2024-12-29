"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddToWishlist = void 0;
const joi_1 = __importDefault(require("joi"));
const addToWishlistSchema = joi_1.default.object({
    productId: joi_1.default.string().required(),
});
const validateAddToWishlist = (req, res, next) => {
    const { error } = addToWishlistSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateAddToWishlist = validateAddToWishlist;
