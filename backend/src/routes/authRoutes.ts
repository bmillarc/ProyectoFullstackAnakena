import express from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  getAllUsers
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const authRouter = express.Router();

// Public routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Protected routes
authRouter.get('/me', authenticate, getCurrentUser);
authRouter.get('/users', getAllUsers);

export default authRouter;
