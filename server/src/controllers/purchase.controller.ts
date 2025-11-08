import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreatePurchaseRequest, UpdatePurchaseRequest } from '../models/purchase.model';

/**
 * Get all purchases
 */
export const getPurchases = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { data: purchases, error } = await supabase
    .from('purchases')
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
    purchases
  });
});

/**
 * Get purchase by ID
 */
export const getPurchaseById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { data: purchase, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(404).json({
      success: false,
      message: 'Purchase not found'
    });
  }

  res.json({
    success: true,
    purchase
  });
});

/**
 * Create new purchase
 */
export const createPurchase = asyncHandler(async (req: AuthRequest, res: Response) => {
  const purchaseData: CreatePurchaseRequest = req.body;

  const { data: purchase, error } = await supabase
    .from('purchases')
    .insert({
      ...purchaseData,
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
    message: 'Purchase created successfully',
    purchase
  });
});

/**
 * Update purchase
 */
export const updatePurchase = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData: UpdatePurchaseRequest = req.body;

  const { data: purchase, error } = await supabase
    .from('purchases')
    .update(updateData)
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
    message: 'Purchase updated successfully',
    purchase
  });
});

/**
 * Delete purchase
 */
export const deletePurchase = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('purchases')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.json({
    success: true,
    message: 'Purchase deleted successfully'
  });
});