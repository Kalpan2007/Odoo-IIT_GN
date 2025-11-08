import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateSalesOrderRequest, UpdateSalesOrderRequest } from '../models/sales.model';

/**
 * Get all sales orders
 */
export const getSalesOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { data: salesOrders, error } = await supabase
    .from('sales_orders')
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
    sales_orders: salesOrders
  });
});

/**
 * Get sales order by ID
 */
export const getSalesOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { data: salesOrder, error } = await supabase
    .from('sales_orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(404).json({
      success: false,
      message: 'Sales order not found'
    });
  }

  res.json({
    success: true,
    sales_order: salesOrder
  });
});

/**
 * Create new sales order
 */
export const createSalesOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const salesOrderData: CreateSalesOrderRequest = req.body;

  const { data: salesOrder, error } = await supabase
    .from('sales_orders')
    .insert({
      ...salesOrderData,
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
    message: 'Sales order created successfully',
    sales_order: salesOrder
  });
});

/**
 * Update sales order
 */
export const updateSalesOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateSalesOrderRequest = req.body;

  const { data: salesOrder, error } = await supabase
    .from('sales_orders')
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
    message: 'Sales order updated successfully',
    sales_order: salesOrder
  });
});

/**
 * Delete sales order
 */
export const deleteSalesOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('sales_orders')
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
    message: 'Sales order deleted successfully'
  });
});