export declare const invoiceSchemas: {
    CreateInvoiceRequest: {
        type: string;
        required: string[];
        properties: {
            invoice_number: {
                type: string;
            };
            client: {
                type: string;
            };
            project_id: {
                type: string;
                format: string;
            };
            amount: {
                type: string;
            };
            tax_amount: {
                type: string;
            };
            status: {
                type: string;
                enum: string[];
                default: string;
            };
            issue_date: {
                type: string;
                format: string;
            };
            due_date: {
                type: string;
                format: string;
            };
            description: {
                type: string;
            };
        };
    };
    UpdateInvoiceRequest: {
        type: string;
        properties: {
            invoice_number: {
                type: string;
            };
            client: {
                type: string;
            };
            project_id: {
                type: string;
                format: string;
            };
            amount: {
                type: string;
            };
            tax_amount: {
                type: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            issue_date: {
                type: string;
                format: string;
            };
            due_date: {
                type: string;
                format: string;
            };
            description: {
                type: string;
            };
        };
    };
};
//# sourceMappingURL=invoice.schema.d.ts.map