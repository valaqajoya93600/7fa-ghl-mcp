// This file will contain all TypeScript interfaces and types related to Conversations.

// Parameter interfaces
export interface MCPSendSMSParams {
    contactId: string;
    message: string;
    fromNumber?: string;
}

export interface MCPSendEmailParams {
    contactId: string;
    subject: string;
    message?: string;
    html?: string;
    emailFrom?: string;
    attachments?: string[];
    emailCc?: string[];
    emailBcc?: string[];
}

// ... and so on for all other parameter interfaces (MCPSearchConversationsParams, etc.)

// GHL-specific response interfaces
export interface GHLConversation { /* ... definition ... */ }
export interface GHLMessage { /* ... definition ... */ }
// ... and all other related interfaces.
