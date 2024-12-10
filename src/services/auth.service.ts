import { User, IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export class AuthService {
    static async register(name: string, email: string, password: string): Promise<IUser> {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = new User({ name, email, password });
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;

        await user.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Click the link to verify your email: ${process.env.BASE_URL}/api/auth/verify/${verificationToken}`,
        };

        await transporter.sendMail(mailOptions);

        return user;
    }

    static async verifyEmail(token: string): Promise<IUser> {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            throw new Error('Invalid or expired verification token');
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return user;
    }

    static async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.isVerified) {
            throw new Error('Email not verified. Please check your inbox.');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        return { user, token };
    }
}