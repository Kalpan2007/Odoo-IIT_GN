"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalesOrder = exports.updateSalesOrder = exports.createSalesOrder = exports.getSalesOrderById = exports.getSalesOrders = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.getSalesOrders = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { data: salesOrders, error } = await supabaseClient_1.supabase
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
exports.getSalesOrderById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { data: salesOrder, error } = await supabaseClient_1.supabase
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
exports.createSalesOrder = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const salesOrderData = req.body;
    const { data: salesOrder, error } = await supabaseClient_1.supabase
        .from('sales_orders')
        .insert({
        ...salesOrderData,
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
        message: 'Sales order created successfully',
        sales_order: salesOrder
    });
});
exports.updateSalesOrder = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const { data: salesOrder, error } = await supabaseClient_1.supabase
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
exports.deleteSalesOrder = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { error } = await supabaseClient_1.supabase
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
//# sourceMappingURL=sales.controller.js.map