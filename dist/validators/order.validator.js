"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateOrderStatus = exports.validateCreateOrder = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../utils/logger"));
const orderSchema = joi_1.default.object({
    items: joi_1.default.array().items(joi_1.default.object({
        product: joi_1.default.string().required(),
        quantity: joi_1.default.number().integer().min(1).required(),
    })).required(),
    user: joi_1.default.string(),
    subtotal: joi_1.default.number(),
    totalPrice: joi_1.default.number().positive(),
    totalAmount: joi_1.default.number().positive(),
    status: joi_1.default.string().valid(),
    finalAmount: joi_1.default.number().positive(),
});
const orderStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('pending', 'processing', 'shipped', 'delivered').required(),
});
const validateCreateOrder = (req, res, next) => {
    const { error } = orderSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateCreateOrder = validateCreateOrder;
const validateUpdateOrderStatus = (req, res, next) => {
    const { error } = orderStatusSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateUpdateOrderStatus = validateUpdateOrderStatus;
