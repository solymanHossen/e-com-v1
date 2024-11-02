import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct, getProductsByCategory } from '../controllers/product.controller';
import { validateCreateProduct, validateUpdateProduct } from '../validators/product.validator';

const router = express.Router();

router.post('/', authMiddleware, validateCreateProduct, createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', authMiddleware, validateUpdateProduct, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.get('/category/:category', getProductsByCategory);

export default router;