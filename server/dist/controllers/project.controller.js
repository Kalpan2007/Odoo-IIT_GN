"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.getProjects = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    let query = supabaseClient_1.supabase.from('projects').select('*');
    if (req.user.role === 'project_manager') {
        query = query.eq('created_by', req.user.id);
    }
    const { data: projects, error } = await query.order('created_at', { ascending: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    res.json({
        success: true,
        projects
    });
});
exports.getProjectById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    let query = supabaseClient_1.supabase.from('projects').select('*').eq('id', id);
    if (req.user.role === 'project_manager') {
        query = query.eq('created_by', req.user.id);
    }
    const { data: project, error } = await query.single();
    if (error) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }
    res.json({
        success: true,
        project
    });
});
exports.createProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const projectData = req.body;
    const { data: project, error } = await supabaseClient_1.supabase
        .from('projects')
        .insert({
        ...projectData,
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
        message: 'Project created successfully',
        project
    });
});
exports.updateProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    let query = supabaseClient_1.supabase.from('projects').update(updateData).eq('id', id);
    if (req.user.role === 'project_manager') {
        query = query.eq('created_by', req.user.id);
    }
    const { data: project, error } = await query.select().single();
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    res.json({
        success: true,
        message: 'Project updated successfully',
        project
    });
});
exports.deleteProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    let query = supabaseClient_1.supabase.from('projects').delete().eq('id', id);
    if (req.user.role === 'project_manager') {
        query = query.eq('created_by', req.user.id);
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
        message: 'Project deleted successfully'
    });
});
//# sourceMappingURL=project.controller.js.map