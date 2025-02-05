"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidator = exports.forgotPasswordValidator = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyEmailValidator = exports.validateLogin = exports.validateRegister = void 0;
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
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.resetPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required().length(64).hex(),
    password: joi_1.default.string().required().min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .message('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});
const forgotPasswordValidator = (req, res, next) => {
    const { error } = exports.forgotPasswordSchema.validate(req.body);
    if (error) {
        logger_1.default.error('Forgot password validation failed:', error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.forgotPasswordValidator = forgotPasswordValidator;
const resetPasswordValidator = (req, res, next) => {
    const { error } = exports.resetPasswordSchema.validate(Object.assign(Object.assign({}, req.params), req.body));
    if (error) {
        logger_1.default.error('Reset password validation failed:', error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.resetPasswordValidator = resetPasswordValidator;
