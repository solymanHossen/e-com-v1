"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailValidator = exports.validateLogin = exports.validateRegister = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../utils/logger"));
const registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    name: joi_1.default.string().required(),
});
const verifyEmailSchema = joi_1.default.object({
    token: joi_1.default.string().required().length(64).hex()
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
const verifyEmailValidator = (req, res, next) => {
    const { error } = verifyEmailSchema.validate(req.params);
    if (error) {
        logger_1.default.error(error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.verifyEmailValidator = verifyEmailValidator;
