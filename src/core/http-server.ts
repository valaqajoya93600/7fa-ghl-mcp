import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { ToolManager } from './tool-manager.js';
import { GHLApiClient } from '../ghl-client/api-client.js';
import { GHLConfig } from '../types/ghl.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

dotenv.config();

class UnifiedMCPServer {
  private app: express.Application;
  private toolManager: ToolManager;
  private port: number;
  private transports: Map<string, StreamableHTTPServerTransport> = new Map();

  constructor() {
    this.port = parseInt(process.env.PORT || '8000');
    this.app = express();

    const ghlConfig = this.loadGHLConfig();
    const ghlApiClient = new GHLApiClient(ghlConfig);
    this.toolManager = new ToolManager(ghlApiClient);

    this.setupExpress();
    this.setupRoutes();
  }

  private loadGHLConfig(): GHLConfig {
    // ... (same as before)
    const config: GHLConfig = {
      apiKey: process.env.GHL_API_KEY || '',
      locationId: process.env.GHL_LOCATION_ID || '',
      baseUrl: process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com',
    };

    if (!config.apiKey || !config.locationId) {
      throw new Error('Missing required environment variables: GHL_API_KEY and GHL_LOCATION_ID');
    }
    return config;
  }

  private setupExpress(): void {
    // ... (same as before)
    this.app.use(cors({
      origin: ['https://chat.openai.com', 'http://localhost:*'],
      methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Session-Id', 'X-MCP-Session-Id', 'MCP-Session-Id'],
      credentials: true
    }));
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use((req, res, next) => {
      console.log(`[HTTP] ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // ... (same as before)
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        server: 'unified-ghl-mcp',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        tools: this.toolManager.getToolCount(),
      });
    });

    this.app.all('/mcp/:category', this.handleMcpRequest.bind(this));

    this.app.get('/', (req, res) => {
        res.json({
            name: 'Unified GoHighLevel MCP Server',
            version: '2.0.0',
            status: 'running',
            endpoints: {
                health: '/health',
                mcp_all: '/mcp/all',
                mcp_contacts: '/mcp/contacts',
                mcp_conversations: '/mcp/conversations',
            },
            totalTools: this.toolManager.getToolCount().total,
        });
    });
  }

  private async handleMcpRequest(req: express.Request, res: express.Response) {
      const categoryName = req.params.category;
      const toolDefinitions = this.toolManager.getToolDefinitionsForCategory(categoryName);

      if (toolDefinitions.length === 0) {
          return res.status(404).json({ error: `Tool category '${categoryName}' not found or is empty.` });
      }

      const mcpServer = new Server({ name: `unified-ghl-mcp-${categoryName}`, version: '2.0.0' }, { capabilities: { tools: {} } });

      // Setup the tool execution handler for this specific category
      mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
          const { name, arguments: args } = request.params;
          const categoryHandler = this.toolManager.getCategoryHandler(categoryName);
          if (!categoryHandler) {
              throw new Error(`Handler for category '${categoryName}' not found.`);
          }
          const result = await categoryHandler.executeTool(name, args || {});
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      });

      // ... (rest of the transport handling logic is the same)
      try {
          let transport: StreamableHTTPServerTransport | undefined;
          const sidHeader = (req.headers['x-session-id'] || req.headers['x-mcp-session-id'] || req.headers['mcp-session-id']) as string | undefined;

          if (sidHeader) {
              transport = this.transports.get(sidHeader);
          }

          if (!transport) {
              transport = new StreamableHTTPServerTransport({
                  sessionIdGenerator: () => randomUUID(),
                  onsessioninitialized: (sid: string) => {
                      this.transports.set(sid, transport!);
                      console.log(`[MCP] Session for '${categoryName}' initialized: ${sid}`);
                  },
              });
              await mcpServer.connect(transport);
          }

          await transport.handleRequest(req as any, res as any, (req as any).body);

          transport.onclose = () => {
              if (transport?.sessionId) {
                  this.transports.delete(transport.sessionId);
                  console.log(`[MCP] Session for '${categoryName}' closed: ${transport.sessionId}`);
              }
          };
      } catch (error) {
          console.error(`[MCP] Error handling request for category '${categoryName}':`, error);
          if (!res.headersSent) {
              res.status(500).json({ error: 'MCP request handling failed' });
          } else {
              res.end();
          }
      }
  }

  public async start(): Promise<void> {
    // ... (same as before)
    try {
      await this.toolManager.loadTools();
      console.log(`[Core] Loaded ${this.toolManager.getToolCount().total} tools across ${Object.keys(this.toolManager.getToolCount().categories).length} categories.`);

      this.app.listen(this.port, '0.0.0.0', () => {
        console.log(`✅ Unified GHL MCP Server started on http://0.0.0.0:${this.port}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

function setupGracefulShutdown(): void {
    // ... (same as before)
    process.on('SIGINT', () => {
        console.log('\n[Core] Shutting down gracefully...');
        process.exit(0);
    });
    process.on('SIGTERM', () => {
        console.log('\n[Core] Shutting down gracefully...');
        process.exit(0);
    });
}

async function main(): Promise<void> {
    // ... (same as before)
    try {
        setupGracefulShutdown();
        const server = new UnifiedMCPServer();
        await server.start();
    } catch (error) {
        console.error('💥 Fatal error during server initialization:', error);
        process.exit(1);
    }
}

main();
