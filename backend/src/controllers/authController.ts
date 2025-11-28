import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserModel from '../models/user';
import { AuthRequest } from '../middleware/authMiddleware';
import { JWT_SECRET } from '../middleware/authMiddleware';
import { RequestWithUserId } from '../middleware/auth';

//Generate JWT token with CSRF token embedded
const generateToken = (userId: string, csrfToken: string): string => {
  return jwt.sign({ id: userId, csrf: csrfToken }, JWT_SECRET, {
    expiresIn: '1h' //Token expires in 1 hour
  });
};

//Generate CSRF token
const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

//Set cookie options
const getCookieOptions = () => ({
  httpOnly: true, //Protects against XSS
  secure: process.env.NODE_ENV === 'production', 
  sameSite: 'strict' as const, //Protects against CSRF
  maxAge: 3600000, // 1 hour in milliseconds
  path: '/'
});

//Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    //Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Please provide username, email, and password'
      });
    }

    //Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    //Create new user
    const user = new UserModel({
      username,
      email,
      password
    });

    await user.save();

    //Generate CSRF token and JWT
    const csrfToken = generateCsrfToken();
    const token = generateToken(user._id.toString(), csrfToken);

    //Set httpOnly cookie
    res.cookie('token', token, getCookieOptions());

    //Return user info with CSRF token (password excluded by toJSON transform)
    return res.status(201).json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      csrfToken
    });
  } catch (error: any) {
    console.error('Register error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Error creating user' });
  }
};

//Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password'
      });
    }

    //Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    //Generate CSRF token and JWT
    const csrfToken = generateCsrfToken();
    const token = generateToken(user._id.toString(), csrfToken);

    //Set httpOnly cookie
    res.cookie('token', token, getCookieOptions());

    //Return user info with CSRF token
    return res.json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      csrfToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Error logging in' });
  }
};

//Logout user
export const logout = async (_req: Request, res: Response) => {
  try {
    //Clear cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Error logging out' });
  }
};

// Get current user (session endpoint)
export const getCurrentUser = async (req: AuthRequest & RequestWithUserId, res: Response) => {
  try {
    // Support both auth middlewares: authMiddleware sets req.user, auth sets req.userId
    const userId = (req.user && req.user.id) || req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return a consistent shape matching frontend expectations (LoginResponse/User)
    return res.json({
      id: user._id.toString(),
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Error getting user info' });
  }
};

// Get all users (for admin purposes)
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find({}).select('-password');
    return res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ error: 'Error getting users' });
  }
};
