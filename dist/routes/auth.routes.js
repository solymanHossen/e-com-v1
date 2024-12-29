"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../validators/auth.validator");
const router = express_1.default.Router();
router.post('/register', auth_validator_1.validateRegister, auth_controller_1.register);
router.get('/verify/:token', auth_validator_1.verifyEmailValidator, auth_controller_1.verifyEmail);
router.post('/login', auth_validator_1.validateLogin, auth_controller_1.login);
exports.default = router;
