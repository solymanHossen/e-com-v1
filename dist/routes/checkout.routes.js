"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const checkout_controller_1 = require("../controllers/checkout.controller");
const checkout_validator_1 = require("../validators/checkout.validator");
const router = express_1.default.Router();
router.post('/create-checkout-session', auth_middleware_1.authMiddleware, checkout_validator_1.validateCreateCheckoutSession, checkout_controller_1.createCheckoutSession);
router.post('/confirm-order', checkout_validator_1.validateConfirmOrder, checkout_controller_1.confirmOrder);
router.get('/order-summary/:orderId', auth_middleware_1.authMiddleware, checkout_controller_1.getOrderSummary);
exports.default = router;
