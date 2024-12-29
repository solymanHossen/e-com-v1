"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyEmail = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const logger_1 = __importDefault(require("../utils/logger"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        yield auth_service_1.AuthService.register(name, email, password);
        res.status(201).json({ message: 'User registered, verification email sent' });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ message: error.message });
    }
});
exports.register = register;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        yield auth_service_1.AuthService.verifyEmail(token);
        res.status(200).json({ message: 'Email verified successfully' });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ message: error.message });
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { user, token } = yield auth_service_1.AuthService.login(email, password);
        res.status(200).json({
            message: 'Login successful',
            userId: user._id,
            token,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).json({ message: error.message });
    }
});
exports.login = login;
