export interface Timesheet {
  id: string;
  user_id: string;
  project_id: string;
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

export interface CreateTimesheetRequest {
  project_id: string;
  task_id?: string;
  description: string;
  hours: number;
  rate?: number;
  date: string;
  billable?: boolean;
}

export interface UpdateTimesheetRequest extends Partial<CreateTimesheetRequest> {
  approved?: boolean;
}