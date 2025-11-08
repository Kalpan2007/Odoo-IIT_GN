"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePurchase = exports.updatePurchase = exports.createPurchase = exports.getPurchaseById = exports.getPurchases = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.getPurchases = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { data: purchases, error } = await supabaseClient_1.supabase
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
exports.getPurchaseById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { data: purchase, error } = await supabaseClient_1.supabase
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
exports.createPurchase = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const purchaseData = req.body;
    const { data: purchase, error } = await supabaseClient_1.supabase
        .from('purchases')
        .insert({
        ...purchaseData,
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
        message: 'Purchase created successfully',
        purchase
    });
});
exports.updatePurchase = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const { data: purchase, error } = await supabaseClient_1.supabase
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
exports.deletePurchase = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { error } = await supabaseClient_1.supabase
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
//# sourceMappingURL=purchase.controller.js.map