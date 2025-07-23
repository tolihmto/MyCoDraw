import { Request, Response } from 'express';
import User from '../models/User';

class UserController {
    async register(req: Request, res: Response) {
        const { username, email, password } = req.body;
        try {
            const newUser = new User({ username, email, password });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(400).json({ message: 'Error registering user', error });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            res.status(400).json({ message: 'Error logging in', error });
        }
    }

    async getProfile(req: Request, res: Response) {
        const userId = req.params.id;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: 'Error fetching user profile', error });
        }
    }

    async updateProfile(req: Request, res: Response) {
        const userId = req.params.id;
        const updates = req.body;
        try {
            const user = await User.findByIdAndUpdate(userId, updates, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'Profile updated successfully', user });
        } catch (error) {
            res.status(400).json({ message: 'Error updating profile', error });
        }
    }

    async deleteAccount(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            // TODO: Add logic to delete user from database
            res.status(200).json({ message: 'User account deleted successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user account.' });
        }
    }
}

export default UserController;