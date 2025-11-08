export interface Task {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  assigned_to?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  project_id: string;
  assigned_to?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours?: number;
  due_date?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  actual_hours?: number;
}