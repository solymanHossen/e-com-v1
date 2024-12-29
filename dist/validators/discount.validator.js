"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateDiscount = exports.validateCreateDiscount = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../utils/logger"));
const discountSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    type: joi_1.default.string().valid('percentage', 'fixed').required(),
    value: joi_1.default.number().positive().required(),
    startDate: joi_1.default.date().iso().required(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')).required(),
    isActive: joi_1.default.boolean(),
    minPurchaseAmount: joi_1.default.number().min(0),
    applicableProducts: joi_1.default.array().items(joi_1.default.string()),
    applicableCategories: joi_1.default.array().items(joi_1.default.string()),
});
const updateDiscountSchema = joi_1.default.object({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    type: joi_1.default.string().valid('percentage', 'fixed'),
    value: joi_1.default.number().positive(),
    startDate: joi_1.default.date().iso(),
    endDate: joi_1.default.date().iso().when('startDate', {
        is: joi_1.default.exist(),
        then: joi_1.default.date().min(joi_1.default.ref('startDate')),
        otherwise: joi_1.default.date()
    }),
    isActive: joi_1.default.boolean(),
    minPurchaseAmount: joi_1.default.number().min(0),
    applicableProducts: joi_1.default.array().items(joi_1.default.string()),
    applicableCategories: joi_1.default.array().items(joi_1.default.string()),
});
const validateCreateDiscount = (req, res, next) => {
    const { error } = discountSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateCreateDiscount = validateCreateDiscount;
const validateUpdateDiscount = (req, res, next) => {
    const { error } = updateDiscountSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateUpdateDiscount = validateUpdateDiscount;
