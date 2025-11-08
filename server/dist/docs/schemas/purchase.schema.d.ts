export declare const purchaseSchemas: {
    CreatePurchaseRequest: {
        type: string;
        required: string[];
        properties: {
            purchase_number: {
                type: string;
            };
            vendor: {
                type: string;
            };
            project_id: {
                type: string;
                format: string;
            };
            amount: {
                type: string;
            };
            status: {
                type: string;
                enum: string[];
                default: string;
            };
            order_date: {
                type: string;
                format: string;
            };
            delivery_date: {
                type: string;
                format: string;
            };
            description: {
                type: string;
            };
        };
    };
    UpdatePurchaseRequest: {
        type: string;
        properties: {
            purchase_number: {
                type: string;
            };
            vendor: {
                type: string;
            };
            project_id: {
                type: string;
                format: string;
            };
            amount: {
                type: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            order_date: {
                type: string;
                format: string;
            };
            delivery_date: {
                type: string;
                format: string;
            };
            description: {
                type: string;
            };
        };
    };
};
//# sourceMappingURL=purchase.schema.d.ts.map