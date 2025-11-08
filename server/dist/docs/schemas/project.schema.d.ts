export declare const projectSchemas: {
    Project: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
            name: {
                type: string;
            };
            client: {
                type: string;
            };
            start_date: {
                type: string;
                format: string;
            };
            end_date: {
                type: string;
                format: string;
                nullable: boolean;
            };
            budget: {
                type: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            description: {
                type: string;
                nullable: boolean;
            };
            revenue: {
                type: string;
                nullable: boolean;
            };
            cost: {
                type: string;
                nullable: boolean;
            };
            profit: {
                type: string;
                nullable: boolean;
            };
            created_at: {
                type: string;
                format: string;
            };
            updated_at: {
                type: string;
                format: string;
            };
            created_by: {
                type: string;
                format: string;
            };
        };
    };
    CreateProjectRequest: {
        type: string;
        required: string[];
        properties: {
            name: {
                type: string;
            };
            client: {
                type: string;
            };
            start_date: {
                type: string;
                format: string;
            };
            end_date: {
                type: string;
                format: string;
            };
            budget: {
                type: string;
            };
            status: {
                type: string;
                enum: string[];
                default: string;
            };
            description: {
                type: string;
            };
        };
    };
    UpdateProjectRequest: {
        type: string;
        properties: {
            name: {
                type: string;
            };
            client: {
                type: string;
            };
            start_date: {
                type: string;
                format: string;
            };
            end_date: {
                type: string;
                format: string;
            };
            budget: {
                type: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            description: {
                type: string;
            };
            revenue: {
                type: string;
            };
            cost: {
                type: string;
            };
        };
    };
};
//# sourceMappingURL=project.schema.d.ts.map