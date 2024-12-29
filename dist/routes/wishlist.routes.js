"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const wishlist_validator_1 = require("../validators/wishlist.validator");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authMiddleware, wishlist_controller_1.getWishlist);
router.post('/add', auth_middleware_1.authMiddleware, wishlist_validator_1.validateAddToWishlist, wishlist_controller_1.addToWishlist);
router.delete('/remove/:productId', auth_middleware_1.authMiddleware, wishlist_controller_1.removeFromWishlist);
router.delete('/clear', auth_middleware_1.authMiddleware, wishlist_controller_1.clearWishlist);
router.post('/share', auth_middleware_1.authMiddleware, wishlist_controller_1.generateShareableLink);
router.get('/shared/:shareableLink', wishlist_controller_1.getSharedWishlist);
router.get('/discounts', auth_middleware_1.authMiddleware, wishlist_controller_1.checkForDiscounts);
exports.default = router;
