import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateInvoiceRequest, UpdateInvoiceRequest } from '../models/invoice.model';

/**
 * Get all invoices
 */
export const getInvoices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { data: invoices, error } = await supabase
    .from('invoices')
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
    invoices
  });
});

/**
 * Get invoice by ID
 */
export const getInvoiceById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }

  res.json({
    success: true,
    invoice
  });
});

/**
 * Create new invoice
 */
export const createInvoice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const invoiceData: CreateInvoiceRequest = req.body;
  
  // Calculate total amount
  const totalAmount = invoiceData.amount + (invoiceData.tax_amount || 0);

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      ...invoiceData,
      total_amount: totalAmount,
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
    message: 'Invoice created successfully',
    invoice
  });
});

/**
 * Update invoice
 */
export const updateInvoice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateInvoiceRequest = req.body;

  // Recalculate total if amount or tax changed
  if (updateData.amount !== undefined || updateData.tax_amount !== undefined) {
    const { data: currentInvoice } = await supabase
      .from('invoices')
      .select('amount, tax_amount')
      .eq('id', id)
      .single();

    if (currentInvoice) {
      const newAmount = updateData.amount ?? currentInvoice.amount;
      const newTax = updateData.tax_amount ?? currentInvoice.tax_amount ?? 0;
      (updateData as any).total_amount = newAmount + newTax;
    }
  }

  const { data: invoice, error } = await supabase
    .from('invoices')
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
    message: 'Invoice updated successfully',
    invoice
  });
});

/**
 * Delete invoice
 */
export const deleteInvoice = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('invoices')
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
    message: 'Invoice deleted successfully'
  });
});