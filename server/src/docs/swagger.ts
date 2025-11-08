import swaggerJsdoc from 'swagger-jsdoc';
import { projectSchemas } from './schemas/project.schema';
import { taskSchemas } from './schemas/task.schema';
import { timesheetSchemas } from './schemas/timesheet.schema';
import { salesSchemas } from './schemas/sales.schema';
import { purchaseSchemas } from './schemas/purchase.schema';
import { expenseSchemas } from './schemas/expense.schema';
import { invoiceSchemas } from './schemas/invoice.schema';
import { roleRequestSchemas } from './schemas/roleRequest.schema'; // Add role request schemas

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
        ...projectSchemas,
        ...taskSchemas,
        ...timesheetSchemas,
        ...salesSchemas,
        ...purchaseSchemas,
        ...expenseSchemas,
        ...invoiceSchemas,
        ...roleRequestSchemas // Add role request schemas
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);