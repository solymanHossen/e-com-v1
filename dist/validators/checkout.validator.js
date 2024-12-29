"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfirmOrder = exports.validateCreateCheckoutSession = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../utils/logger"));
const addressSchema = joi_1.default.object({
    fullName: joi_1.default.string().required(),
    addressLine1: joi_1.default.string().required(),
    addressLine2: joi_1.default.string().allow(''),
    city: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
    postalCode: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
});
const createCheckoutSessionSchema = joi_1.default.object({
    items: joi_1.default.array(),
    totalAmount: joi_1.default.number().positive().required(),
    subtotal: joi_1.default.number().positive().required(),
    tax: joi_1.default.number().min(0).required(),
    shippingCost: joi_1.default.number().min(0).required(),
    discountAmount: joi_1.default.number().min(0).default(0),
    finalAmount: joi_1.default.number().positive().required(),
    status: joi_1.default.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').default('pending'),
    paymentStatus: joi_1.default.string().valid('pending', 'paid', 'failed').default('pending'),
    paymentMethod: joi_1.default.string().valid('credit_card', 'paypal', 'cash_on_delivery').required(),
    paymentIntentId: joi_1.default.string().optional(),
    shippingAddress: addressSchema.required(),
    billingAddress: addressSchema.required(),
});
const confirmOrderSchema = joi_1.default.object({
    sessionId: joi_1.default.string().required(),
});
const validateCreateCheckoutSession = (req, res, next) => {
    const { error } = createCheckoutSessionSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateCreateCheckoutSession = validateCreateCheckoutSession;
const validateConfirmOrder = (req, res, next) => {
    const { error } = confirmOrderSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateConfirmOrder = validateConfirmOrder;
