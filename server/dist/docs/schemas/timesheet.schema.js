"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timesheetSchemas = void 0;
exports.timesheetSchemas = {
    Timesheet: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid'
            },
            user_id: {
                type: 'string',
                format: 'uuid'
            },
            project_id: {
                type: 'string',
                format: 'uuid'
            },
            task_id: {
                type: 'string',
                format: 'uuid'
            },
            description: {
                type: 'string'
            },
            hours: {
                type: 'number'
            },
            rate: {
                type: 'number'
            },
            date: {
                type: 'string',
                format: 'date'
            },
            billable: {
                type: 'boolean'
            },
            approved: {
                type: 'boolean'
            },
            created_at: {
                type: 'string',
                format: 'date-time'
            },
            updated_at: {
                type: 'string',
                format: 'date-time'
            }
        }
    },
    CreateTimesheetRequest: {
        type: 'object',
        required: ['project_id', 'description', 'hours', 'date'],
        properties: {
            project_id: {
                type: 'string',
                format: 'uuid'
            },
            task_id: {
                type: 'string',
                format: 'uuid'
            },
            description: {
                type: 'string'
            },
            hours: {
                type: 'number'
            },
            rate: {
                type: 'number'
            },
            date: {
                type: 'string',
                format: 'date'
            },
            billable: {
                type: 'boolean',
                default: true
            }
        }
    },
    UpdateTimesheetRequest: {
        type: 'object',
        properties: {
            project_id: {
                type: 'string',
                format: 'uuid'
            },
            task_id: {
                type: 'string',
                format: 'uuid'
            },
            description: {
                type: 'string'
            },
            hours: {
                type: 'number'
            },
            rate: {
                type: 'number'
            },
            date: {
                type: 'string',
                format: 'date'
            },
            billable: {
                type: 'boolean'
            },
            approved: {
                type: 'boolean'
            }
        }
    }
};
//# sourceMappingURL=timesheet.schema.js.map