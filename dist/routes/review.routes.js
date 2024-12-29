"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const review_controller_1 = require("../controllers/review.controller");
const review_validator_1 = require("../validators/review.validator");
const router = express_1.default.Router();
router.post('/products/:productId/reviews', auth_middleware_1.authMiddleware, review_validator_1.validateCreateReview, review_controller_1.createReview);
router.get('/products/:productId/reviews', review_controller_1.getReviewsByProduct);
router.put('/reviews/:reviewId', auth_middleware_1.authMiddleware, review_validator_1.validateUpdateReview, review_controller_1.updateReview);
router.delete('/reviews/:reviewId', auth_middleware_1.authMiddleware, review_controller_1.deleteReview);
exports.default = router;
