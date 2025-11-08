export declare const salesSchemas: {
    CreateSalesOrderRequest: {
        type: string;
        required: string[];
        properties: {
            order_number: {
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
    UpdateSalesOrderRequest: {
        type: string;
        properties: {
            order_number: {
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
//# sourceMappingURL=sales.schema.d.ts.map