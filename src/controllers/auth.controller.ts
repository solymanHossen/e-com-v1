import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import logger from "../utils/logger";
import sendResponse from "../utils/response";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    await AuthService.register(name, email, password);
    sendResponse(res, 201, true, "User registered, verification email sent");
  } catch (error: any) {
    logger.error(error);
    sendResponse(res, 400, false, error.message);
  }

};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        await AuthService.verifyEmail(token);
        sendResponse(res, 200, true, "Email verified successfully");
    } catch (error:any) {
        logger.error(error);
        sendResponse(res, 400, false, error.message);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await AuthService.login(email, password);
        sendResponse(res, 200, true, "Login successful", {token , user});
    } catch (error:any) {
        logger.error(error);
        res.status(400).json({ message: error.message });
    }
};
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await AuthService.forgotPassword(email);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        console.log(token);
        const { password } = req.body;
        await AuthService.resetPassword(token, password);
        res.status(200).json({ message: 'Password has been reset' });
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};
