"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoice = exports.updateInvoice = exports.createInvoice = exports.getInvoiceById = exports.getInvoices = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.getInvoices = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { data: invoices, error } = await supabaseClient_1.supabase
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
exports.getInvoiceById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { data: invoice, error } = await supabaseClient_1.supabase
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
exports.createInvoice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const invoiceData = req.body;
    const totalAmount = invoiceData.amount + (invoiceData.tax_amount || 0);
    const { data: invoice, error } = await supabaseClient_1.supabase
        .from('invoices')
        .insert({
        ...invoiceData,
        total_amount: totalAmount,
        created_by: req.user.id
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
exports.updateInvoice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.amount !== undefined || updateData.tax_amount !== undefined) {
        const { data: currentInvoice } = await supabaseClient_1.supabase
            .from('invoices')
            .select('amount, tax_amount')
            .eq('id', id)
            .single();
        if (currentInvoice) {
            const newAmount = updateData.amount ?? currentInvoice.amount;
            const newTax = updateData.tax_amount ?? currentInvoice.tax_amount ?? 0;
            updateData.total_amount = newAmount + newTax;
        }
    }
    const { data: invoice, error } = await supabaseClient_1.supabase
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
exports.deleteInvoice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { error } = await supabaseClient_1.supabase
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
//# sourceMappingURL=invoice.controller.js.map