import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task, DashboardStats } from '../types';
import { projectsAPI, tasksAPI, dashboardAPI } from '../services/api';
import { useAuth } from './AuthContext';

// Define backend response types
interface BackendProjectResponse {
  id: string;
  name: string;
  client: string;
  start_date: string;
  end_date?: string;
  budget: number;
  status: string;
  description?: string;
  revenue?: number;
  cost?: number;
  profit?: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface BackendTaskResponse {
  id: string;
  title: string;
  description?: string;
  project_id?: string;
  assigned_to?: string;
  status: string;
  priority: string;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

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
        // Map backend project data to frontend project data
        const mappedProjects = projectsResponse.projects.map((project: BackendProjectResponse) => ({
          id: project.id,
          name: project.name,
          client: project.client,
          startDate: project.start_date,
          endDate: project.end_date || '',
          description: project.description || '',
          progress: 0, // This would need to be calculated
          revenue: project.revenue || 0,
          expenses: project.cost || 0,
          profit: project.profit || 0,
          status: project.status === 'in_progress' ? 'active' : 
                  project.status === 'completed' ? 'completed' : 'on-hold',
          priority: 'medium', // Default priority
          tags: [], // Default tags
          images: [], // Default images
          managerImage: '', // Default manager image
          deadline: project.end_date || null,
          tasksCount: 0 // This would need to be calculated
        }));
        setProjects(mappedProjects);
      }
      
      // Fetch tasks
      const tasksResponse = await tasksAPI.getAll();
      if (tasksResponse.success) {
        // Map backend task data to frontend task data
        const mappedTasks = tasksResponse.tasks.map((task: BackendTaskResponse) => ({
          id: task.id,
          name: task.title,
          assignee: '', // This would need to be fetched from user data
          projectId: task.project_id || '',
          description: task.description || '',
          deadline: task.due_date || '',
          status: task.status === 'in_progress' ? 'in-progress' : 
                  task.status === 'completed' ? 'done' : 'todo',
          priority: task.priority === 'urgent' ? 'high' : task.priority
        }));
        setTasks(mappedTasks);
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
      // Map frontend project data to backend project data
      const backendProjectData = {
        name: projectData.name,
        client: projectData.client,
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        budget: 0, // Default budget
        status: 'planning' as const,
        description: projectData.description
      };
      
      const response = await projectsAPI.create(backendProjectData);
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
      // Map frontend project data to backend project data
      const backendProjectData: {
        name?: string;
        client?: string;
        start_date?: string;
        end_date?: string;
        budget?: number;
        status?: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
        description?: string;
        revenue?: number;
        cost?: number;
        profit?: number;
      } = {};
      
      if (projectData.name) backendProjectData.name = projectData.name;
      if (projectData.client) backendProjectData.client = projectData.client;
      if (projectData.startDate) backendProjectData.start_date = projectData.startDate;
      if (projectData.endDate) backendProjectData.end_date = projectData.endDate;
      if (projectData.description) backendProjectData.description = projectData.description;
      
      const response = await projectsAPI.update(id, backendProjectData);
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
      // Map frontend task data to backend task data
      const backendTaskData = {
        title: taskData.name,
        description: taskData.description,
        project_id: taskData.projectId,
        status: taskData.status === 'in-progress' ? 'in_progress' : 
                taskData.status === 'done' ? 'completed' : 'todo',
        priority: taskData.priority,
        due_date: taskData.deadline
      } as const;
      
      const response = await tasksAPI.create(backendTaskData);
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
      // Map frontend task data to backend task data
      const backendTaskData: {
        title?: string;
        description?: string;
        project_id?: string;
        status?: 'todo' | 'in_progress' | 'review' | 'completed';
        priority?: 'low' | 'medium' | 'high' | 'urgent';
        estimated_hours?: number;
        actual_hours?: number;
        due_date?: string;
      } = {};
      
      if (taskData.name) backendTaskData.title = taskData.name;
      if (taskData.description) backendTaskData.description = taskData.description;
      if (taskData.projectId) backendTaskData.project_id = taskData.projectId;
      if (taskData.status) {
        backendTaskData.status = taskData.status === 'in-progress' ? 'in_progress' : 
                                taskData.status === 'done' ? 'completed' : 'todo';
      }
      if (taskData.priority) backendTaskData.priority = taskData.priority;
      if (taskData.deadline) backendTaskData.due_date = taskData.deadline;
      
      const response = await tasksAPI.update(id, backendTaskData);
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