import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TasksPage } from './pages/TasksPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { SettingsPage } from './pages/SettingsPage';
import { RoleRequestPage } from './pages/RoleRequestPage';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="/tasks" element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            } />
            
            <Route path="/role-request" element={
              <ProtectedRoute>
                <RoleRequestPage />
              </ProtectedRoute>
            } />
            
            <Route path="/sales-orders" element={
              <ProtectedRoute>
                <PlaceholderPage title="Sales Orders" description="Manage customer sales orders and quotations" />
              </ProtectedRoute>
            } />
            
            <Route path="/purchases" element={
              <ProtectedRoute>
                <PlaceholderPage title="Purchase Orders" description="Track vendor purchases and procurement" />
              </ProtectedRoute>
            } />
            
            <Route path="/expenses" element={
              <ProtectedRoute>
                <PlaceholderPage title="Expenses" description="Monitor project expenses and costs" />
              </ProtectedRoute>
            } />
            
            <Route path="/invoices" element={
              <ProtectedRoute>
                <PlaceholderPage title="Invoices" description="Create and manage customer invoices" />
              </ProtectedRoute>
            } />
            
            <Route path="/vendor-bills" element={
              <ProtectedRoute>
                <PlaceholderPage title="Vendor Bills" description="Track and pay vendor bills" />
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <PlaceholderPage title="Reports" description="Generate financial and project reports" />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;