"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateCartItem = exports.validateAddToCart = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../utils/logger"));
const addToCartSchema = joi_1.default.object({
    productId: joi_1.default.string().required(),
    quantity: joi_1.default.number().integer().min(1).required(),
});
const updateCartItemSchema = joi_1.default.object({
    quantity: joi_1.default.number().integer().min(1).required(),
});
const validateAddToCart = (req, res, next) => {
    const { error } = addToCartSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateAddToCart = validateAddToCart;
const validateUpdateCartItem = (req, res, next) => {
    const { error } = updateCartItemSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateUpdateCartItem = validateUpdateCartItem;
