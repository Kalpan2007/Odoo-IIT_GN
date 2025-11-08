import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateProjectRequest, UpdateProjectRequest } from '../models/project.model';

/**
 * Get all projects
 */
export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  let query = supabase.from('projects').select('*');

  // Role-based filtering
  if (req.user!.role === 'project_manager') {
    query = query.eq('created_by', req.user!.id);
  }

  const { data: projects, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    projects
  });
});

/**
 * Get project by ID
 */
export const getProjectById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  let query = supabase.from('projects').select('*').eq('id', id);

  // Role-based filtering
  if (req.user!.role === 'project_manager') {
    query = query.eq('created_by', req.user!.id);
  }

  const { data: project, error } = await query.single();

  if (error) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  res.json({
    success: true,
    project
  });
});

/**
 * Create new project
 */
export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const projectData: CreateProjectRequest = req.body;

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
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
    message: 'Project created successfully',
    project
  });
});

/**
 * Update project
 */
export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateProjectRequest = req.body;

  let query = supabase.from('projects').update(updateData).eq('id', id);

  // Role-based filtering
  if (req.user!.role === 'project_manager') {
    query = query.eq('created_by', req.user!.id);
  }

  const { data: project, error } = await query.select().single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    message: 'Project updated successfully',
    project
  });
});

/**
 * Delete project
 */
export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  let query = supabase.from('projects').delete().eq('id', id);

  // Role-based filtering
  if (req.user!.role === 'project_manager') {
    query = query.eq('created_by', req.user!.id);
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
    message: 'Project deleted successfully'
  });
});