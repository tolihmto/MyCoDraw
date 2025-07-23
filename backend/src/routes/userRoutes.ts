import { Router } from 'express';
import UserController from '../controllers/userController';

const router = Router();
const userController = new UserController();

// User registration
router.post('/register', userController.register);

// User login
router.post('/login', userController.login);

// Get user profile
router.get('/profile/:id', userController.getProfile);

// Update user profile
router.put('/profile/:id', userController.updateProfile);

// Delete user account
router.delete('/profile/:id', userController.deleteAccount);

export default router;