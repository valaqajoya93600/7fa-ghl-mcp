import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../ghl-client/api-client.js';
import {
    MCPCreateContactParams, MCPSearchContactsParams, MCPUpdateContactParams, MCPAddContactTagsParams,
    MCPRemoveContactTagsParams, MCPCreateContactTaskParams,
    MCPUpdateContactTaskParams, MCPUpdateTaskCompletionParams, MCPCreateContactNoteParams,
    MCPUpdateContactNoteParams,
    MCPUpsertContactParams, MCPGetDuplicateContactParams, MCPGetContactsByBusinessParams,
    MCPBulkUpdateContactTagsParams, MCPBulkUpdateContactBusinessParams,
    MCPAddContactFollowersParams, MCPRemoveContactFollowersParams,
    MCPAddContactToWorkflowParams
} from '../types/contacts.js';

export class ContactTools {
    constructor(private ghlClient: GHLApiClient) {}

    getToolDefinitions(): Tool[] {
        return [
            { name: 'create_contact', description: 'Create a new contact.', inputSchema: { type: 'object', properties: { firstName: { type: 'string' }, lastName: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, source: { type: 'string' } }, required: ['email'] } },
            { name: 'search_contacts', description: 'Search for contacts.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, limit: { type: 'number' } } } },
            { name: 'get_contact', description: 'Get contact details.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' } }, required: ['contactId'] } },
            { name: 'update_contact', description: 'Update a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, firstName: { type: 'string' }, lastName: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } }, required: ['contactId'] } },
            { name: 'delete_contact', description: 'Delete a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' } }, required: ['contactId'] } },
            { name: 'add_contact_tags', description: 'Add tags to a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } }, required: ['contactId', 'tags'] } },
            { name: 'remove_contact_tags', description: 'Remove tags from a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } }, required: ['contactId', 'tags'] } },
            { name: 'get_contact_tasks', description: 'Get tasks for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' } }, required: ['contactId'] } },
            { name: 'create_contact_task', description: 'Create a task for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, title: { type: 'string' }, dueDate: { type: 'string' }, body: { type: 'string' }, completed: { type: 'boolean' }, assignedTo: { type: 'string' } }, required: ['contactId', 'title', 'dueDate'] } },
            { name: 'get_contact_task', description: 'Get a specific task for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, taskId: { type: 'string' } }, required: ['contactId', 'taskId'] } },
            { name: 'update_contact_task', description: 'Update a task for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, taskId: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' }, dueDate: { type: 'string' }, completed: { type: 'boolean' }, assignedTo: { type: 'string' } }, required: ['contactId', 'taskId'] } },
            { name: 'delete_contact_task', description: 'Delete a task for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, taskId: { type: 'string' } }, required: ['contactId', 'taskId'] } },
            { name: 'update_task_completion', description: 'Update task completion status.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, taskId: { type: 'string' }, completed: { type: 'boolean' } }, required: ['contactId', 'taskId', 'completed'] } },
            { name: 'get_contact_notes', description: 'Get notes for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' } }, required: ['contactId'] } },
            { name: 'create_contact_note', description: 'Create a note for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, body: { type: 'string' }, userId: { type: 'string' } }, required: ['contactId', 'body'] } },
            { name: 'get_contact_note', description: 'Get a specific note for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, noteId: { type: 'string' } }, required: ['contactId', 'noteId'] } },
            { name: 'update_contact_note', description: 'Update a note for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, noteId: { type: 'string' }, body: { type: 'string' }, userId: { type: 'string' } }, required: ['contactId', 'noteId', 'body'] } },
            { name: 'delete_contact_note', description: 'Delete a note for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, noteId: { type: 'string' } }, required: ['contactId', 'noteId'] } },
            { name: 'upsert_contact', description: 'Upsert a contact.', inputSchema: { type: 'object', properties: { firstName: { type: 'string' }, lastName: { type: 'string' }, name: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, address: { type: 'string' }, city: { type: 'string' }, state: { type: 'string' }, country: { type: 'string' }, postalCode: { type: 'string' }, website: { type: 'string' }, timezone: { type: 'string' }, companyName: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, customFields: { type: 'array', items: { type: 'object' } }, source: { type: 'string' }, assignedTo: { type: 'string' } } } },
            { name: 'get_duplicate_contact', description: 'Check for duplicate contacts.', inputSchema: { type: 'object', properties: { email: { type: 'string' }, phone: { type: 'string' } } } },
            { name: 'get_contacts_by_business', description: 'Get contacts by business.', inputSchema: { type: 'object', properties: { businessId: { type: 'string' }, limit: { type: 'number' }, skip: { type: 'number' }, query: { type: 'string' } }, required: ['businessId'] } },
            { name: 'get_contact_appointments', description: 'Get appointments for a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' } }, required: ['contactId'] } },
            { name: 'bulk_update_contact_tags', description: 'Bulk update tags for contacts.', inputSchema: { type: 'object', properties: { contactIds: { type: 'array', items: { type: 'string' } }, tags: { type: 'array', items: { type: 'string' } }, operation: { type: 'string', enum: ['add', 'remove'] }, removeAllTags: { type: 'boolean' } }, required: ['contactIds', 'tags', 'operation'] } },
            { name: 'bulk_update_contact_business', description: 'Bulk update business for contacts.', inputSchema: { type: 'object', properties: { contactIds: { type: 'array', items: { type: 'string' } }, businessId: { type: 'string' } }, required: ['contactIds'] } },
            { name: 'add_contact_followers', description: 'Add followers to a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, followers: { type: 'array', items: { type: 'string' } } }, required: ['contactId', 'followers'] } },
            { name: 'remove_contact_followers', description: 'Remove followers from a contact.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, followers: { type: 'array', items: { type: 'string' } } }, required: ['contactId', 'followers'] } },
            { name: 'add_contact_to_campaign', description: 'Add a contact to a campaign.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, campaignId: { type: 'string' } }, required: ['contactId', 'campaignId'] } },
            { name: 'remove_contact_from_campaign', description: 'Remove a contact from a campaign.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, campaignId: { type: 'string' } }, required: ['contactId', 'campaignId'] } },
            { name: 'remove_contact_from_all_campaigns', description: 'Remove a contact from all campaigns.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' } }, required: ['contactId'] } },
            { name: 'add_contact_to_workflow', description: 'Add a contact to a workflow.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, workflowId: { type: 'string' }, eventStartTime: { type: 'string' } }, required: ['contactId', 'workflowId'] } },
            { name: 'remove_contact_from_workflow', description: 'Remove a contact from a workflow.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, workflowId: { type: 'string' }, eventStartTime: { type: 'string' } }, required: ['contactId', 'workflowId'] } },
        ];
    }

    async executeTool(toolName: string, params: any): Promise<any> {
        switch (toolName) {
            case 'create_contact': return await this.ghlClient.makeRequest('POST', '/contacts', params as MCPCreateContactParams);
            case 'search_contacts': return await this.ghlClient.makeRequest('GET', '/contacts/search', {}, params as MCPSearchContactsParams);
            case 'get_contact': return await this.ghlClient.makeRequest('GET', `/contacts/${params.contactId}`);
            case 'update_contact': return await this.ghlClient.makeRequest('PUT', `/contacts/${params.contactId}`, params as MCPUpdateContactParams);
            case 'delete_contact': return await this.ghlClient.makeRequest('DELETE', `/contacts/${params.contactId}`);
            case 'add_contact_tags': return await this.ghlClient.makeRequest('POST', `/contacts/${params.contactId}/tags`, { tags: (params as MCPAddContactTagsParams).tags });
            case 'remove_contact_tags': return await this.ghlClient.makeRequest('DELETE', `/contacts/${params.contactId}/tags`, { tags: (params as MCPRemoveContactTagsParams).tags });
            case 'get_contact_tasks': return await this.ghlClient.makeRequest('GET', `/contacts/${params.contactId}/tasks`);
            case 'create_contact_task': return await this.ghlClient.makeRequest('POST', `/contacts/${params.contactId}/tasks`, params as MCPCreateContactTaskParams);
            case 'get_contact_task': return await this.ghlClient.makeRequest('GET', `/contacts/${params.contactId}/tasks/${params.taskId}`);
            case 'update_contact_task': return await this.ghlClient.makeRequest('PUT', `/contacts/${params.contactId}/tasks/${params.taskId}`, params as MCPUpdateContactTaskParams);
            case 'delete_contact_task': return await this.ghlClient.makeRequest('DELETE', `/contacts/${params.contactId}/tasks/${params.taskId}`);
            case 'update_task_completion': return await this.ghlClient.makeRequest('PUT', `/contacts/${params.contactId}/tasks/${params.taskId}`, { completed: (params as MCPUpdateTaskCompletionParams).completed });
            case 'get_contact_notes': return await this.ghlClient.makeRequest('GET', `/contacts/${params.contactId}/notes`);
            case 'create_contact_note': return await this.ghlClient.makeRequest('POST', `/contacts/${params.contactId}/notes`, params as MCPCreateContactNoteParams);
            case 'get_contact_note': return await this.ghlClient.makeRequest('GET', `/contacts/${params.contactId}/notes/${params.noteId}`);
            case 'update_contact_note': return await this.ghlClient.makeRequest('PUT', `/contacts/${params.contactId}/notes/${params.noteId}`, params as MCPUpdateContactNoteParams);
            case 'delete_contact_note': return await this.ghlClient.makeRequest('DELETE', `/contacts/${params.contactId}/notes/${params.noteId}`);
            case 'upsert_contact': return await this.ghlClient.makeRequest('POST', '/contacts/upsert', params as MCPUpsertContactParams);
            case 'get_duplicate_contact': return await this.ghlClient.makeRequest('GET', '/contacts/duplicate', {}, params as MCPGetDuplicateContactParams);
            case 'get_contacts_by_business': return await this.ghlClient.makeRequest('GET', `/businesses/${params.businessId}/contacts`, {}, params as MCPGetContactsByBusinessParams);
            case 'get_contact_appointments': return await this.ghlClient.makeRequest('GET', `/contacts/${params.contactId}/appointments`);
            case 'bulk_update_contact_tags': return await this.ghlClient.makeRequest('POST', '/contacts/bulk/tags', params as MCPBulkUpdateContactTagsParams);
            case 'bulk_update_contact_business': return await this.ghlClient.makeRequest('POST', '/contacts/bulk/business', params as MCPBulkUpdateContactBusinessParams);
            case 'add_contact_followers': return await this.ghlClient.makeRequest('POST', `/contacts/${params.contactId}/followers`, { followers: (params as MCPAddContactFollowersParams).followers });
            case 'remove_contact_followers': return await this.ghlClient.makeRequest('DELETE', `/contacts/${params.contactId}/followers`, { followers: (params as MCPRemoveContactFollowersParams).followers });
            case 'add_contact_to_campaign': return await this.ghlClient.makeRequest('POST', `/contacts/${params.contactId}/campaigns/${params.campaignId}`);
            case 'remove_contact_from_campaign': return await this.ghlClient.makeRequest('DELETE', `/contacts/${params.contactId}/campaigns/${params.campaignId}`);
            case 'remove_contact_from_all_campaigns': return await this.ghlClient.makeRequest('DELETE', `/contacts/${params.contactId}/campaigns`);
            case 'add_contact_to_workflow': return await this.ghlClient.makeRequest('POST', `/contacts/${params.contactId}/workflows/${params.workflowId}`, { eventStartTime: (params as MCPAddContactToWorkflowParams).eventStartTime });
            case 'remove_contact_from_workflow': return await this.ghlClient.makeRequest('DELETE', `/contacts/${params.contactId}/workflows/${params.workflowId}`);
            default: throw new Error(`Unknown contact tool: ${toolName}`);
        }
    }
}
