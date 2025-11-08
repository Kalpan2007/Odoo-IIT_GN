"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTimesheet = exports.updateTimesheet = exports.createTimesheet = exports.getTimesheets = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.getTimesheets = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { project_id, user_id } = req.query;
    let query = supabaseClient_1.supabase.from('timesheets').select('*');
    if (project_id) {
        query = query.eq('project_id', project_id);
    }
    if (user_id) {
        query = query.eq('user_id', user_id);
    }
    if (req.user.role === 'team_member') {
        query = query.eq('user_id', req.user.id);
    }
    const { data: timesheets, error } = await query.order('date', { ascending: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    res.json({
        success: true,
        timesheets
    });
});
exports.createTimesheet = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const timesheetData = req.body;
    const { data: timesheet, error } = await supabaseClient_1.supabase
        .from('timesheets')
        .insert({
        ...timesheetData,
        user_id: req.user.id,
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
        message: 'Timesheet entry created successfully',
        timesheet
    });
});
exports.updateTimesheet = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    let query = supabaseClient_1.supabase.from('timesheets').update(updateData).eq('id', id);
    if (req.user.role === 'team_member') {
        query = query.eq('user_id', req.user.id);
    }
    const { data: timesheet, error } = await query.select().single();
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    res.json({
        success: true,
        message: 'Timesheet entry updated successfully',
        timesheet
    });
});
exports.deleteTimesheet = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    let query = supabaseClient_1.supabase.from('timesheets').delete().eq('id', id);
    if (req.user.role === 'team_member') {
        query = query.eq('user_id', req.user.id).eq('approved', false);
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
        message: 'Timesheet entry deleted successfully'
    });
});
//# sourceMappingURL=timesheet.controller.js.map