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
export interface CreateInvoiceRequest {
    invoice_number: string;
    client: string;
    project_id?: string;
    amount: number;
    tax_amount?: number;
    issue_date: string;
    due_date: string;
    description?: string;
}
export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
    status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    total_amount?: number;
}
//# sourceMappingURL=invoice.model.d.ts.map