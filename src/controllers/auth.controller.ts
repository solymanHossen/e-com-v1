import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const register = async (req: Request, res: Response):Promise<void> => {
    try {
        const { email, password, name } = req.body;
        const user = new User({ email, password, name });
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response):Promise<void> => {
    try {
        const { email, password } =   req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ error: 'Invalid credentials' }); return;
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string);
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
};