import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, requestRoleChange } = useAuth();
  const [selectedRole, setSelectedRole] = useState('project_manager');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState('');

  const handleRoleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRequestStatus('');
    
    try {
      await requestRoleChange(selectedRole);
      setRequestStatus('Request submitted successfully!');
      setReason('');
    } catch (error: any) {
      setRequestStatus('Failed to submit request: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              {user && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Role</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {user.role?.replace('_', ' ') || 'team member'}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {user && user.role !== 'admin' && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Request Role Change</h3>
                <p className="text-gray-600 mb-4">
                  Request to change your role. Administrators will review your request.
                </p>
                
                <form onSubmit={handleRoleRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Requested Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                      disabled={isSubmitting}
                    >
                      <option value="project_manager">Project Manager</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason for Request</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Explain why you need this role..."
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  {requestStatus && (
                    <div className={`rounded-md p-4 ${requestStatus.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      {requestStatus}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Submit Request
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
              <p className="text-gray-600">Notification preferences coming soon...</p>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account</h3>
              <p className="text-gray-600">Account settings coming soon...</p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};