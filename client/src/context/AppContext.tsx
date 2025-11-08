import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task, DashboardStats, SalesOrder, Purchase, Expense, Invoice, Timesheet } from '../types';
import { projectsAPI, tasksAPI, dashboardAPI, salesAPI, purchasesAPI, expensesAPI, invoicesAPI, timesheetsAPI } from '../services/api';
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
  salesOrders: SalesOrder[];
  purchases: Purchase[];
  expenses: Expense[];
  invoices: Invoice[];
  timesheets: Timesheet[];
  dashboardStats: DashboardStats;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addSalesOrder: (salesOrder: Omit<SalesOrder, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<void>;
  updateSalesOrder: (id: string, salesOrder: Partial<SalesOrder>) => Promise<void>;
  deleteSalesOrder: (id: string) => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<void>;
  updatePurchase: (id: string, purchase: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  addTimesheet: (timesheet: Omit<Timesheet, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTimesheet: (id: string, timesheet: Partial<Timesheet>) => Promise<void>;
  deleteTimesheet: (id: string) => Promise<void>;
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
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
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
      setSalesOrders([]);
      setPurchases([]);
      setExpenses([]);
      setInvoices([]);
      setTimesheets([]);
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
      
      // Fetch sales orders
      const salesResponse = await salesAPI.getAll();
      if (salesResponse.success) {
        setSalesOrders(salesResponse.sales_orders || []);
      }
      
      // Fetch purchases
      const purchasesResponse = await purchasesAPI.getAll();
      if (purchasesResponse.success) {
        setPurchases(purchasesResponse.purchases || []);
      }
      
      // Fetch expenses
      const expensesResponse = await expensesAPI.getAll();
      if (expensesResponse.success) {
        setExpenses(expensesResponse.expenses || []);
      }
      
      // Fetch invoices
      const invoicesResponse = await invoicesAPI.getAll();
      if (invoicesResponse.success) {
        setInvoices(invoicesResponse.invoices || []);
      }
      
      // Fetch timesheets
      const timesheetsResponse = await timesheetsAPI.getAll();
      if (timesheetsResponse.success) {
        setTimesheets(timesheetsResponse.timesheets || []);
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

  const addSalesOrder = async (salesOrderData: Omit<SalesOrder, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const response = await salesAPI.create(salesOrderData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to create sales order');
      }
    } catch (error) {
      console.error('Failed to create sales order:', error);
      throw error;
    }
  };

  const updateSalesOrder = async (id: string, salesOrderData: Partial<SalesOrder>) => {
    try {
      const response = await salesAPI.update(id, salesOrderData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to update sales order');
      }
    } catch (error) {
      console.error('Failed to update sales order:', error);
      throw error;
    }
  };

  const deleteSalesOrder = async (id: string) => {
    try {
      const response = await salesAPI.delete(id);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to delete sales order');
      }
    } catch (error) {
      console.error('Failed to delete sales order:', error);
      throw error;
    }
  };

  const addPurchase = async (purchaseData: Omit<Purchase, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const response = await purchasesAPI.create(purchaseData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to create purchase');
      }
    } catch (error) {
      console.error('Failed to create purchase:', error);
      throw error;
    }
  };

  const updatePurchase = async (id: string, purchaseData: Partial<Purchase>) => {
    try {
      const response = await purchasesAPI.update(id, purchaseData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to update purchase');
      }
    } catch (error) {
      console.error('Failed to update purchase:', error);
      throw error;
    }
  };

  const deletePurchase = async (id: string) => {
    try {
      const response = await purchasesAPI.delete(id);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to delete purchase');
      }
    } catch (error) {
      console.error('Failed to delete purchase:', error);
      throw error;
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const response = await expensesAPI.create(expenseData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to create expense');
      }
    } catch (error) {
      console.error('Failed to create expense:', error);
      throw error;
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      const response = await expensesAPI.update(id, expenseData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to update expense');
      }
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response = await expensesAPI.delete(id);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  };

  const addInvoice = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const response = await invoicesAPI.create(invoiceData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      const response = await invoicesAPI.update(id, invoiceData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to update invoice');
      }
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const response = await invoicesAPI.delete(id);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to delete invoice');
      }
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  };

  const addTimesheet = async (timesheetData: Omit<Timesheet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await timesheetsAPI.create(timesheetData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to create timesheet');
      }
    } catch (error) {
      console.error('Failed to create timesheet:', error);
      throw error;
    }
  };

  const updateTimesheet = async (id: string, timesheetData: Partial<Timesheet>) => {
    try {
      const response = await timesheetsAPI.update(id, timesheetData);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to update timesheet');
      }
    } catch (error) {
      console.error('Failed to update timesheet:', error);
      throw error;
    }
  };

  const deleteTimesheet = async (id: string) => {
    try {
      const response = await timesheetsAPI.delete(id);
      if (response.success) {
        await refreshData();
      } else {
        throw new Error(response.message || 'Failed to delete timesheet');
      }
    } catch (error) {
      console.error('Failed to delete timesheet:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      projects,
      tasks,
      salesOrders,
      purchases,
      expenses,
      invoices,
      timesheets,
      dashboardStats,
      selectedProject,
      setSelectedProject,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      addSalesOrder,
      updateSalesOrder,
      deleteSalesOrder,
      addPurchase,
      updatePurchase,
      deletePurchase,
      addExpense,
      updateExpense,
      deleteExpense,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addTimesheet,
      updateTimesheet,
      deleteTimesheet,
      refreshData,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};