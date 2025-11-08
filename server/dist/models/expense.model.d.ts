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
export interface CreateExpenseRequest {
    title: string;
    amount: number;
    category: string;
    project_id?: string;
    description?: string;
    receipt_url?: string;
    expense_date: string;
}
export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
    approved?: boolean;
}
//# sourceMappingURL=expense.model.d.ts.map