import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateExpenseRequest, UpdateExpenseRequest } from '../models/expense.model';

/**
 * Get all expenses
 */
export const getExpenses = asyncHandler(async (req: AuthRequest, res: Response) => {
  let query = supabase.from('expenses').select('*');

  // Team members can only see their own expenses
  if (req.user!.role === 'team_member') {
    query = query.eq('created_by', req.user!.id);
  }

  const { data: expenses, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    expenses
  });
});

/**
 * Get expense by ID
 */
export const getExpenseById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  let query = supabase.from('expenses').select('*').eq('id', id);

  // Team members can only see their own expenses
  if (req.user!.role === 'team_member') {
    query = query.eq('created_by', req.user!.id);
  }

  const { data: expense, error } = await query.single();

  if (error) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found'
    });
  }

  res.json({
    success: true,
    expense
  });
});

/**
 * Create new expense
 */
export const createExpense = asyncHandler(async (req: AuthRequest, res: Response) => {
  const expenseData: CreateExpenseRequest = req.body;

  const { data: expense, error } = await supabase
    .from('expenses')
    .insert({
      ...expenseData,
      created_by: req.user!.id,
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
    message: 'Expense created successfully',
    expense
  });
});

/**
 * Update expense
 */
export const updateExpense = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateExpenseRequest = req.body;

  let query = supabase.from('expenses').update(updateData).eq('id', id);

  // Team members can only update their own unapproved expenses
  if (req.user!.role === 'team_member') {
    query = query.eq('created_by', req.user!.id).eq('approved', false);
  }

  const { data: expense, error } = await query.select().single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    message: 'Expense updated successfully',
    expense
  });
});

/**
 * Delete expense
 */
export const deleteExpense = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  let query = supabase.from('expenses').delete().eq('id', id);

  // Team members can only delete their own unapproved expenses
  if (req.user!.role === 'team_member') {
    query = query.eq('created_by', req.user!.id).eq('approved', false);
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
    message: 'Expense deleted successfully'
  });
});