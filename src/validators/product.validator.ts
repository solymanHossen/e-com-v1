import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    htmlDescription: Joi.string().required(),
    price: Joi.number().positive().required(),
    category: Joi.array().items(Joi.string()).required(),
    imageUrl: Joi.string().uri().required(),
});

export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

export const validateUpdateProduct = (req: Request, res: Response, next: NextFunction) => {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};