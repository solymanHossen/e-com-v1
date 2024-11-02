import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const updateUserSchema = Joi.object({
    name: Joi.string(),
    profilePicture: Joi.string().uri(),
    bio: Joi.string(),
    address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        country: Joi.string(),
    }),
    phoneNumber: Joi.string(),
});

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};