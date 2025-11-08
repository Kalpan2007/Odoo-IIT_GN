import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

/**
 * Get all tasks
 */
export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { project_id } = req.query;

  let query = supabase.from('tasks').select('*');

  if (project_id) {
    query = query.eq('project_id', project_id);
  }

  // Role-based filtering for team members
  if (req.user!.role === 'team_member') {
    query = query.or(`assigned_to.eq.${req.user!.id},created_by.eq.${req.user!.id}`);
  }

  const { data: tasks, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    tasks
  });
});

/**
 * Get task by ID
 */
export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  let query = supabase.from('tasks').select('*').eq('id', id);

  // Role-based filtering for team members
  if (req.user!.role === 'team_member') {
    query = query.or(`assigned_to.eq.${req.user!.id},created_by.eq.${req.user!.id}`);
  }

  const { data: task, error } = await query.single();

  if (error) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  res.json({
    success: true,
    task
  });
});

/**
 * Create new task
 */
export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskData: CreateTaskRequest = req.body;

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      created_by: req.user!.id
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
    message: 'Task created successfully',
    task
  });
});

/**
 * Update task
 */
export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateTaskRequest = req.body;

  let query = supabase.from('tasks').update(updateData).eq('id', id);

  // Role-based filtering for team members
  if (req.user!.role === 'team_member') {
    query = query.or(`assigned_to.eq.${req.user!.id},created_by.eq.${req.user!.id}`);
  }

  const { data: task, error } = await query.select().single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    message: 'Task updated successfully',
    task
  });
});

/**
 * Delete task
 */
export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  let query = supabase.from('tasks').delete().eq('id', id);

  // Only admins and project managers can delete tasks
  if (req.user!.role === 'team_member') {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions to delete tasks'
    });
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
    message: 'Task deleted successfully'
  });
});