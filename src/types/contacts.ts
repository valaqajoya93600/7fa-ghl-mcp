// This file contains all TypeScript interfaces and types related to Contacts.

export interface GHLContact { /* ... definition ... */ }
export interface GHLTask { /* ... definition ... */ }
export interface GHLNote { /* ... definition ... */ }
// ... and all other related interfaces.

export interface MCPCreateContactParams {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    tags?: string[];
    source?: string;
}

export interface MCPSearchContactsParams {
    query?: string;
    email?: string;
    phone?: string;
    limit?: number;
}

export interface MCPUpdateContactParams {
    contactId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    tags?: string[];
}

export interface MCPAddContactTagsParams {
    contactId: string;
    tags: string[];
}

export interface MCPRemoveContactTagsParams {
    contactId: string;
    tags: string[];
}

// ... and so on for all other parameter interfaces (MCPGetContactTasksParams, etc.)
export interface MCPGetContactTasksParams { contactId: string; }
export interface MCPCreateContactTaskParams { contactId: string; title: string; dueDate: string; body?: string; completed?: boolean; assignedTo?: string; }
export interface MCPGetContactTaskParams { contactId: string; taskId: string; }
export interface MCPUpdateContactTaskParams { contactId: string; taskId: string; title?: string; body?: string; dueDate?: string; completed?: boolean; assignedTo?: string; }
export interface MCPDeleteContactTaskParams { contactId: string; taskId: string; }
export interface MCPUpdateTaskCompletionParams { contactId: string; taskId: string; completed: boolean; }
export interface MCPGetContactNotesParams { contactId: string; }
export interface MCPCreateContactNoteParams { contactId: string; body: string; userId?: string; }
export interface MCPGetContactNoteParams { contactId: string; noteId: string; }
export interface MCPUpdateContactNoteParams { contactId: string; noteId: string; body: string; userId?: string; }
export interface MCPDeleteContactNoteParams { contactId: string; noteId: string; }
export interface MCPUpsertContactParams { firstName?: string; lastName?: string; name?: string; email?: string; phone?: string; address?: string; city?: string; state?: string; country?: string; postalCode?: string; website?: string; timezone?: string; companyName?: string; tags?: string[]; customFields?: any[]; source?: string; assignedTo?: string; }
export interface MCPGetDuplicateContactParams { email?: string; phone?: string; }
export interface MCPGetContactsByBusinessParams { businessId: string; limit?: number; skip?: number; query?: string; }
export interface MCPGetContactAppointmentsParams { contactId: string; }
export interface MCPBulkUpdateContactTagsParams { contactIds: string[]; tags: string[]; operation: 'add' | 'remove'; removeAllTags?: boolean; }
export interface MCPBulkUpdateContactBusinessParams { contactIds: string[]; businessId?: string; }
export interface MCPAddContactFollowersParams { contactId: string; followers: string[]; }
export interface MCPRemoveContactFollowersParams { contactId: string; followers: string[]; }
export interface MCPAddContactToCampaignParams { contactId: string; campaignId: string; }
export interface MCPRemoveContactFromCampaignParams { contactId: string; campaignId: string; }
export interface MCPRemoveContactFromAllCampaignsParams { contactId: string; }
export interface MCPAddContactToWorkflowParams { contactId: string; workflowId: string; eventStartTime?: string; }
export interface MCPRemoveContactFromWorkflowParams { contactId: string; workflowId: string; eventStartTime?: string; }
