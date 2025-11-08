import React, { useEffect, useState } from 'react';
import { dashboardAPI, roleRequestsAPI } from '../../services/api';
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

interface RoleRequest {
  id: string;
  user_id: string;
  current_user_role: string;
  requested_role: string;
  status: string;
  reason?: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export const AdminDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total_projects: 0,
    active_projects: 0,
    total_revenue: 0,
    total_costs: 0,
    total_profit: 0,
    pending_invoices: 0
  });
  
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard overview
        const overviewResponse = await dashboardAPI.getOverview();
        if (overviewResponse.success) {
          setDashboardStats(overviewResponse.overview);
        }
        
        // Fetch role requests
        const requestsResponse = await roleRequestsAPI.getAll();
        if (requestsResponse.success) {
          setRoleRequests(requestsResponse.role_requests || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleRequestAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await roleRequestsAPI.updateStatus(id, status);
      if (response.success) {
        // Refresh role requests
        const requestsResponse = await roleRequestsAPI.getAll();
        if (requestsResponse.success) {
          setRoleRequests(requestsResponse.role_requests || []);
        }
      } else {
        alert(response.message || 'Failed to update role request');
      }
    } catch (error) {
      console.error('Failed to update role request:', error);
      alert('Failed to update role request');
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of all projects and system management</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Role Change Requests</h3>
          {roleRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending role requests</p>
          ) : (
            <div className="space-y-4">
              {roleRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.user?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {request.user?.email}
                      </p>
                      <p className="text-sm mt-1">
                        Requesting change from <span className="font-medium">{request.current_user_role}</span> to <span className="font-medium">{request.requested_role}</span>
                      </p>
                      {request.reason && (
                        <p className="text-sm text-gray-600 mt-2">
                          Reason: {request.reason}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Requested: {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRoleRequestAction(request.id, 'approved')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRoleRequestAction(request.id, 'rejected')}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};