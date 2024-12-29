"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const promotion_controller_1 = require("../controllers/promotion.controller");
const promotion_validator_1 = require("../validators/promotion.validator");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authMiddleware, promotion_validator_1.validateCreatePromotion, promotion_controller_1.createPromotion);
router.get('/', promotion_controller_1.getPromotions);
router.put('/:id', auth_middleware_1.authMiddleware, promotion_validator_1.validateUpdatePromotion, promotion_controller_1.updatePromotion);
router.delete('/:id', auth_middleware_1.authMiddleware, promotion_controller_1.deletePromotion);
router.get('/:id/effectiveness', auth_middleware_1.authMiddleware, promotion_controller_1.getPromotionEffectiveness);
exports.default = router;
