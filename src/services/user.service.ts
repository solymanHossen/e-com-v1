import { User, IUser } from '../models/user.model';

export class UserService {
    static async getUserById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    static async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async deleteUser(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }

    static async getUserProfile(id: string): Promise<IUser | null> {
        return User.findById(id).select('-password');
    }
}