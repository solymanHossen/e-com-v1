"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProduct = exports.validateCreateProduct = void 0;
const joi_1 = __importDefault(require("joi"));
const productSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    htmlDescription: joi_1.default.string().required(),
    price: joi_1.default.number().positive().required(),
    category: joi_1.default.array().items(joi_1.default.string()).required(),
    imageUrl: joi_1.default.string().uri().required(),
});
const validateCreateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error)
        return res.status(400).json({ error: error.details[0].message });
    next();
};
exports.validateCreateProduct = validateCreateProduct;
const validateUpdateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error)
        return res.status(400).json({ error: error.details[0].message });
    next();
};
exports.validateUpdateProduct = validateUpdateProduct;
