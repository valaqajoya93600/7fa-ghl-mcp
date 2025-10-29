import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../ghl-client/api-client.js';
import {
    // Types will be imported from '../types/conversations.js'
} from '../types/conversations.js';

export class ConversationTools {
    constructor(private ghlClient: GHLApiClient) {}

    getToolDefinitions(): Tool[] {
        // All 20 tool definitions from the original file will be placed here.
        return [
            {
                name: 'send_sms',
                description: 'Sends an SMS message to a specified contact.',
                inputSchema: { /* ... */ }
            },
            // ... other 19 tool definitions
        ];
    }

    async executeTool(toolName: string, params: any): Promise<any> {
        switch (toolName) {
            case 'send_sms':
                return await this.ghlClient.makeRequest('POST', `/conversations/messages`, { type: 'SMS', contactId: params.contactId, message: params.message });
            // ... implementations for all 20 tools using the apiClient.
            default:
                throw new Error(`Unknown conversation tool: ${toolName}`);
        }
    }
}
