import { Project, Task, DashboardStats } from '../types';

// Export empty arrays since we're using real backend data now
export const mockProjects: Project[] = [];
export const mockTasks: Task[] = [];
export const mockDashboardStats: DashboardStats = {
  totalProjects: 0,
  totalRevenue: 0,
  totalExpenses: 0,
  totalProfit: 0
};

// Export empty array for revenue data
export const revenueData: { month: string; revenue: number; expenses: number }[] = [];