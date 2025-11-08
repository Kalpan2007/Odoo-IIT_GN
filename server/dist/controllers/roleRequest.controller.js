"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleRequest = exports.getMyRoleRequests = exports.getRoleRequests = exports.createRoleRequest = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.createRoleRequest = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { requested_role, reason } = req.body;
        const userId = req.user.id;
        if (!['project_manager'].includes(requested_role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role request. You can only request project manager role.'
            });
        }
        if (req.user.role === requested_role) {
            return res.status(400).json({
                success: false,
                message: `You already have the ${requested_role} role.`
            });
        }
        const { data: existingRequests, error: existingError } = await supabaseClient_1.supabaseAdmin
            .from('role_requests')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'pending');
        if (existingError) {
            console.error('Error checking existing requests:', existingError);
            return res.status(500).json({
                success: false,
                message: 'Failed to check existing requests'
            });
        }
        if (existingRequests && existingRequests.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending role request.'
            });
        }
        const { data: roleRequest, error } = await supabaseClient_1.supabaseAdmin
            .from('role_requests')
            .insert({
            user_id: userId,
            current_user_role: req.user.role,
            requested_role,
            reason,
            status: 'pending'
        })
            .select()
            .single();
        if (error) {
            console.error('Role request creation error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create role request'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Role change request submitted successfully',
            role_request: roleRequest
        });
    }
    catch (error) {
        console.error('Unexpected error in createRoleRequest:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
});
exports.getRoleRequests = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        const { data: roleRequests, error } = await supabaseClient_1.supabaseAdmin
            .from('role_requests')
            .select(`
        *,
        user:profiles(full_name, email)
      `)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Role requests fetch error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch role requests'
            });
        }
        res.json({
            success: true,
            role_requests: roleRequests
        });
    }
    catch (error) {
        console.error('Unexpected error in getRoleRequests:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
});
exports.getMyRoleRequests = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: roleRequests, error } = await supabaseClient_1.supabaseAdmin
            .from('role_requests')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('User role requests fetch error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch your role requests'
            });
        }
        res.json({
            success: true,
            role_requests: roleRequests
        });
    }
    catch (error) {
        console.error('Unexpected error in getMyRoleRequests:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
});
exports.updateRoleRequest = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        const { id } = req.params;
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved or rejected.'
            });
        }
        const { data: roleRequest, error: fetchError } = await supabaseClient_1.supabaseAdmin
            .from('role_requests')
            .select('*')
            .eq('id', id)
            .single();
        if (fetchError || !roleRequest) {
            return res.status(404).json({
                success: false,
                message: 'Role request not found'
            });
        }
        const { data: updatedRequest, error: updateError } = await supabaseClient_1.supabaseAdmin
            .from('role_requests')
            .update({
            status,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (updateError) {
            console.error('Role request update error:', updateError);
            return res.status(500).json({
                success: false,
                message: 'Failed to update role request'
            });
        }
        if (status === 'approved') {
            const { error: profileError } = await supabaseClient_1.supabaseAdmin
                .from('profiles')
                .update({ role: roleRequest.requested_role })
                .eq('id', roleRequest.user_id);
            if (profileError) {
                console.error('Profile update error:', profileError);
            }
        }
        res.json({
            success: true,
            message: `Role request ${status} successfully`,
            role_request: updatedRequest
        });
    }
    catch (error) {
        console.error('Unexpected error in updateRoleRequest:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
});
//# sourceMappingURL=roleRequest.controller.js.map