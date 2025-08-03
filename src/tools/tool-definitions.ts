/**
 * Tool Definitions - Minimal descriptions for context efficiency
 * Full schemas are loaded only when tools are executed
 */

import { ToolDefinition } from '../types/index.js';

export const toolDefinitions: ToolDefinition[] = [
  // Discovery Tools (5)
  {
    name: 'get_location',
    description: 'View account structure',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_location_custom_fields',
    description: 'See custom data fields',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_location_templates',
    description: 'View email/SMS templates',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'ghl_get_workflows',
    description: 'List all workflows',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_email_campaigns',
    description: 'View email campaigns',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string' }
      }
    }
  },

  // Contact Management (11)
  {
    name: 'search_contacts',
    description: 'Find contacts',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number' }
      }
    }
  },
  {
    name: 'get_contact',
    description: 'View contact details',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' }
      },
      required: ['contactId']
    }
  },
  {
    name: 'create_contact',
    description: 'Add new contact',
    inputSchema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        tags: { type: 'array' }
      },
      required: ['email']
    }
  },
  {
    name: 'update_contact',
    description: 'Edit contact',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' }
      },
      required: ['contactId']
    }
  },
  {
    name: 'add_contact_tags',
    description: 'Add tags to contact',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        tags: { type: 'array' }
      },
      required: ['contactId', 'tags']
    }
  },
  {
    name: 'remove_contact_tags',
    description: 'Remove tags from contact',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        tags: { type: 'array' }
      },
      required: ['contactId', 'tags']
    }
  },
  {
    name: 'bulk_update_contact_tags',
    description: 'Update tags for multiple contacts',
    inputSchema: {
      type: 'object',
      properties: {
        contactIds: { type: 'array' },
        tags: { type: 'array' },
        operation: { type: 'string' }
      },
      required: ['contactIds', 'tags', 'operation']
    }
  },
  {
    name: 'get_contact_notes',
    description: 'View contact notes',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' }
      },
      required: ['contactId']
    }
  },
  {
    name: 'create_contact_note',
    description: 'Add note to contact',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        body: { type: 'string' }
      },
      required: ['contactId', 'body']
    }
  },
  {
    name: 'get_contact_tasks',
    description: 'View contact tasks',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' }
      },
      required: ['contactId']
    }
  },
  {
    name: 'get_duplicate_contact',
    description: 'Check for duplicates',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        phone: { type: 'string' }
      }
    }
  },

  // Tag Management (3)
  {
    name: 'get_location_tags',
    description: 'View all tags',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_location_tag',
    description: 'View specific tag',
    inputSchema: {
      type: 'object',
      properties: {
        tagId: { type: 'string' }
      },
      required: ['tagId']
    }
  },
  {
    name: 'create_location_tag',
    description: 'Create new tag',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: ['name']
    }
  },

  // Custom Fields (3)
  {
    name: 'create_location_custom_field',
    description: 'Add custom field',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        dataType: { type: 'string' }
      },
      required: ['name', 'dataType']
    }
  },
  {
    name: 'update_location_custom_field',
    description: 'Edit custom field',
    inputSchema: {
      type: 'object',
      properties: {
        customFieldId: { type: 'string' },
        name: { type: 'string' }
      },
      required: ['customFieldId', 'name']
    }
  },
  {
    name: 'get_location_custom_field',
    description: 'View custom field',
    inputSchema: {
      type: 'object',
      properties: {
        customFieldId: { type: 'string' }
      },
      required: ['customFieldId']
    }
  },

  // Campaigns & Workflows (7)
  {
    name: 'add_contact_to_campaign',
    description: 'Start email sequence',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        campaignId: { type: 'string' }
      },
      required: ['contactId', 'campaignId']
    }
  },
  {
    name: 'remove_contact_from_campaign',
    description: 'Stop email sequence',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        campaignId: { type: 'string' }
      },
      required: ['contactId', 'campaignId']
    }
  },
  {
    name: 'remove_contact_from_all_campaigns',
    description: 'Stop all campaigns',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' }
      },
      required: ['contactId']
    }
  },
  {
    name: 'add_contact_to_workflow',
    description: 'Trigger automation',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        workflowId: { type: 'string' }
      },
      required: ['contactId', 'workflowId']
    }
  },
  {
    name: 'remove_contact_from_workflow',
    description: 'Stop automation',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        workflowId: { type: 'string' }
      },
      required: ['contactId', 'workflowId']
    }
  },
  {
    name: 'get_email_templates',
    description: 'View email templates',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'create_email_template',
    description: 'Save email template',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        html: { type: 'string' }
      },
      required: ['title', 'html']
    }
  },

  // Communication (4)
  {
    name: 'search_conversations',
    description: 'View conversations',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number' }
      }
    }
  },
  {
    name: 'get_conversation',
    description: 'Read conversation',
    inputSchema: {
      type: 'object',
      properties: {
        conversationId: { type: 'string' }
      },
      required: ['conversationId']
    }
  },
  {
    name: 'send_sms',
    description: 'Send text message',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        message: { type: 'string' }
      },
      required: ['contactId', 'message']
    }
  },
  {
    name: 'send_email',
    description: 'Send email',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'string' },
        subject: { type: 'string' },
        body: { type: 'string' }
      },
      required: ['contactId', 'subject', 'body']
    }
  },

  // Analytics (2)
  {
    name: 'search_opportunities',
    description: 'View opportunities',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        pipelineId: { type: 'string' }
      }
    }
  },
  {
    name: 'get_pipelines',
    description: 'View sales pipelines',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];