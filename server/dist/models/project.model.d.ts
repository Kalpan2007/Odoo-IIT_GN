export interface Project {
    id: string;
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
    created_at: string;
    updated_at: string;
    created_by: string;
}
export interface CreateProjectRequest {
    name: string;
    client: string;
    start_date: string;
    end_date?: string;
    budget: number;
    status?: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
    description?: string;
}
export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
    revenue?: number;
    cost?: number;
    profit?: number;
}
//# sourceMappingURL=project.model.d.ts.map