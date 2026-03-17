import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payout Management API',
      version: '1.0.0',
      description: 'A complete payout management system with role-based access control',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.payoutmanagement.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['OPS', 'FINANCE'] },
          },
        },
        Vendor: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            upi_id: { type: 'string' },
            bank_account: { type: 'string' },
            ifsc: { type: 'string' },
            is_active: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Payout: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            vendor_id: { type: 'string' },
            amount: { type: 'number' },
            mode: { type: 'string', enum: ['UPI', 'IMPS', 'NEFT'] },
            note: { type: 'string' },
            status: { type: 'string', enum: ['Draft', 'Submitted', 'Approved', 'Rejected'] },
            decision_reason: { type: 'string' },
            created_by: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            status: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
