import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from "../utils/logger";

export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const reviewData = {
            user: req.user!._id,
            product: req.params.productId,
            ...req.body
        };
        const review = await ReviewService.createReview(reviewData);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: 'Error creating review' });
    }
};

export const getReviewsByProduct = async (req: Request, res: Response) => {
    try {
        const reviews = await ReviewService.getReviewsByProduct(req.params.productId);
        res.json(reviews);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching reviews' });
    }
};

export const updateReview = async (req: AuthRequest, res: Response):Promise<void> => {
    try {
        const review = await ReviewService.updateReview(req.params.reviewId, req.body);
        if (!review) {
             res.status(404).json({ error: 'Review not found' }); return;
        }
        if (review.user.toString() !== req.user!._id.toString()) {
             res.status(403).json({ error: 'Not authorized to update this review' }); return ;
        }
        res.json(review);
    } catch (error){
        logger.error(error);
        res.status(400).json({ error: 'Error updating review' });
    }
};

export const deleteReview = async (req: AuthRequest, res: Response):Promise<void> => {
    try {
        const review = await ReviewService.getReviewsByProduct(req.params.reviewId);
        // console.log(review,req.params.reviewId,'check this');
        if (!review) {
             res.status(404).json({ error: 'Review not found' }); return ;
        }
        console.log(review[0].user,'this si the first user')
        if (review[0].user.toString() !== req.user!._id.toString()) {
            res.status(403).json({ error: 'Not authorized to delete this review' }); return ;
        }
        await ReviewService.deleteReview(req.params.reviewId);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(400).json({ error: 'Error deleting review' });
    }
};
