import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from "../utils/logger";

const discountSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().valid('percentage', 'fixed').required(),
    value: Joi.number().positive().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    isActive: Joi.boolean(),
    minPurchaseAmount: Joi.number().min(0),
    applicableProducts: Joi.array().items(Joi.string()),
    applicableCategories: Joi.array().items(Joi.string()),
});

export const validateCreateDiscount = (req: Request, res: Response, next: NextFunction):void => {
    const { error } = discountSchema.validate(req.body);
    if (error) {
        logger.error(error);
        res.status(400).json({ error: error.details[0].message }); return;
    }
    next();
};

export const validateUpdateDiscount = (req: Request, res: Response, next: NextFunction):void => {
    const { error } = discountSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message }); return;
    }
    next();
};