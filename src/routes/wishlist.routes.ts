import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getWishlist,addToWishlist,removeFromWishlist } from '../controllers/wishlist.controller';
import { validateAddToWishlist } from '../validators/wishlist.validator';

const router = express.Router();

router.get('/', authMiddleware, getWishlist);
router.post('/add', authMiddleware, validateAddToWishlist, addToWishlist);
router.delete('/remove/:productId', authMiddleware, removeFromWishlist);
/*router.delete('/clear', authMiddleware, clearWishlist);
router.post('/share', authMiddleware, generateShareableLink);
router.get('/shared/:shareableLink', getSharedWishlist);
router.get('/discounts', authMiddleware, checkForDiscounts);*/

export default router;