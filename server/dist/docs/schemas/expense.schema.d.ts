export declare const expenseSchemas: {
    CreateExpenseRequest: {
        type: string;
        required: string[];
        properties: {
            title: {
                type: string;
            };
            amount: {
                type: string;
            };
            category: {
                type: string;
            };
            project_id: {
                type: string;
                format: string;
            };
            description: {
                type: string;
            };
            receipt_url: {
                type: string;
                format: string;
            };
            expense_date: {
                type: string;
                format: string;
            };
        };
    };
    UpdateExpenseRequest: {
        type: string;
        properties: {
            title: {
                type: string;
            };
            amount: {
                type: string;
            };
            category: {
                type: string;
            };
            project_id: {
                type: string;
                format: string;
            };
            description: {
                type: string;
            };
            receipt_url: {
                type: string;
                format: string;
            };
            expense_date: {
                type: string;
                format: string;
            };
            approved: {
                type: string;
            };
        };
    };
};
//# sourceMappingURL=expense.schema.d.ts.map