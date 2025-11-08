import { Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateRoleRequest, UpdateRoleRequest } from '../models/roleRequest.model';

/**
 * Create a new role change request
 */
export const createRoleRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { requested_role, reason } = req.body as CreateRoleRequest;
    const userId = req.user!.id;

    // Validate requested role
    if (!['project_manager'].includes(requested_role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role request. You can only request project manager role.'
      });
    }

    // Check if user already has this role
    if (req.user!.role === requested_role) {
      return res.status(400).json({
        success: false,
        message: `You already have the ${requested_role} role.`
      });
    }

    // Check if there's already a pending request
    const { data: existingRequests, error: existingError } = await supabaseAdmin
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

    // Create role request
    const { data: roleRequest, error } = await supabaseAdmin
      .from('role_requests')
      .insert({
        user_id: userId,
        current_user_role: req.user!.role, // Use the correct column name
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
  } catch (error: any) {
    console.error('Unexpected error in createRoleRequest:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

/**
 * Get all role requests (admin only)
 */
export const getRoleRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can view all role requests
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const { data: roleRequests, error } = await supabaseAdmin
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
  } catch (error: any) {
    console.error('Unexpected error in getRoleRequests:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

/**
 * Get role requests for current user
 */
export const getMyRoleRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const { data: roleRequests, error } = await supabaseAdmin
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
  } catch (error: any) {
    console.error('Unexpected error in getMyRoleRequests:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

/**
 * Update role request status (admin only)
 */
export const updateRoleRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can update role requests
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const { id } = req.params;
    const { status } = req.body as UpdateRoleRequest;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved or rejected.'
      });
    }

    // Get the role request
    const { data: roleRequest, error: fetchError } = await supabaseAdmin
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

    // Update the role request
    const { data: updatedRequest, error: updateError } = await supabaseAdmin
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

    // If approved, update the user's role
    if (status === 'approved') {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ role: roleRequest.requested_role })
        .eq('id', roleRequest.user_id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail the request, but log the error
      }
    }

    res.json({
      success: true,
      message: `Role request ${status} successfully`,
      role_request: updatedRequest
    });
  } catch (error: any) {
    console.error('Unexpected error in updateRoleRequest:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});