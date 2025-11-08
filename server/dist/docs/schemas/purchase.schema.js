"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseSchemas = void 0;
exports.purchaseSchemas = {
    CreatePurchaseRequest: {
        type: 'object',
        required: ['purchase_number', 'vendor', 'amount', 'order_date'],
        properties: {
            purchase_number: {
                type: 'string'
            },
            vendor: {
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
                enum: ['draft', 'ordered', 'received', 'paid', 'cancelled'],
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
    UpdatePurchaseRequest: {
        type: 'object',
        properties: {
            purchase_number: {
                type: 'string'
            },
            vendor: {
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
                enum: ['draft', 'ordered', 'received', 'paid', 'cancelled']
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
//# sourceMappingURL=purchase.schema.js.map