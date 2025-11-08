import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateTimesheetRequest, UpdateTimesheetRequest } from '../models/timesheet.model';

/**
 * Get all timesheets
 */
export const getTimesheets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { project_id, user_id } = req.query;

  let query = supabase.from('timesheets').select('*');

  if (project_id) {
    query = query.eq('project_id', project_id);
  }

  if (user_id) {
    query = query.eq('user_id', user_id);
  }

  // Role-based filtering for team members
  if (req.user!.role === 'team_member') {
    query = query.eq('user_id', req.user!.id);
  }

  const { data: timesheets, error } = await query.order('date', { ascending: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    timesheets
  });
});

/**
 * Create new timesheet entry
 */
export const createTimesheet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const timesheetData: CreateTimesheetRequest = req.body;

  const { data: timesheet, error } = await supabase
    .from('timesheets')
    .insert({
      ...timesheetData,
      user_id: req.user!.id,
      approved: false
    })
    .select()
    .single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(201).json({
    success: true,
    message: 'Timesheet entry created successfully',
    timesheet
  });
});

/**
 * Update timesheet entry
 */
export const updateTimesheet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateTimesheetRequest = req.body;

  let query = supabase.from('timesheets').update(updateData).eq('id', id);

  // Team members can only update their own timesheets
  if (req.user!.role === 'team_member') {
    query = query.eq('user_id', req.user!.id);
  }

  const { data: timesheet, error } = await query.select().single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    message: 'Timesheet entry updated successfully',
    timesheet
  });
});

/**
 * Delete timesheet entry
 */
export const deleteTimesheet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  let query = supabase.from('timesheets').delete().eq('id', id);

  // Team members can only delete their own unapproved timesheets
  if (req.user!.role === 'team_member') {
    query = query.eq('user_id', req.user!.id).eq('approved', false);
  }

  const { error } = await query;

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    message: 'Timesheet entry deleted successfully'
  });
});