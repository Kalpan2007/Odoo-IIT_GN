"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabaseClient_1 = require("../config/supabaseClient");
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }
        const token = authHeader.substring(7);
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error: JWT_SECRET is not configured'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const { data: profile, error: profileError } = await supabaseClient_1.supabase
            .from('profiles')
            .select('id, email, role')
            .eq('id', decoded.user_id)
            .single();
        if (profileError || !profile) {
            return res.status(401).json({
                success: false,
                message: 'User profile not found'
            });
        }
        req.user = {
            id: profile.id,
            email: profile.email || '',
            role: profile.role || 'team_member'
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.middleware.js.map