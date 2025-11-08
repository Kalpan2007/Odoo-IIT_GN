// Define backend data structures
interface BackendProject {
  name: string;
  client: string;
  start_date: string;
  end_date?: string;
  budget: number;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  description?: string;
  revenue?: number;
  cost?: number;
  profit?: number;
}

interface BackendTask {
  title: string;
  description?: string;
  project_id?: string;
  assigned_to?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
}

interface BackendSalesOrder {
  order_number: string;
  client: string;
  project_id?: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'completed' | 'cancelled';
  order_date: string;
  delivery_date?: string;
  description?: string;
}

interface BackendPurchase {
  purchase_number: string;
  vendor: string;
  project_id?: string;
  amount: number;
  status: 'draft' | 'ordered' | 'received' | 'paid' | 'cancelled';
  order_date: string;
  delivery_date?: string;
  description?: string;
}

interface BackendExpense {
  title: string;
  amount: number;
  category: string;
  project_id?: string;
  description?: string;
  receipt_url?: string;
  expense_date: string;
  approved?: boolean;
}

interface BackendInvoice {
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
}

interface BackendTimesheet {
  user_id?: string;
  project_id?: string;
  task_id?: string;
  description: string;
  hours: number;
  rate?: number;
  date: string;
  billable?: boolean;
  approved?: boolean;
}

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    return response.json();
  },
  
  signup: async (userData: { full_name: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        role: 'team_member' // Default role is always team_member
      }),
    });
    
    return response.json();
  },
  
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  create: async (projectData: BackendProject) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    
    return response.json();
  },
  
  update: async (id: string, projectData: Partial<BackendProject>) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
};

// Tasks API
export const tasksAPI = {
  getAll: async (projectId?: string) => {
    let url = `${API_BASE_URL}/tasks`;
    if (projectId) {
      url += `?project_id=${projectId}`;
    }
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  create: async (taskData: BackendTask) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    
    return response.json();
  },
  
  update: async (id: string, taskData: Partial<BackendTask>) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
};

// Sales Orders API
export const salesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  create: async (salesData: BackendSalesOrder) => {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(salesData),
    });
    
    return response.json();
  },
  
  update: async (id: string, salesData: Partial<BackendSalesOrder>) => {
    const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(salesData),
    });
    
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
};

// Purchases API
export const purchasesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/purchases`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/purchases/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  create: async (purchaseData: BackendPurchase) => {
    const response = await fetch(`${API_BASE_URL}/purchases`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(purchaseData),
    });
    
    return response.json();
  },
  
  update: async (id: string, purchaseData: Partial<BackendPurchase>) => {
    const response = await fetch(`${API_BASE_URL}/purchases/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(purchaseData),
    });
    
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/purchases/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
};

// Expenses API
export const expensesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  create: async (expenseData: BackendExpense) => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });
    
    return response.json();
  },
  
  update: async (id: string, expenseData: Partial<BackendExpense>) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });
    
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
};

// Invoices API
export const invoicesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  create: async (invoiceData: BackendInvoice) => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(invoiceData),
    });
    
    return response.json();
  },
  
  update: async (id: string, invoiceData: Partial<BackendInvoice>) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(invoiceData),
    });
    
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
};

// Timesheets API
export const timesheetsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/timesheets`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/timesheets/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  create: async (timesheetData: BackendTimesheet) => {
    const response = await fetch(`${API_BASE_URL}/timesheets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(timesheetData),
    });
    
    return response.json();
  },
  
  update: async (id: string, timesheetData: Partial<BackendTimesheet>) => {
    const response = await fetch(`${API_BASE_URL}/timesheets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(timesheetData),
    });
    
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/timesheets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
};

// Dashboard API
export const dashboardAPI = {
  getOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getFinancials: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/financials`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  getUserStats: async (userId?: string) => {
    let url = `${API_BASE_URL}/dashboard/user-stats`;
    if (userId) {
      url += `?user_id=${userId}`;
    }
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
};

// Role Requests API
export const roleRequestsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/role-requests`, {
      headers: getAuthHeaders(),
    });
    
    return response.json();
  },
  
  create: async (requestData: { requested_role: string; reason: string }) => {
    const response = await fetch(`${API_BASE_URL}/role-requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    });
    
    return response.json();
  },
  
  updateStatus: async (id: string, status: 'approved' | 'rejected') => {
    const response = await fetch(`${API_BASE_URL}/role-requests/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    return response.json();
  }
};