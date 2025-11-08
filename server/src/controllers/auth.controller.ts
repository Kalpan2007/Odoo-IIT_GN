import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Register a new user
 */

// @ts-ignore
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, full_name, role = 'team_member' } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Sign up user with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role
      }
    }
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Create profile record
  if (data.user) {
    await supabaseAdmin
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name,
        role
      });
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: data.user?.id,
      email: data.user?.email,
      full_name
    }
  });
});

/**
 * Login user and return JWT
 */
// @ts-ignore
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Sign in with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  // Generate JWT
  const token = jwt.sign(
    {
      user_id: data.user.id,
      email: data.user.email,
      role: profile?.role || 'team_member'
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: data.user.id,
      email: data.user.email,
      full_name: profile?.full_name,
      role: profile?.role || 'team_member'
    }
  });
});

/**
 * Logout user
 */
// @ts-ignore
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * Get current user profile
 */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user!.id)
    .single();

  res.json({
    success: true,
    user: profile
  });
});

/**
 * Get all users (admin only)
 */
// @ts-ignore
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    users: profiles
  });
});

/**
 * Update user role (admin only)
 */
// @ts-ignore
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'project_manager', 'team_member'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role'
    });
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    message: 'User role updated successfully',
    user: data
  });
});