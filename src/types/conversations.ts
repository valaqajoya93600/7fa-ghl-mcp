// This file contains all TypeScript interfaces and types related to Conversations.

export interface GHLConversation { id: string; /* ... other properties */ }
export interface GHLMessage { id: string; /* ... other properties */ }
// ... and all other related interfaces.

export interface MCPSendSMSParams { contactId: string; message: string; fromNumber?: string; }
export interface MCPSendEmailParams { contactId: string; subject: string; message?: string; html?: string; emailFrom?: string; attachments?: string[]; emailCc?: string[]; emailBcc?: string[]; }
export interface MCPSearchConversationsParams { contactId?: string; query?: string; status?: 'all' | 'read' | 'unread' | 'starred' | 'recents'; limit?: number; assignedTo?: string; }
export interface MCPGetConversationParams { conversationId: string; limit?: number; messageTypes?: ('TYPE_SMS' | 'TYPE_EMAIL' | 'TYPE_CALL' | 'TYPE_FACEBOOK' | 'TYPE_INSTAGRAM' | 'TYPE_WHATSAPP' | 'TYPE_LIVE_CHAT')[]; }
export interface MCPCreateConversationParams { contactId: string; }
export interface MCPUpdateConversationParams { conversationId: string; starred?: boolean; unreadCount?: number; }
export interface MCPDeleteConversationParams { conversationId: string; }
export interface MCPGetEmailMessageParams { emailMessageId: string; }
export interface MCPGetMessageParams { messageId: string; }
export interface MCPUploadMessageAttachmentsParams { conversationId: string; attachmentUrls: string[]; }
export interface MCPUpdateMessageStatusParams { messageId: string; status: 'delivered' | 'failed' | 'pending' | 'read'; error?: { code?: string; type?: string; message?: string; }; emailMessageId?: string; recipients?: string[]; }
export interface MCPAddInboundMessageParams { type: 'SMS' | 'Email' | 'WhatsApp' | 'GMB' | 'IG' | 'FB' | 'Custom' | 'WebChat' | 'Live_Chat' | 'Call'; conversationId: string; conversationProviderId: string; message?: string; attachments?: string[]; html?: string; subject?: string; emailFrom?: string; emailTo?: string; emailCc?: string[]; emailBcc?: string[]; emailMessageId?: string; altId?: string; date?: string; call?: { to?: string; from?: string; status?: 'pending' | 'completed' | 'answered' | 'busy' | 'no-answer' | 'failed' | 'canceled' | 'voicemail'; }; }
export interface MCPAddOutboundCallParams { conversationId: string; conversationProviderId: string; to: string; from: string; status: 'pending' | 'completed' | 'answered' | 'busy' | 'no-answer' | 'failed' | 'canceled' | 'voicemail'; attachments?: string[]; altId?: string; date?: string; }
export interface MCPGetMessageRecordingParams { messageId: string; }
export interface MCPGetMessageTranscriptionParams { messageId: string; }
export interface MCPDownloadTranscriptionParams { messageId: string; }
export interface MCPCancelScheduledMessageParams { messageId: string; }
export interface MCPCancelScheduledEmailParams { emailMessageId: string; }
export interface MCPLiveChatTypingParams { visitorId: string; conversationId: string; isTyping: boolean; }
