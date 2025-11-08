"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const project_schema_1 = require("./schemas/project.schema");
const task_schema_1 = require("./schemas/task.schema");
const timesheet_schema_1 = require("./schemas/timesheet.schema");
const sales_schema_1 = require("./schemas/sales.schema");
const purchase_schema_1 = require("./schemas/purchase.schema");
const expense_schema_1 = require("./schemas/expense.schema");
const invoice_schema_1 = require("./schemas/invoice.schema");
const roleRequest_schema_1 = require("./schemas/roleRequest.schema");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'OneFlow API',
            version: '1.0.0',
            description: 'OneFlow - Plan to Bill Backend API Documentation',
            contact: {
                name: 'OneFlow Team',
                email: 'support@oneflow.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://api.oneflow.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                ...project_schema_1.projectSchemas,
                ...task_schema_1.taskSchemas,
                ...timesheet_schema_1.timesheetSchemas,
                ...sales_schema_1.salesSchemas,
                ...purchase_schema_1.purchaseSchemas,
                ...expense_schema_1.expenseSchemas,
                ...invoice_schema_1.invoiceSchemas,
                ...roleRequest_schema_1.roleRequestSchemas
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map