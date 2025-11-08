export const invoiceSchemas = {
  CreateInvoiceRequest: {
    type: 'object',
    required: ['invoice_number', 'client', 'amount', 'issue_date', 'due_date'],
    properties: {
      invoice_number: {
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
      tax_amount: {
        type: 'number'
      },
      status: {
        type: 'string',
        enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
        default: 'draft'
      },
      issue_date: {
        type: 'string',
        format: 'date'
      },
      due_date: {
        type: 'string',
        format: 'date'
      },
      description: {
        type: 'string'
      }
    }
  },
  UpdateInvoiceRequest: {
    type: 'object',
    properties: {
      invoice_number: {
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
      tax_amount: {
        type: 'number'
      },
      status: {
        type: 'string',
        enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled']
      },
      issue_date: {
        type: 'string',
        format: 'date'
      },
      due_date: {
        type: 'string',
        format: 'date'
      },
      description: {
        type: 'string'
      }
    }
  }
};