#!/usr/bin/env node

/**
 * GHL Agency MCP Server
 * Efficient GoHighLevel integration with 34 essential tools
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';

import { GHLApiClient } from './utils/api-client.js';
import { Logger } from './utils/logger.js';
import { toolDefinitions } from './tools/tool-definitions.js';
import { ToolExecutor } from './tools/tool-executor.js';
import { GHLConfig } from './types/index.js';

// Load environment variables
dotenv.config();

class GHLAgencyMCPServer {
  private server: Server;
  private client!: GHLApiClient;
  private executor!: ToolExecutor;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('[GHL Agency MCP]');
    
    this.server = new Server(
      {
        name: 'ghl-agency-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.validateConfig();
    this.setupHandlers();
    this.logger.info('Server initialized with 34 essential tools');
  }

  private validateConfig(): void {
    const config: GHLConfig = {
      apiKey: process.env.GHL_API_KEY || '',
      locationId: process.env.GHL_LOCATION_ID || '',
      baseUrl: process.env.GHL_BASE_URL
    };

    if (!config.apiKey) {
      throw new Error('GHL_API_KEY environment variable is required');
    }

    if (!config.locationId) {
      throw new Error('GHL_LOCATION_ID environment variable is required');
    }

    this.client = new GHLApiClient(config);
    this.executor = new ToolExecutor(this.client);
    
    this.logger.info('Configuration validated', {
      locationId: config.locationId,
      baseUrl: config.baseUrl || 'default',
      safeMode: process.env.SAFE_MODE === 'true'
    });
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      this.logger.debug('Listing tools');
      return { tools: toolDefinitions };
    });

    // Execute tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        this.logger.info(`Executing tool: ${name}`);
        
        // Check if tool exists
        const toolExists = toolDefinitions.find(t => t.name === name);
        if (!toolExists) {
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }

        // Execute tool with lazy loading
        const result = await this.executor.execute(name, args || {});
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        this.logger.error(`Tool execution failed: ${name}`, error);
        
        if (error instanceof McpError) {
          throw error;
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
      }
    });
  }

  async run(): Promise<void> {
    try {
      // Test API connection
      console.error('[GHL Agency MCP] Testing API connection...');
      await this.client.getLocation();
      console.error('[GHL Agency MCP] API connection verified');
      this.logger.info('API connection verified');
      
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      console.error('[GHL Agency MCP] Server connected to transport');
      this.logger.info('Server running on stdio transport');
    } catch (error) {
      console.error('[GHL Agency MCP] Failed to start server:', error);
      this.logger.error('Failed to start server', error);
      process.exit(1);
    }
  }
}

// Start server
console.error('[GHL Agency MCP] Starting server...');

try {
  const server = new GHLAgencyMCPServer();
  console.error('[GHL Agency MCP] Server instance created');
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    server['logger'].info('Shutting down...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    server['logger'].info('Shutting down...');
    process.exit(0);
  });
  
  server.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('[GHL Agency MCP] Failed to create server instance:', error);
  process.exit(1);
}

export { GHLAgencyMCPServer };