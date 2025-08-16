import { User, IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string
  ): Promise<IUser> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = new User({ name, email, password });
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;

    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Click the link to verify your email: ${process.env.BASE_URL}/v1/api/auth/verify/${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    return user;
  }

  static async verifyEmail(token: string): Promise<IUser> {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return user;
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; refreshToken: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.isVerified) {
      throw new Error("Email not verified. Please check your inbox.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1000m",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    user.refreshToken = refreshToken;
    await user.save();

    return { user, token, refreshToken };
  }

  static async refreshAccessToken(refreshToken: string): Promise<{ token: string }> {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      throw new Error("Invalid refresh token");
    }
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch (err) {
      throw new Error("Refresh token expired or invalid");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "10m",
    });
    return { token };
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${process.env.BASE_URL}/reset-password/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
  }

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Password reset token is invalid or has expired");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
}
