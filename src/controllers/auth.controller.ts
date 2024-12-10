import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import logger from "../utils/logger";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        await AuthService.register(name, email, password);
        res.status(201).json({ message: 'User registered, verification email sent' });
    } catch (error:any) {
        logger.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        await AuthService.verifyEmail(token);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error:any) {
        logger.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await AuthService.login(email, password);
        res.status(200).json({
            message: 'Login successful',
            userId: user._id,
            token,
        });
    } catch (error:any) {
        logger.error(error);
        res.status(400).json({ message: error.message });
    }
};