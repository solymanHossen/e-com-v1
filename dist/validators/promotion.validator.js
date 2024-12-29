"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePromotion = exports.validateCreatePromotion = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../utils/logger"));
const promotionSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    type: joi_1.default.string().valid('percentage', 'fixed').required(),
    value: joi_1.default.number().positive().required(),
    code: joi_1.default.string().required(),
    startDate: joi_1.default.date().iso().required(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')).required(),
    isActive: joi_1.default.boolean(),
    usageLimit: joi_1.default.number().integer().min(1).required(),
    usageCount: joi_1.default.number().integer(),
    minPurchaseAmount: joi_1.default.number().min(0),
    applicableProducts: joi_1.default.array().items(joi_1.default.string()),
    applicableCategories: joi_1.default.array().items(joi_1.default.string()),
});
const updatePromotionSchema = joi_1.default.object({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    type: joi_1.default.string().valid('percentage', 'fixed'),
    value: joi_1.default.number().positive(),
    code: joi_1.default.string(),
    startDate: joi_1.default.date().iso(),
    endDate: joi_1.default.date().iso().when('startDate', {
        is: joi_1.default.exist(),
        then: joi_1.default.date().min(joi_1.default.ref('startDate')),
        otherwise: joi_1.default.date()
    }),
    isActive: joi_1.default.boolean(),
    usageLimit: joi_1.default.number().integer().min(1),
    usageCount: joi_1.default.number().integer(),
    minPurchaseAmount: joi_1.default.number().min(0),
    applicableProducts: joi_1.default.array().items(joi_1.default.string()),
    applicableCategories: joi_1.default.array().items(joi_1.default.string())
});
const validateCreatePromotion = (req, res, next) => {
    const { error } = promotionSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateCreatePromotion = validateCreatePromotion;
const validateUpdatePromotion = (req, res, next) => {
    const { error } = updatePromotionSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateUpdatePromotion = validateUpdatePromotion;
