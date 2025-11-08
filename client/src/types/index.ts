export interface User {
  id: string;
  email: string;
  fullName: string;
  workEmail: string;
  role?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  description: string;
  progress: number;
  revenue: number;
  expenses: number;
  profit: number;
  status: 'active' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  thumbnail?: string;
  tags: string[];
  images: string[];
  managerImage: string;
  deadline: string | null;
  tasksCount: number;
}

export interface Task {
  id: string;
  name: string;
  assignee: string;
  projectId: string;
  description: string;
  deadline: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface SalesOrder {
  id: string;
  order_number: string;
  client: string;
  project_id?: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'completed' | 'cancelled';
  order_date: string;
  delivery_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Purchase {
  id: string;
  purchase_number: string;
  vendor: string;
  project_id?: string;
  amount: number;
  status: 'draft' | 'ordered' | 'received' | 'paid' | 'cancelled';
  order_date: string;
  delivery_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  project_id?: string;
  description?: string;
  receipt_url?: string;
  expense_date: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client: string;
  project_id?: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Timesheet {
  id: string;
  user_id: string;
  project_id?: string;
  task_id?: string;
  description: string;
  hours: number;
  rate?: number;
  date: string;
  billable: boolean;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
}