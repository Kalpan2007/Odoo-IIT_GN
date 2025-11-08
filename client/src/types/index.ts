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
  orderId: string;
  customer: string;
  projectId: string;
  orderLines: OrderLine[];
  subtotal: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
}

export interface PurchaseOrder {
  id: string;
  orderId: string;
  vendor: string;
  projectId: string;
  orderLines: OrderLine[];
  subtotal: number;
  total: number;
  status: 'draft' | 'ordered' | 'received';
}

export interface OrderLine {
  id: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Expense {
  id: string;
  name: string;
  projectId: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

export interface Invoice {
  id: string;
  invoiceId: string;
  customer: string;
  projectId: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface DashboardStats {
  totalProjects: number;
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
}