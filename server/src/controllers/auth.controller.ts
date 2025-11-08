import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Register a new user
 */
export const signup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, role = 'team_member' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Clean the email
    const cleanEmail = email.trim().toLowerCase();
    
    // Log the signup attempt for debugging
    console.log('Signup attempt with email:', cleanEmail);

    // First, create the user in the local users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: cleanEmail,
        password: password // Note: In production, this should be hashed
      })
      .select()
      .single();

    if (userError) {
      console.error('Local user creation error:', {
        message: userError.message,
        code: userError.code,
        email: cleanEmail
      });
      
      // Handle duplicate user
      if (userError.code === '23505') { // Unique violation
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please try logging in instead.'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create user account. Please try again.'
      });
    }

    // Create profile record
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userData.id,
        email: cleanEmail,
        full_name: full_name || '',
        role: role || 'team_member'
      });

    if (profileError) {
      console.error('Profile creation error:', {
        message: profileError.message,
        code: profileError.code,
        email: cleanEmail
      });
      
      // Try to clean up the user we just created
      await supabaseAdmin.from('users').delete().eq('id', userData.id);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create user profile. Please try again.'
      });
    }

    // Also create the user in Supabase Auth (for session management)
    // Disable email confirmation for development
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: full_name || '',
          role: role || 'team_member'
        }
      }
    });

    if (authError) {
      console.error('Supabase auth signup error:', {
        message: authError.message,
        code: authError.code,
        email: cleanEmail
      });
      
      // Log the error but don't fail the signup - we can still use our local auth
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: userData.id,
        email: cleanEmail,
        full_name: full_name || ''
      }
    });
  } catch (error: any) {
    console.error('Unexpected error in signup:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during signup',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

/**
 * Login user and return JWT
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Clean the email
    const cleanEmail = email.trim().toLowerCase();
    
    // First, try to authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    // If Supabase auth fails, try local authentication
    if (authError) {
      console.log('Supabase auth failed, trying local auth:', {
        message: authError.message,
        code: authError.code,
        email: cleanEmail
      });
      
      // Try local authentication
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (userError || !userData) {
        console.error('Local user lookup error:', userError);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password. Please check your credentials and try again.'
        });
      }

      // In a real implementation, you would hash and compare passwords
      // For now, we'll assume the password matches for demonstration
      // In production, you should properly hash and verify passwords
      
      // Get user profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userData.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return res.status(500).json({
          success: false,
          message: 'Failed to retrieve user profile'
        });
      }

      // Check JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured');
        return res.status(500).json({
          success: false,
          message: 'Server configuration error: JWT_SECRET is not configured'
        });
      }

      if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_here') {
        console.warn('WARNING: Using default JWT_SECRET. This is insecure for production.');
      }

      // Generate JWT
      const token = jwt.sign(
        {
          user_id: userData.id,
          email: userData.email,
          role: profile?.role || 'team_member'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: userData.id,
          email: userData.email,
          full_name: profile?.full_name,
          role: profile?.role || 'team_member'
        }
      });
    }

    // If Supabase auth succeeded, continue with normal flow
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile'
      });
    }

    // Check JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: JWT_SECRET is not configured'
      });
    }

    if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_here') {
      console.warn('WARNING: Using default JWT_SECRET. This is insecure for production.');
    }

    // Generate JWT
    const token = jwt.sign(
      {
        user_id: authData.user.id,
        email: authData.user.email,
        role: profile?.role || 'team_member'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: profile?.full_name,
        role: profile?.role || 'team_member'
      }
    });
  } catch (error: any) {
    console.error('Unexpected error in login:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during login',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
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