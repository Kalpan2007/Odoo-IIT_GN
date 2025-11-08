export declare const timesheetSchemas: {
    Timesheet: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
            user_id: {
                type: string;
                format: string;
            };
            project_id: {
                type: string;
                format: string;
            };
            task_id: {
                type: string;
                format: string;
            };
            description: {
                type: string;
            };
            hours: {
                type: string;
            };
            rate: {
                type: string;
            };
            date: {
                type: string;
                format: string;
            };
            billable: {
                type: string;
            };
            approved: {
                type: string;
            };
            created_at: {
                type: string;
                format: string;
            };
            updated_at: {
                type: string;
                format: string;
            };
        };
    };
    CreateTimesheetRequest: {
        type: string;
        required: string[];
        properties: {
            project_id: {
                type: string;
                format: string;
            };
            task_id: {
                type: string;
                format: string;
            };
            description: {
                type: string;
            };
            hours: {
                type: string;
            };
            rate: {
                type: string;
            };
            date: {
                type: string;
                format: string;
            };
            billable: {
                type: string;
                default: boolean;
            };
        };
    };
    UpdateTimesheetRequest: {
        type: string;
        properties: {
            project_id: {
                type: string;
                format: string;
            };
            task_id: {
                type: string;
                format: string;
            };
            description: {
                type: string;
            };
            hours: {
                type: string;
            };
            rate: {
                type: string;
            };
            date: {
                type: string;
                format: string;
            };
            billable: {
                type: string;
            };
            approved: {
                type: string;
            };
        };
    };
};
//# sourceMappingURL=timesheet.schema.d.ts.map