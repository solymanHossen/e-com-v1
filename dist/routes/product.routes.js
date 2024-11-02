"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const product_controller_1 = require("../controllers/product.controller");
const product_validator_1 = require("../validators/product.validator");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authMiddleware, product_validator_1.validateCreateProduct, product_controller_1.createProduct);
router.get('/', product_controller_1.getProducts);
router.get('/:id', product_controller_1.getProduct);
router.put('/:id', auth_middleware_1.authMiddleware, product_validator_1.validateUpdateProduct, product_controller_1.updateProduct);
router.delete('/:id', auth_middleware_1.authMiddleware, product_controller_1.deleteProduct);
router.get('/category/:category', product_controller_1.getProductsByCategory);
exports.default = router;
