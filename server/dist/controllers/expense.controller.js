"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getExpenseById = exports.getExpenses = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.getExpenses = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    let query = supabaseClient_1.supabase.from('expenses').select('*');
    if (req.user.role === 'team_member') {
        query = query.eq('created_by', req.user.id);
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
exports.getExpenseById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    let query = supabaseClient_1.supabase.from('expenses').select('*').eq('id', id);
    if (req.user.role === 'team_member') {
        query = query.eq('created_by', req.user.id);
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
exports.createExpense = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const expenseData = req.body;
    const { data: expense, error } = await supabaseClient_1.supabase
        .from('expenses')
        .insert({
        ...expenseData,
        created_by: req.user.id,
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
exports.updateExpense = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    let query = supabaseClient_1.supabase.from('expenses').update(updateData).eq('id', id);
    if (req.user.role === 'team_member') {
        query = query.eq('created_by', req.user.id).eq('approved', false);
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
exports.deleteExpense = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    let query = supabaseClient_1.supabase.from('expenses').delete().eq('id', id);
    if (req.user.role === 'team_member') {
        query = query.eq('created_by', req.user.id).eq('approved', false);
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
//# sourceMappingURL=expense.controller.js.map