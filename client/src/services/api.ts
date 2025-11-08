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