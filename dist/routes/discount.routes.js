"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const discount_controller_1 = require("../controllers/discount.controller");
const discount_validator_1 = require("../validators/discount.validator");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authMiddleware, discount_validator_1.validateCreateDiscount, discount_controller_1.createDiscount);
router.get('/', discount_controller_1.getDiscounts);
router.put('/:id', auth_middleware_1.authMiddleware, discount_validator_1.validateUpdateDiscount, discount_controller_1.updateDiscount);
router.delete('/:id', auth_middleware_1.authMiddleware, discount_controller_1.deleteDiscount);
exports.default = router;
