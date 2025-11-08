import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { roleRequestsAPI } from '../services/api';

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

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchRoleRequests();
    }
  }, [user]);

  const fetchRoleRequests = async () => {
    try {
      const response = await roleRequestsAPI.getAll();
      if (response.success) {
        setRoleRequests(response.role_requests || []);
      }
    } catch (error) {
      console.error('Failed to fetch role requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleRequestAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await roleRequestsAPI.updateStatus(id, status);
      if (response.success) {
        // Refresh role requests
        await fetchRoleRequests();
      } else {
        alert(response.message || 'Failed to update role request');
      }
    } catch (error) {
      console.error('Failed to update role request:', error);
      alert('Failed to update role request');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              
              {user?.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('role-management')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'role-management'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Role Management
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500">
                    Update your personal information and account settings
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {user?.fullName || 'Not available'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {user?.email || 'Not available'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                      {user?.role || 'Not available'}
                    </div>
                  </div>
                </div>
                
                {user?.role === 'team_member' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                          Want to request a role change? You can submit a request to administrators.
                        </p>
                        <p className="mt-3 text-sm md:mt-0 md:ml-6">
                          <a href="/role-request" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                            Request Role Change
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'role-management' && user?.role === 'admin' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Role Management</h2>
                  <p className="text-sm text-gray-500">
                    Manage role change requests from team members
                  </p>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : roleRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No role requests</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      There are currently no pending role change requests.
                    </p>
                  </div>
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
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};