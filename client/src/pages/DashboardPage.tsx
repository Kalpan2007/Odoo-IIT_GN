import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { ProjectManagerDashboard } from '../components/dashboard/ProjectManagerDashboard';
import { TeamMemberDashboard } from '../components/dashboard/TeamMemberDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    if (!user) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'project_manager':
        return <ProjectManagerDashboard />;
      case 'team_member':
      default:
        return <TeamMemberDashboard />;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};