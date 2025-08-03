/**
 * Type definitions for GHL Agency MCP Server
 * Minimal types focused on essential operations
 */

export interface GHLConfig {
  apiKey: string;
  locationId: string;
  baseUrl?: string;
}

export interface GHLContact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  dateAdded: string;
}

export interface GHLTag {
  id: string;
  name: string;
}

export interface GHLWorkflow {
  id: string;
  name: string;
  status: string;
}

export interface GHLCampaign {
  id: string;
  name: string;
  status: string;
}

export interface GHLConversation {
  id: string;
  contactId: string;
  type: string;
  unreadCount: number;
  lastMessageDate: string;
}

export interface GHLCustomField {
  id: string;
  name: string;
  fieldKey: string;
  dataType: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolExecutor {
  execute(args: any): Promise<any>;
}