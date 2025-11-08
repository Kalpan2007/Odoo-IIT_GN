"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.getTasks = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { project_id } = req.query;
    let query = supabaseClient_1.supabase.from('tasks').select('*');
    if (project_id) {
        query = query.eq('project_id', project_id);
    }
    if (req.user.role === 'team_member') {
        query = query.or(`assigned_to.eq.${req.user.id},created_by.eq.${req.user.id}`);
    }
    const { data: tasks, error } = await query.order('created_at', { ascending: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    res.json({
        success: true,
        tasks
    });
});
exports.getTaskById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    let query = supabaseClient_1.supabase.from('tasks').select('*').eq('id', id);
    if (req.user.role === 'team_member') {
        query = query.or(`assigned_to.eq.${req.user.id},created_by.eq.${req.user.id}`);
    }
    const { data: task, error } = await query.single();
    if (error) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }
    res.json({
        success: true,
        task
    });
});
exports.createTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const taskData = req.body;
    const { data: task, error } = await supabaseClient_1.supabase
        .from('tasks')
        .insert({
        ...taskData,
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
        message: 'Task created successfully',
        task
    });
});
exports.updateTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    let query = supabaseClient_1.supabase.from('tasks').update(updateData).eq('id', id);
    if (req.user.role === 'team_member') {
        query = query.or(`assigned_to.eq.${req.user.id},created_by.eq.${req.user.id}`);
    }
    const { data: task, error } = await query.select().single();
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    res.json({
        success: true,
        message: 'Task updated successfully',
        task
    });
});
exports.deleteTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    let query = supabaseClient_1.supabase.from('tasks').delete().eq('id', id);
    if (req.user.role === 'team_member') {
        return res.status(403).json({
            success: false,
            message: 'Insufficient permissions to delete tasks'
        });
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
        message: 'Task deleted successfully'
    });
});
//# sourceMappingURL=task.controller.js.map