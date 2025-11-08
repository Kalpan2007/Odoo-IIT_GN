"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.getFinancials = exports.getOverview = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const errorHandler_1 = require("../utils/errorHandler");
exports.getOverview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { count: totalProjects } = await supabaseClient_1.supabase
            .from('projects')
            .select('*', { count: 'exact' });
        const { count: activeProjects } = await supabaseClient_1.supabase
            .from('projects')
            .select('*', { count: 'exact' })
            .eq('status', 'in_progress');
        const { data: invoiceData } = await supabaseClient_1.supabase
            .from('invoices')
            .select('total_amount')
            .eq('status', 'paid');
        const totalRevenue = invoiceData?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;
        const { data: expenseData } = await supabaseClient_1.supabase
            .from('expenses')
            .select('amount')
            .eq('approved', true);
        const { data: purchaseData } = await supabaseClient_1.supabase
            .from('purchases')
            .select('amount')
            .in('status', ['received', 'paid']);
        const totalExpenses = expenseData?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
        const totalPurchases = purchaseData?.reduce((sum, purchase) => sum + (purchase.amount || 0), 0) || 0;
        const totalCosts = totalExpenses + totalPurchases;
        const totalProfit = totalRevenue - totalCosts;
        const { count: pendingInvoices } = await supabaseClient_1.supabase
            .from('invoices')
            .select('*', { count: 'exact' })
            .in('status', ['draft', 'sent']);
        res.json({
            success: true,
            overview: {
                total_projects: totalProjects || 0,
                active_projects: activeProjects || 0,
                total_revenue: totalRevenue,
                total_costs: totalCosts,
                total_profit: totalProfit,
                pending_invoices: pendingInvoices || 0
            }
        });
    }
    catch (error) {
        console.error('Dashboard overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard overview'
        });
    }
});
exports.getFinancials = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { data: projects } = await supabaseClient_1.supabase
            .from('projects')
            .select('id, name, budget, revenue, cost, profit, status');
        const { data: monthlyInvoices } = await supabaseClient_1.supabase
            .from('invoices')
            .select('total_amount, issue_date')
            .eq('status', 'paid')
            .gte('issue_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());
        const monthlyRevenue = {};
        monthlyInvoices?.forEach((invoice) => {
            const month = new Date(invoice.issue_date).toISOString().substring(0, 7);
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + invoice.total_amount;
        });
        const { data: expenses } = await supabaseClient_1.supabase
            .from('expenses')
            .select('category, amount')
            .eq('approved', true);
        const expenseByCategory = {};
        expenses?.forEach((expense) => {
            expenseByCategory[expense.category] = (expenseByCategory[expense.category] || 0) + expense.amount;
        });
        res.json({
            success: true,
            financials: {
                projects: projects || [],
                monthly_revenue: monthlyRevenue,
                expense_by_category: expenseByCategory
            }
        });
    }
    catch (error) {
        console.error('Dashboard financials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch financial data'
        });
    }
});
exports.getUserStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    try {
        let userId = req.user.id;
        if (req.user.role === 'admin' && req.query.user_id) {
            userId = req.query.user_id;
        }
        const { data: timesheets } = await supabaseClient_1.supabase
            .from('timesheets')
            .select('hours')
            .eq('user_id', userId);
        const totalHours = timesheets?.reduce((sum, entry) => sum + (entry.hours || 0), 0) || 0;
        const { count: tasksCompleted } = await supabaseClient_1.supabase
            .from('tasks')
            .select('*', { count: 'exact' })
            .eq('assigned_to', userId)
            .eq('status', 'completed');
        const { count: activeTasks } = await supabaseClient_1.supabase
            .from('tasks')
            .select('*', { count: 'exact' })
            .eq('assigned_to', userId)
            .in('status', ['todo', 'in_progress', 'review']);
        const { data: userProjects } = await supabaseClient_1.supabase
            .from('tasks')
            .select('project_id')
            .eq('assigned_to', userId);
        const uniqueProjects = [...new Set(userProjects?.map((task) => task.project_id))];
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data: recentTimesheets } = await supabaseClient_1.supabase
            .from('timesheets')
            .select('hours, date')
            .eq('user_id', userId)
            .gte('date', thirtyDaysAgo)
            .order('date', { ascending: false });
        res.json({
            success: true,
            user_stats: {
                total_hours_logged: totalHours,
                tasks_completed: tasksCompleted || 0,
                active_tasks: activeTasks || 0,
                projects_involved: uniqueProjects.length,
                recent_timesheets: recentTimesheets || []
            }
        });
    }
    catch (error) {
        console.error('Dashboard user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics'
        });
    }
});
//# sourceMappingURL=dashboard.controller.js.map