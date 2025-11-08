"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.getUsers = exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.signup = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { email, password, full_name, role = 'team_member' } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        const cleanEmail = email.trim().toLowerCase();
        console.log('Signup attempt with email:', cleanEmail);
        const { data: userData, error: userError } = await supabaseClient_1.supabaseAdmin
            .from('users')
            .insert({
            email: cleanEmail,
            password: password
        })
            .select()
            .single();
        if (userError) {
            console.error('Local user creation error:', {
                message: userError.message,
                code: userError.code,
                email: cleanEmail
            });
            if (userError.code === '23505') {
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
        const { error: profileError } = await supabaseClient_1.supabaseAdmin
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
            await supabaseClient_1.supabaseAdmin.from('users').delete().eq('id', userData.id);
            return res.status(500).json({
                success: false,
                message: 'Failed to create user profile. Please try again.'
            });
        }
        const { data: authData, error: authError } = await supabaseClient_1.supabase.auth.signUp({
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
    }
    catch (error) {
        console.error('Unexpected error in signup:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred during signup',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
});
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        const cleanEmail = email.trim().toLowerCase();
        const { data: authData, error: authError } = await supabaseClient_1.supabase.auth.signInWithPassword({
            email: cleanEmail,
            password
        });
        if (authError) {
            console.log('Supabase auth failed, trying local auth:', {
                message: authError.message,
                code: authError.code,
                email: cleanEmail
            });
            const { data: userData, error: userError } = await supabaseClient_1.supabaseAdmin
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
            const { data: profile, error: profileError } = await supabaseClient_1.supabaseAdmin
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
            const token = jsonwebtoken_1.default.sign({
                user_id: userData.id,
                email: userData.email,
                role: profile?.role || 'team_member'
            }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
        const { data: profile, error: profileError } = await supabaseClient_1.supabase
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
        const token = jsonwebtoken_1.default.sign({
            user_id: authData.user.id,
            email: authData.user.email,
            role: profile?.role || 'team_member'
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('Unexpected error in login:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred during login',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
});
exports.logout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { error } = await supabaseClient_1.supabase.auth.signOut();
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
exports.getMe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { data: profile } = await supabaseClient_1.supabase
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();
    res.json({
        success: true,
        user: profile
    });
});
exports.getUsers = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { data: profiles, error } = await supabaseClient_1.supabaseAdmin
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
exports.updateUserRole = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!['admin', 'project_manager', 'team_member'].includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role'
        });
    }
    const { data, error } = await supabaseClient_1.supabaseAdmin
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
//# sourceMappingURL=auth.controller.js.map