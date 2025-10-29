import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../ghl-client/api-client.js';
import {
    MCPSendSMSParams, MCPSendEmailParams, MCPSearchConversationsParams,
    MCPCreateConversationParams, MCPUpdateConversationParams, MCPUploadMessageAttachmentsParams, MCPUpdateMessageStatusParams, MCPAddInboundMessageParams,
    MCPAddOutboundCallParams, MCPLiveChatTypingParams
} from '../types/conversations.js';

export class ConversationTools {
    constructor(private ghlClient: GHLApiClient) {}

    getToolDefinitions(): Tool[] {
        return [
            { name: 'send_sms', description: 'Send an SMS.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, message: { type: 'string' }, fromNumber: { type: 'string' } }, required: ['contactId', 'message'] } },
            { name: 'send_email', description: 'Send an email.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, subject: { type: 'string' }, message: { type: 'string' }, html: { type: 'string' }, emailFrom: { type: 'string' }, attachments: { type: 'array', items: { type: 'string' } }, emailCc: { type: 'array', items: { type: 'string' } }, emailBcc: { type: 'array', items: { type: 'string' } } }, required: ['contactId', 'subject'] } },
            { name: 'search_conversations', description: 'Search conversations.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' }, query: { type: 'string' }, status: { type: 'string', enum: ['all', 'read', 'unread', 'starred', 'recents'] }, limit: { type: 'number' }, assignedTo: { type: 'string' } } } },
            { name: 'get_conversation', description: 'Get a conversation.', inputSchema: { type: 'object', properties: { conversationId: { type: 'string' }, limit: { type: 'number' }, messageTypes: { type: 'array', items: { type: 'string', enum: ['TYPE_SMS', 'TYPE_EMAIL', 'TYPE_CALL', 'TYPE_FACEBOOK', 'TYPE_INSTAGRAM', 'TYPE_WHATSAPP', 'TYPE_LIVE_CHAT'] } } }, required: ['conversationId'] } },
            { name: 'create_conversation', description: 'Create a conversation.', inputSchema: { type: 'object', properties: { contactId: { type: 'string' } }, required: ['contactId'] } },
            { name: 'update_conversation', description: 'Update a conversation.', inputSchema: { type: 'object', properties: { conversationId: { type: 'string' }, starred: { type: 'boolean' }, unreadCount: { type: 'number' } }, required: ['conversationId'] } },
            { name: 'get_recent_messages', description: 'Get recent messages.', inputSchema: { type: 'object', properties: { limit: { type: 'number' }, status: { type: 'string', enum: ['all', 'unread'] } } } },
            { name: 'delete_conversation', description: 'Delete a conversation.', inputSchema: { type: 'object', properties: { conversationId: { type: 'string' } }, required: ['conversationId'] } },
            { name: 'get_email_message', description: 'Get an email message.', inputSchema: { type: 'object', properties: { emailMessageId: { type: 'string' } }, required: ['emailMessageId'] } },
            { name: 'get_message', description: 'Get a message.', inputSchema: { type: 'object', properties: { messageId: { type: 'string' } }, required: ['messageId'] } },
            { name: 'upload_message_attachments', description: 'Upload attachments for a message.', inputSchema: { type: 'object', properties: { conversationId: { type: 'string' }, attachmentUrls: { type: 'array', items: { type: 'string' } } }, required: ['conversationId', 'attachmentUrls'] } },
            { name: 'update_message_status', description: 'Update message status.', inputSchema: { type: 'object', properties: { messageId: { type: 'string' }, status: { type: 'string', enum: ['delivered', 'failed', 'pending', 'read'] }, error: { type: 'object', properties: { code: { type: 'string' }, type: { type: 'string' }, message: { type: 'string' } } }, emailMessageId: { type: 'string' }, recipients: { type: 'array', items: { type: 'string' } } }, required: ['messageId', 'status'] } },
            { name: 'add_inbound_message', description: 'Add an inbound message.', inputSchema: { type: 'object', properties: { type: { type: 'string', enum: ['SMS', 'Email', 'WhatsApp', 'GMB', 'IG', 'FB', 'Custom', 'WebChat', 'Live_Chat', 'Call'] }, conversationId: { type: 'string' }, conversationProviderId: { type: 'string' }, message: { type: 'string' }, attachments: { type: 'array', items: { type: 'string' } }, html: { type: 'string' }, subject: { type: 'string' }, emailFrom: { type: 'string' }, emailTo: { type: 'string' }, emailCc: { type: 'array', items: { type: 'string' } }, emailBcc: { type: 'array', items: { type: 'string' } }, emailMessageId: { type: 'string' }, altId: { type: 'string' }, date: { type: 'string' }, call: { type: 'object', properties: { to: { type: 'string' }, from: { type: 'string' }, status: { type: 'string', enum: ['pending', 'completed', 'answered', 'busy', 'no-answer', 'failed', 'canceled', 'voicemail'] } } } }, required: ['type', 'conversationId', 'conversationProviderId'] } },
            { name: 'add_outbound_call', description: 'Add an outbound call.', inputSchema: { type: 'object', properties: { conversationId: { type: 'string' }, conversationProviderId: { type: 'string' }, to: { type: 'string' }, from: { type: 'string' }, status: { type: 'string', enum: ['pending', 'completed', 'answered', 'busy', 'no-answer', 'failed', 'canceled', 'voicemail'] }, attachments: { type: 'array', items: { type: 'string' } }, altId: { type: 'string' }, date: { type: 'string' } }, required: ['conversationId', 'conversationProviderId', 'to', 'from', 'status'] } },
            { name: 'get_message_recording', description: 'Get a message recording.', inputSchema: { type: 'object', properties: { messageId: { type: 'string' } }, required: ['messageId'] } },
            { name: 'get_message_transcription', description: 'Get a message transcription.', inputSchema: { type: 'object', properties: { messageId: { type: 'string' } }, required: ['messageId'] } },
            { name: 'download_transcription', description: 'Download a transcription.', inputSchema: { type: 'object', properties: { messageId: { type: 'string' } }, required: ['messageId'] } },
            { name: 'cancel_scheduled_message', description: 'Cancel a scheduled message.', inputSchema: { type: 'object', properties: { messageId: { type: 'string' } }, required: ['messageId'] } },
            { name: 'cancel_scheduled_email', description: 'Cancel a scheduled email.', inputSchema: { type: 'object', properties: { emailMessageId: { type: 'string' } }, required: ['emailMessageId'] } },
            { name: 'live_chat_typing', description: 'Indicate live chat typing.', inputSchema: { type: 'object', properties: { visitorId: { type: 'string' }, conversationId: { type: 'string' }, isTyping: { type: 'boolean' } }, required: ['visitorId', 'conversationId', 'isTyping'] } },
        ];
    }

    async executeTool(toolName: string, params: any): Promise<any> {
        switch (toolName) {
            case 'send_sms': return await this.ghlClient.makeRequest('POST', '/conversations/messages', { type: 'SMS', ...params } as MCPSendSMSParams);
            case 'send_email': return await this.ghlClient.makeRequest('POST', '/conversations/messages', { type: 'Email', ...params } as MCPSendEmailParams);
            case 'search_conversations': return await this.ghlClient.makeRequest('GET', '/conversations/search', {}, params as MCPSearchConversationsParams);
            case 'get_conversation': return await this.ghlClient.makeRequest('GET', `/conversations/${params.conversationId}`);
            case 'create_conversation': return await this.ghlClient.makeRequest('POST', '/conversations', params as MCPCreateConversationParams);
            case 'update_conversation': return await this.ghlClient.makeRequest('PUT', `/conversations/${params.conversationId}`, params as MCPUpdateConversationParams);
            case 'get_recent_messages': return await this.ghlClient.makeRequest('GET', '/conversations/search', {}, { status: 'unread', limit: 10, ...params });
            case 'delete_conversation': return await this.ghlClient.makeRequest('DELETE', `/conversations/${params.conversationId}`);
            case 'get_email_message': return await this.ghlClient.makeRequest('GET', `/conversations/messages/email/${params.emailMessageId}`);
            case 'get_message': return await this.ghlClient.makeRequest('GET', `/conversations/messages/${params.messageId}`);
            case 'upload_message_attachments': return await this.ghlClient.makeRequest('POST', `/conversations/messages/attachments`, params as MCPUploadMessageAttachmentsParams);
            case 'update_message_status': return await this.ghlClient.makeRequest('PUT', `/conversations/messages/${params.messageId}/status`, params as MCPUpdateMessageStatusParams);
            case 'add_inbound_message': return await this.ghlClient.makeRequest('POST', '/conversations/messages/inbound', params as MCPAddInboundMessageParams);
            case 'add_outbound_call': return await this.ghlClient.makeRequest('POST', '/conversations/messages/call/outbound', params as MCPAddOutboundCallParams);
            case 'get_message_recording': return await this.ghlClient.makeRequest('GET', `/conversations/messages/${params.messageId}/recording`);
            case 'get_message_transcription': return await this.ghlClient.makeRequest('GET', `/conversations/messages/${params.messageId}/transcription`);
            case 'download_transcription': return await this.ghlClient.makeRequest('GET', `/conversations/messages/${params.messageId}/transcription/download`);
            case 'cancel_scheduled_message': return await this.ghlClient.makeRequest('POST', `/conversations/messages/${params.messageId}/cancel`);
            case 'cancel_scheduled_email': return await this.ghlClient.makeRequest('POST', `/conversations/messages/email/${params.emailMessageId}/cancel`);
            case 'live_chat_typing': return await this.ghlClient.makeRequest('POST', '/conversations/live-chat/typing-indicator', params as MCPLiveChatTypingParams);
            default: throw new Error(`Unknown conversation tool: ${toolName}`);
        }
    }
}
