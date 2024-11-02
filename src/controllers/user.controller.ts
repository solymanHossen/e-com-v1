import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await UserService.getUserProfile(req.user!._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const updatedUser = await UserService.updateUser(req.user!._id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const deletedUser = await UserService.deleteUser(req.user!._id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};