import { User, IUser } from '../models/user.model';
import {Schema} from "mongoose";

export class UserService {
    static async getUserById(id: string | Schema.Types.ObjectId): Promise<IUser | null> {
        return User.findById(id);
    }

    static async updateUser(id: string | Schema.Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async deleteUser(id: string | Schema.Types.ObjectId): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }

    static async getUserProfile(id: string | Schema.Types.ObjectId): Promise<IUser | null> {
        return User.findById(id).select('-password');
    }
}