import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from "../utils/logger";

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const validateRegister = (req: Request, res: Response, next: NextFunction):void => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        logger.error(error);
        res.status(400).json({ error: error.details[0].message }); return;
    }
    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction):void => {
    const { error } = loginSchema.validate(req.body);
    if (error){
        logger.error(error);
         res.status(400).json({ error: error.details[0].message });return;
    }
    next();
};