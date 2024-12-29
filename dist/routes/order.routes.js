"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const order_controller_1 = require("../controllers/order.controller");
const order_validator_1 = require("../validators/order.validator");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authMiddleware, order_validator_1.validateCreateOrder, order_controller_1.createOrder);
router.get('/', auth_middleware_1.authMiddleware, order_controller_1.getOrders);
router.get('/:id', auth_middleware_1.authMiddleware, order_controller_1.getOrder);
router.patch('/:id/status', auth_middleware_1.authMiddleware, order_validator_1.validateUpdateOrderStatus, order_controller_1.updateOrderStatus);
exports.default = router;
