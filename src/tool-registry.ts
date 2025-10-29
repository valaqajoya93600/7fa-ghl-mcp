import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { toolDefinitions } from './tools/tool-definitions.js';
import { ToolExecutor } from './tools/tool-executor.js';
import { GHLApiClient } from './utils/api-client.js';
import { GHLConfig } from './types/index.js';
import { Logger } from './utils/logger.js';

const logger = new Logger('[GHL Agency MCP]');

function validateConfig(): GHLConfig {
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
  return config;
}

export function setupTools(server: Server) {
  const config = validateConfig();
  const client = new GHLApiClient(config);
  const executor = new ToolExecutor(client);

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.debug('Listing tools');
    return { tools: toolDefinitions };
  });

  // Execute tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      logger.info(`Executing tool: ${name}`);

      const toolExists = toolDefinitions.find(t => t.name === name);
      if (!toolExists) {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }

      const result = await executor.execute(name, args || {});

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      logger.error(`Tool execution failed: ${name}`, error);

      if (error instanceof McpError) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
    }
  });

  logger.info(`Server initialized with ${toolDefinitions.length} essential tools`);
}
