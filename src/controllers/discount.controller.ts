import { Request, Response } from 'express';
import { DiscountService } from '../services/discount.service';

export const createDiscount = async (req: Request, res: Response) => {
    try {
        const discount = await DiscountService.createDiscount(req.body);
        res.status(201).json(discount);
    } catch (error) {
        res.status(400).json({ error: 'Error creating discount' });
    }
};

export const getDiscounts = async (req: Request, res: Response) => {
    try {
        const discounts = await DiscountService.getDiscounts();
        res.json(discounts);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching discounts' });
    }
};

export const updateDiscount = async (req: Request, res: Response) => {
    try {
        const discount = await DiscountService.updateDiscount(req.params.id, req.body);
        if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
        }
        res.json(discount);
    } catch (error) {
        res.status(400).json({ error: 'Error updating discount' });
    }
};

export const deleteDiscount = async (req: Request, res: Response) => {
    try {
        const discount = await DiscountService.deleteDiscount(req.params.id);
        if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
        }
        res.json({ message: 'Discount deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting discount' });
    }
};