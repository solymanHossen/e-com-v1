"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const cart_controller_1 = require("../controllers/cart.controller");
const cart_validator_1 = require("../validators/cart.validator");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authMiddleware, cart_controller_1.getCart);
router.post('/add', auth_middleware_1.authMiddleware, cart_validator_1.validateAddToCart, cart_controller_1.addToCart);
router.delete('/remove/:cartItemId', auth_middleware_1.authMiddleware, cart_controller_1.removeFromCart);
router.put('/update/:cartItemId', auth_middleware_1.authMiddleware, cart_validator_1.validateUpdateCartItem, cart_controller_1.updateCartItemQuantity);
router.delete('/clear', auth_middleware_1.authMiddleware, cart_controller_1.clearCart);
exports.default = router;
