import express from 'express';
import {register, login, verifyEmail, forgotPassword, resetPassword, refreshToken} from '../controllers/auth.controller';
import {
    validateRegister,
    validateLogin,
    verifyEmailValidator,
    forgotPasswordValidator, resetPasswordValidator
} from '../validators/auth.validator';

const router = express.Router();

router.post('/register', validateRegister, register);
router.get('/verify/:token',verifyEmailValidator, verifyEmail);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, resetPassword);
router.post('/refresh-token', refreshToken);

export default router;