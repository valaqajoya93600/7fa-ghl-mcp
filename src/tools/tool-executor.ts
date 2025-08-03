/**
 * Tool Executor - Implements lazy loading for efficient context usage
 */

import { GHLApiClient } from '../utils/api-client.js';
import { Logger } from '../utils/logger.js';

export class ToolExecutor {
  private readonly client: GHLApiClient;
  private readonly logger: Logger;
  private readonly safeMode: boolean;

  constructor(client: GHLApiClient) {
    this.client = client;
    this.logger = new Logger('[Tool Executor]');
    this.safeMode = process.env.SAFE_MODE === 'true';
  }

  async execute(toolName: string, args: any): Promise<any> {
    this.logger.debug(`Executing tool: ${toolName}`, args);

    // Safety check for destructive operations
    if (this.safeMode && this.isDestructiveOperation(toolName)) {
      this.logger.info(`SAFE MODE: Confirming operation ${toolName}`, args);
    }

    try {
      // Execute based on tool name
      switch (toolName) {
        // Discovery Tools
        case 'get_location':
          return await this.client.getLocation();
        
        case 'get_location_custom_fields':
          return await this.client.getLocationCustomFields();
        
        case 'ghl_get_workflows':
          return await this.client.getWorkflows();
        
        case 'get_email_campaigns':
          return await this.client.getEmailCampaigns(args);

        // Contact Management
        case 'search_contacts':
          return await this.client.searchContacts({
            query: args.query,
            limit: args.limit || 20,
            locationId: this.client['config'].locationId
          });
        
        case 'get_contact':
          return await this.client.getContact(args.contactId);
        
        case 'create_contact':
          return await this.client.createContact({
            locationId: this.client['config'].locationId,
            ...args
          });
        
        case 'update_contact':
          const { contactId, ...updateData } = args;
          return await this.client.updateContact(contactId, updateData);
        
        case 'add_contact_tags':
          return await this.client.addContactTags(args.contactId, args.tags);
        
        case 'remove_contact_tags':
          return await this.client.removeContactTags(args.contactId, args.tags);
        
        case 'bulk_update_contact_tags':
          return await this.client.bulkUpdateContactTags({
            contactIds: args.contactIds,
            tags: args.tags,
            operation: args.operation
          });

        // Tag Management
        case 'get_location_tags':
          return await this.client.getLocationTags();
        
        case 'create_location_tag':
          return await this.client.createLocationTag(args.name);

        // Workflow Management
        case 'add_contact_to_workflow':
          return await this.client.addContactToWorkflow(args.contactId, args.workflowId);
        
        case 'remove_contact_from_workflow':
          return await this.client.removeContactFromWorkflow(args.contactId, args.workflowId);

        // Campaign Management
        case 'add_contact_to_campaign':
          return await this.client.addContactToCampaign(args.contactId, args.campaignId);
        
        case 'remove_contact_from_campaign':
          return await this.client.removeContactFromCampaign(args.contactId, args.campaignId);

        // Custom Fields
        case 'create_location_custom_field':
          return await this.client.createLocationCustomField({
            name: args.name,
            dataType: args.dataType,
            model: 'contact'
          });

        // Communication
        case 'search_conversations':
          return await this.client.searchConversations({
            locationId: this.client['config'].locationId,
            query: args.query,
            limit: args.limit || 20
          });
        
        case 'send_sms':
          if (this.safeMode) {
            this.logger.info('SAFE MODE: Would send SMS', args);
            return { success: true, mode: 'safe', message: 'SMS not sent in safe mode' };
          }
          return await this.client.sendSMS(args.contactId, args.message);
        
        case 'send_email':
          if (this.safeMode) {
            this.logger.info('SAFE MODE: Would send email', args);
            return { success: true, mode: 'safe', message: 'Email not sent in safe mode' };
          }
          return await this.client.sendEmail({
            contactId: args.contactId,
            subject: args.subject,
            html: args.body
          });

        // Pipeline Management
        case 'get_pipelines':
          return await this.client.getPipelines();

        // Template Management
        case 'get_location_templates':
          return await this.client.getLocationTemplates(args);
        
        case 'get_email_templates':
          return await this.client.getEmailTemplates(args);

        // Contact Tasks & Notes
        case 'get_contact_tasks':
          return await this.client.getContactTasks(args.contactId);
        
        case 'get_contact_notes':
          return await this.client.getContactNotes(args.contactId);
        
        case 'create_contact_note':
          return await this.client.createContactNote(args.contactId, args.body);

        // Duplicate Detection
        case 'get_duplicate_contact':
          return await this.client.getDuplicateContact({
            email: args.email,
            phone: args.phone,
            locationId: this.client['config'].locationId
          });
        
        default:
          throw new Error(`Tool not implemented: ${toolName}`);
      }
    } catch (error) {
      this.logger.error(`Tool execution failed: ${toolName}`, error);
      throw error;
    }
  }

  private isDestructiveOperation(toolName: string): boolean {
    const destructiveOps = [
      'send_sms',
      'send_email',
      'update_contact',
      'remove_contact_tags',
      'remove_contact_from_campaign',
      'remove_contact_from_workflow'
    ];
    return destructiveOps.includes(toolName);
  }
}