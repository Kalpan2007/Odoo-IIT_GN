"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesSchemas = void 0;
exports.salesSchemas = {
    CreateSalesOrderRequest: {
        type: 'object',
        required: ['order_number', 'client', 'amount', 'order_date'],
        properties: {
            order_number: {
                type: 'string'
            },
            client: {
                type: 'string'
            },
            project_id: {
                type: 'string',
                format: 'uuid'
            },
            amount: {
                type: 'number'
            },
            status: {
                type: 'string',
                enum: ['draft', 'sent', 'accepted', 'completed', 'cancelled'],
                default: 'draft'
            },
            order_date: {
                type: 'string',
                format: 'date'
            },
            delivery_date: {
                type: 'string',
                format: 'date'
            },
            description: {
                type: 'string'
            }
        }
    },
    UpdateSalesOrderRequest: {
        type: 'object',
        properties: {
            order_number: {
                type: 'string'
            },
            client: {
                type: 'string'
            },
            project_id: {
                type: 'string',
                format: 'uuid'
            },
            amount: {
                type: 'number'
            },
            status: {
                type: 'string',
                enum: ['draft', 'sent', 'accepted', 'completed', 'cancelled']
            },
            order_date: {
                type: 'string',
                format: 'date'
            },
            delivery_date: {
                type: 'string',
                format: 'date'
            },
            description: {
                type: 'string'
            }
        }
    }
};
//# sourceMappingURL=sales.schema.js.map