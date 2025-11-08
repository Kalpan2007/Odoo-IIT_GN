export interface RoleRequest {
    id: string;
    user_id: string;
    current_user_role: string;
    requested_role: string;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
    created_at: string;
    updated_at: string;
}
export interface CreateRoleRequest {
    requested_role: string;
    reason?: string;
}
export interface UpdateRoleRequest {
    status: 'approved' | 'rejected';
}
//# sourceMappingURL=roleRequest.model.d.ts.map