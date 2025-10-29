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
    this.toolManager = new ToolManager();
    this.setupExpress();
    this.setupRoutes();
  }

  private setupExpress(): void {
    this.app.use(cors({
      origin: ['https://chat.openai.com', 'http://localhost:*'],
      methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Session-Id', 'X-MCP-Session-Id', 'MCP-Session-Id'],
      credentials: true
    }));
    this.app.use(express.json({ limit: '5mb' }));
  }

  private setupRoutes(): void {
    this.app.get('/health', (_req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));
    this.app.all('/mcp/:category', this.handleMcpRequest.bind(this));
    this.app.get('/', (_req, res) => res.json({ name: 'Unified GoHighLevel MCP Server', version: '2.0.0' }));
  }

  private async handleMcpRequest(req: express.Request, res: express.Response) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid Bearer token.' });
    }
    const apiKey = authHeader.split(' ')[1];

    const locationId = req.headers.locationid as string || process.env.GHL_LOCATION_ID;
    if (!locationId) {
        return res.status(400).json({ error: 'Bad Request: Missing Location ID in headers or environment variables.' });
    }

    const ghlConfig: GHLConfig = {
      apiKey,
      locationId,
      baseUrl: process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com',
    };
    const apiClient = new GHLApiClient(ghlConfig);

    const categoryName = req.params.category;
    const toolDefinitions = this.toolManager.getToolDefinitionsForCategory(categoryName);

    if (toolDefinitions.length === 0) {
      return res.status(404).json({ error: `Tool category '${categoryName}' not found.` });
    }

    const mcpServer = new Server({ name: `ghl-mcp-${categoryName}`, version: '2.0.0' }, { capabilities: { tools: { toolDefinitions } } });

    mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        const categoryHandler = this.toolManager.getCategoryHandler(categoryName, apiClient);
        if (!categoryHandler) {
            throw new Error(`Handler for category '${categoryName}' not found.`);
        }
        const result = await categoryHandler.executeTool(name, args || {});
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    });

    // ... (Transport handling logic remains the same)
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
    try {
      await this.toolManager.loadTools();
      console.log(`[Core] Loaded ${this.toolManager.getToolCount().total} tools.`);
      this.app.listen(this.port, '0.0.0.0', () => {
        console.log(`✅ Unified GHL MCP Server started on http://0.0.0.0:${this.port}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

async function main(): Promise<void> {
    const server = new UnifiedMCPServer();
    await server.start();
}

main();
