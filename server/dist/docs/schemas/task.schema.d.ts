export declare const taskSchemas: {
    Task: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
            title: {
                type: string;
            };
            description: {
                type: string;
            };
            project_id: {
                type: string;
                format: string;
            };
            assigned_to: {
                type: string;
                format: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            priority: {
                type: string;
                enum: string[];
            };
            estimated_hours: {
                type: string;
            };
            actual_hours: {
                type: string;
            };
            due_date: {
                type: string;
                format: string;
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
    CreateTaskRequest: {
        type: string;
        required: string[];
        properties: {
            title: {
                type: string;
            };
            description: {
                type: string;
            };
            project_id: {
                type: string;
                format: string;
            };
            assigned_to: {
                type: string;
                format: string;
            };
            status: {
                type: string;
                enum: string[];
                default: string;
            };
            priority: {
                type: string;
                enum: string[];
                default: string;
            };
            estimated_hours: {
                type: string;
            };
            due_date: {
                type: string;
                format: string;
            };
        };
    };
    UpdateTaskRequest: {
        type: string;
        properties: {
            title: {
                type: string;
            };
            description: {
                type: string;
            };
            assigned_to: {
                type: string;
                format: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            priority: {
                type: string;
                enum: string[];
            };
            estimated_hours: {
                type: string;
            };
            actual_hours: {
                type: string;
            };
            due_date: {
                type: string;
                format: string;
            };
        };
    };
};
//# sourceMappingURL=task.schema.d.ts.map