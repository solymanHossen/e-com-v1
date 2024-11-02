"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const updateUserSchema = joi_1.default.object({
    name: joi_1.default.string(),
    profilePicture: joi_1.default.string().uri(),
    bio: joi_1.default.string(),
    address: joi_1.default.object({
        street: joi_1.default.string(),
        city: joi_1.default.string(),
        state: joi_1.default.string(),
        zipCode: joi_1.default.string(),
        country: joi_1.default.string(),
    }),
    phoneNumber: joi_1.default.string(),
});
const validateUpdateUser = (req, res, next) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error)
        return res.status(400).json({ error: error.details[0].message });
    next();
};
exports.validateUpdateUser = validateUpdateUser;
