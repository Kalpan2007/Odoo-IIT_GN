import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task, DashboardStats } from '../types';
import { projectsAPI, tasksAPI, dashboardAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  dashboardStats: DashboardStats;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // Clear data when user logs out
      setProjects([]);
      setTasks([]);
      setDashboardStats({
        totalProjects: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        totalProfit: 0
      });
    }
  }, [user]);

  const refreshData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch projects
      const projectsResponse = await projectsAPI.getAll();
      if (projectsResponse.success) {
        setProjects(projectsResponse.projects || []);
      }
      
      // Fetch tasks
      const tasksResponse = await tasksAPI.getAll();
      if (tasksResponse.success) {
        setTasks(tasksResponse.tasks || []);
      }
      
      // Fetch dashboard stats
      const dashboardResponse = await dashboardAPI.getOverview();
      if (dashboardResponse.success) {
        setDashboardStats({
          totalProjects: dashboardResponse.overview.total_projects || 0,
          totalRevenue: dashboardResponse.overview.total_revenue || 0,
          totalExpenses: dashboardResponse.overview.total_costs || 0,
          totalProfit: dashboardResponse.overview.total_profit || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const response = await projectsAPI.create(projectData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const response = await projectsAPI.update(id, projectData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await projectsAPI.delete(id);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const response = await tasksAPI.create(taskData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const response = await tasksAPI.update(id, taskData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await tasksAPI.delete(id);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      projects,
      tasks,
      dashboardStats,
      selectedProject,
      setSelectedProject,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      refreshData,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};