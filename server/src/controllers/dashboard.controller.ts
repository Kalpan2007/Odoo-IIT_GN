import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Get dashboard overview
 */
export const getOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Get total projects count
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact' });

    // Get active projects count
    const { count: activeProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('status', 'in_progress');

    // Get total revenue from invoices
    const { data: invoiceData } = await supabase
      .from('invoices')
      .select('total_amount')
      .eq('status', 'paid');

    const totalRevenue = invoiceData?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;

    // Get total costs from expenses and purchases
    const { data: expenseData } = await supabase
      .from('expenses')
      .select('amount')
      .eq('approved', true);

    const { data: purchaseData } = await supabase
      .from('purchases')
      .select('amount')
      .in('status', ['received', 'paid']);

    const totalExpenses = expenseData?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
    const totalPurchases = purchaseData?.reduce((sum, purchase) => sum + (purchase.amount || 0), 0) || 0;
    const totalCosts = totalExpenses + totalPurchases;

    // Calculate profit
    const totalProfit = totalRevenue - totalCosts;

    // Get pending invoices count
    const { count: pendingInvoices } = await supabase
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
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard overview'
    });
  }
});

/**
 * Get detailed financial metrics
 */
export const getFinancials = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Get project financials
    const { data: projects } = await supabase
      .from('projects')
      .select('id, name, budget, revenue, cost, profit, status');

    // Get monthly revenue trend (last 12 months)
    const { data: monthlyInvoices } = await supabase
      .from('invoices')
      .select('total_amount, issue_date')
      .eq('status', 'paid')
      .gte('issue_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

    // Group by month
    const monthlyRevenue: { [key: string]: number } = {};
    monthlyInvoices?.forEach(invoice => {
      const month = new Date(invoice.issue_date).toISOString().substring(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + invoice.total_amount;
    });

    // Get expense breakdown by category
    const { data: expenses } = await supabase
      .from('expenses')
      .select('category, amount')
      .eq('approved', true);

    const expenseByCategory: { [key: string]: number } = {};
    expenses?.forEach(expense => {
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
  } catch (error) {
    console.error('Dashboard financials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial data'
    });
  }
});

/**
 * Get user statistics
 */
export const getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    let userId = req.user!.id;

    // Admins can view stats for all users
    if (req.user!.role === 'admin' && req.query.user_id) {
      userId = req.query.user_id as string;
    }

    // Get total hours logged
    const { data: timesheets } = await supabase
      .from('timesheets')
      .select('hours')
      .eq('user_id', userId);

    const totalHours = timesheets?.reduce((sum, entry) => sum + (entry.hours || 0), 0) || 0;

    // Get tasks completed
    const { count: tasksCompleted } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('assigned_to', userId)
      .eq('status', 'completed');

    // Get active tasks
    const { count: activeTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('assigned_to', userId)
      .in('status', ['todo', 'in_progress', 'review']);

    // Get projects involved in
    const { data: userProjects } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('assigned_to', userId);

    const uniqueProjects = [...new Set(userProjects?.map(task => task.project_id))];

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentTimesheets } = await supabase
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
  } catch (error) {
    console.error('Dashboard user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});