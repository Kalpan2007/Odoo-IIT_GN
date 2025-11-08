export const projectSchemas = {
  Project: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid'
      },
      name: {
        type: 'string'
      },
      client: {
        type: 'string'
      },
      start_date: {
        type: 'string',
        format: 'date'
      },
      end_date: {
        type: 'string',
        format: 'date',
        nullable: true
      },
      budget: {
        type: 'number'
      },
      status: {
        type: 'string',
        enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled']
      },
      description: {
        type: 'string',
        nullable: true
      },
      revenue: {
        type: 'number',
        nullable: true
      },
      cost: {
        type: 'number',
        nullable: true
      },
      profit: {
        type: 'number',
        nullable: true
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
  CreateProjectRequest: {
    type: 'object',
    required: ['name', 'client', 'start_date', 'budget'],
    properties: {
      name: {
        type: 'string'
      },
      client: {
        type: 'string'
      },
      start_date: {
        type: 'string',
        format: 'date'
      },
      end_date: {
        type: 'string',
        format: 'date'
      },
      budget: {
        type: 'number'
      },
      status: {
        type: 'string',
        enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'],
        default: 'planning'
      },
      description: {
        type: 'string'
      }
    }
  },
  UpdateProjectRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      client: {
        type: 'string'
      },
      start_date: {
        type: 'string',
        format: 'date'
      },
      end_date: {
        type: 'string',
        format: 'date'
      },
      budget: {
        type: 'number'
      },
      status: {
        type: 'string',
        enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled']
      },
      description: {
        type: 'string'
      },
      revenue: {
        type: 'number'
      },
      cost: {
        type: 'number'
      }
    }
  }
};