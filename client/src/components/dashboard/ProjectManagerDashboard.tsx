import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import { StatsCards } from '../widgets/StatsCards';
import { RevenueChart } from '../widgets/RevenueChart';

interface DashboardStats {
  total_projects: number;
  active_projects: number;
  total_revenue: number;
  total_costs: number;
  total_profit: number;
  pending_invoices: number;
}

export const ProjectManagerDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total_projects: 0,
    active_projects: 0,
    total_revenue: 0,
    total_costs: 0,
    total_profit: 0,
    pending_invoices: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard overview
        const overviewResponse = await dashboardAPI.getOverview();
        if (overviewResponse.success) {
          setDashboardStats(overviewResponse.overview);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Project Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your projects and team performance</p>
      </div>

      <StatsCards stats={{
        totalProjects: dashboardStats.total_projects,
        totalRevenue: dashboardStats.total_revenue,
        totalExpenses: dashboardStats.total_costs,
        totalProfit: dashboardStats.total_profit
      }} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Projects</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Project "E-commerce Platform" updated</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New task assigned to team</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Budget review required</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};