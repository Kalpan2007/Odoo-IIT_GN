"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseSchemas = void 0;
exports.expenseSchemas = {
    CreateExpenseRequest: {
        type: 'object',
        required: ['title', 'amount', 'category', 'expense_date'],
        properties: {
            title: {
                type: 'string'
            },
            amount: {
                type: 'number'
            },
            category: {
                type: 'string'
            },
            project_id: {
                type: 'string',
                format: 'uuid'
            },
            description: {
                type: 'string'
            },
            receipt_url: {
                type: 'string',
                format: 'uri'
            },
            expense_date: {
                type: 'string',
                format: 'date'
            }
        }
    },
    UpdateExpenseRequest: {
        type: 'object',
        properties: {
            title: {
                type: 'string'
            },
            amount: {
                type: 'number'
            },
            category: {
                type: 'string'
            },
            project_id: {
                type: 'string',
                format: 'uuid'
            },
            description: {
                type: 'string'
            },
            receipt_url: {
                type: 'string',
                format: 'uri'
            },
            expense_date: {
                type: 'string',
                format: 'date'
            },
            approved: {
                type: 'boolean'
            }
        }
    }
};
//# sourceMappingURL=expense.schema.js.map