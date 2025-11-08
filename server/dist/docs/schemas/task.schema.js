"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskSchemas = void 0;
exports.taskSchemas = {
    Task: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid'
            },
            title: {
                type: 'string'
            },
            description: {
                type: 'string'
            },
            project_id: {
                type: 'string',
                format: 'uuid'
            },
            assigned_to: {
                type: 'string',
                format: 'uuid'
            },
            status: {
                type: 'string',
                enum: ['todo', 'in_progress', 'review', 'completed']
            },
            priority: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'urgent']
            },
            estimated_hours: {
                type: 'number'
            },
            actual_hours: {
                type: 'number'
            },
            due_date: {
                type: 'string',
                format: 'date'
            },
            created_at: {
                type: 'string',
                format: 'date-time'
            },
            updated_at: {
                type: 'string',
                format: 'date-time'
            },
            created_by: {
                type: 'string',
                format: 'uuid'
            }
        }
    },
    CreateTaskRequest: {
        type: 'object',
        required: ['title', 'project_id'],
        properties: {
            title: {
                type: 'string'
            },
            description: {
                type: 'string'
            },
            project_id: {
                type: 'string',
                format: 'uuid'
            },
            assigned_to: {
                type: 'string',
                format: 'uuid'
            },
            status: {
                type: 'string',
                enum: ['todo', 'in_progress', 'review', 'completed'],
                default: 'todo'
            },
            priority: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'urgent'],
                default: 'medium'
            },
            estimated_hours: {
                type: 'number'
            },
            due_date: {
                type: 'string',
                format: 'date'
            }
        }
    },
    UpdateTaskRequest: {
        type: 'object',
        properties: {
            title: {
                type: 'string'
            },
            description: {
                type: 'string'
            },
            assigned_to: {
                type: 'string',
                format: 'uuid'
            },
            status: {
                type: 'string',
                enum: ['todo', 'in_progress', 'review', 'completed']
            },
            priority: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'urgent']
            },
            estimated_hours: {
                type: 'number'
            },
            actual_hours: {
                type: 'number'
            },
            due_date: {
                type: 'string',
                format: 'date'
            }
        }
    }
};
//# sourceMappingURL=task.schema.js.map