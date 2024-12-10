import express from 'express';
import { register, login,verifyEmail } from '../controllers/auth.controller';
import {validateRegister, validateLogin, verifyEmailValidator} from '../validators/auth.validator';

const router = express.Router();

router.post('/register', validateRegister, register);
router.get('/verify/:token',verifyEmailValidator, verifyEmail);
router.post('/login', validateLogin, login);

export default router;