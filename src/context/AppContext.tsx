import React, { createContext, useContext, useState } from 'react';
import { Project, Task, DashboardStats } from '../types';
import { mockProjects, mockTasks, mockDashboardStats } from '../data/mockData';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  dashboardStats: DashboardStats;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
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
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dashboardStats] = useState<DashboardStats>(mockDashboardStats);

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...projectData,
      tags: projectData.tags || ["Services"],  // default tag
      images: projectData.images || [
        "/img/sample1.png",
        "/img/sample2.png",
        "/img/sample3.png",
        "/img/sample4.png"
      ],
      managerImage: "/avatars/user1.png",
      deadline: projectData.endDate || null,
      tasksCount: 10,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id ? { ...project, ...projectData } : project
      )
    );
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...taskData } : task
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    // Also delete associated tasks
    setTasks(prev => prev.filter(task => task.projectId !== id));
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
      updateTask
    }}>
      {children}
    </AppContext.Provider>
  );
};