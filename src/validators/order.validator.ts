import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const orderSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            product: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
        })
    ).required(),
});

const orderStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered').required(),
});

export const validateCreateOrder = (req: Request, res: Response, next: NextFunction) => {
    const { error } = orderSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

export const validateUpdateOrderStatus = (req: Request, res: Response, next: NextFunction) => {
    const { error } = orderStatusSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};