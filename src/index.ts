#!/usr/bin/env node

/**
 * GHL Agency MCP Server (Stdio Version)
 * Efficient GoHighLevel integration with essential tools
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as dotenv from 'dotenv';
import { setupTools } from './tool-registry.js';
import { GHLApiClient } from './utils/api-client.js';
import { GHLConfig } from './types/index.js';

dotenv.config();

class GHLAgencyMCPServer {
  private server: Server;

  constructor() {
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

    // Setup tool handlers from the centralized registry
    try {
      setupTools(this.server);
    } catch (e) {
      const err = e as Error;
      console.error(`❌ Failed to set up tools: ${err.message}`);
      if (err.message.includes('GHL_API_KEY') || err.message.includes('GHL_LOCATION_ID')) {
        console.error('Please ensure GHL_API_KEY and GHL_LOCATION_ID are set in your .env file.');
      }
      process.exit(1);
    }
  }

  private async testApiConnection(): Promise<void> {
    const config: GHLConfig = {
      apiKey: process.env.GHL_API_KEY || '',
      locationId: process.env.GHL_LOCATION_ID || '',
      baseUrl: process.env.GHL_BASE_URL
    };
    
    // No need to re-validate, setupTools already did it.
    // Just create a client to test the connection.
    const client = new GHLApiClient(config);
    await client.getLocation();
  }

  async run(): Promise<void> {
    try {
      // Test API connection before connecting to transport
      console.error('[GHL Agency MCP] Testing API connection...');
      await this.testApiConnection();
      console.error('[GHL Agency MCP] API connection verified');
      
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      console.error('[GHL Agency MCP] Server connected to transport');
    } catch (error) {
      console.error('[GHL Agency MCP] Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start server
console.error('[GHL Agency MCP] Starting server (stdio)...');

try {
  const server = new GHLAgencyMCPServer();
  console.error('[GHL Agency MCP] Server instance created');
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.error('[GHL Agency MCP] Shutting down...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.error('[GHL Agency MCP] Shutting down...');
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
