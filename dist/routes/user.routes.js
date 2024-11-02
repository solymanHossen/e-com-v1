"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const user_validator_1 = require("../validators/user.validator");
const router = express_1.default.Router();
router.get('/profile', auth_middleware_1.authMiddleware, user_controller_1.getUserProfile);
router.put('/profile', auth_middleware_1.authMiddleware, user_validator_1.validateUpdateUser, user_controller_1.updateUserProfile);
router.delete('/profile', auth_middleware_1.authMiddleware, user_controller_1.deleteUser);
exports.default = router;
