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
export interface CreateSalesOrderRequest {
    order_number: string;
    client: string;
    project_id?: string;
    amount: number;
    status?: 'draft' | 'sent' | 'accepted' | 'completed' | 'cancelled';
    order_date: string;
    delivery_date?: string;
    description?: string;
}
export interface UpdateSalesOrderRequest extends Partial<CreateSalesOrderRequest> {
    status?: 'draft' | 'sent' | 'accepted' | 'completed' | 'cancelled';
}
//# sourceMappingURL=sales.model.d.ts.map