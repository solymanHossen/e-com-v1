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
exports.AuthService = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    static register(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield user_model_1.User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const user = new user_model_1.User({ name, email, password });
            const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
            user.verificationToken = verificationToken;
            yield user.save();
            // Send verification email
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Verification',
                text: `Click the link to verify your email: ${process.env.BASE_URL}/api/auth/verify/${verificationToken}`,
            };
            yield transporter.sendMail(mailOptions);
            return user;
        });
    }
    static verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findOne({ verificationToken: token });
            if (!user) {
                throw new Error('Invalid or expired verification token');
            }
            user.isVerified = true;
            user.verificationToken = undefined;
            yield user.save();
            return user;
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            if (!user.isVerified) {
                throw new Error('Email not verified. Please check your inbox.');
            }
            const isMatch = yield user.comparePassword(password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { user, token };
        });
    }
}
exports.AuthService = AuthService;
