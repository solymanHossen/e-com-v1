import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from "../utils/logger";

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
});
 const verifyEmailSchema = Joi.object({
     token: Joi.string().required().length(64).hex()
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
export const verifyEmailValidator=(req: Request, res: Response, next: NextFunction):void => {
    const { error } = verifyEmailSchema.validate(req.params);
    if (error) {
        logger.error(error);
        res.status(400).json({ error: error.details[0].message });return;
    }
    next()
}
export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().length(64).hex(),
    password: Joi.string().required().min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .message('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

export const forgotPasswordValidator = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
        logger.error('Forgot password validation failed:', error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export const resetPasswordValidator = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = resetPasswordSchema.validate({ ...req.params, ...req.body });
    if (error) {
        logger.error('Reset password validation failed:', error);
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};