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
      origin: ['https://chat.openai.com', 'http://localhost:*', '*.vercel.app'],
      methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Session-Id', 'X-MCP-Session-Id', 'MCP-Session-Id', 'X-Location-Id', 'X-GHL-Domain'],
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
    console.log(`[Auth] Received request. Headers present: Authorization (${req.headers.authorization ? 'Yes' : 'No'}), X-Location-Id (${req.headers['x-location-id'] ? 'Yes' : 'No'}), X-GHL-Domain (${req.headers['x-ghl-domain'] ? 'Yes' : 'No'}).`);

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ error: 'Bad Request: Missing or invalid Authorization header. Expected Bearer token.' });
    }
    const apiKey = authHeader.split(' ')[1];

    const locationId = req.headers['x-location-id'] as string;
    if (!locationId) {
        return res.status(400).json({ error: 'Bad Request: Missing X-Location-Id header.' });
    }

    const ghlDomain = req.headers['x-ghl-domain'] as string;
    if (!ghlDomain) {
        return res.status(400).json({ error: 'Bad Request: Missing X-GHL-Domain header.' });
    }

    console.log(`[Auth] Authentication successful. Initializing client for locationId ending in ...${locationId.slice(-4)}`);

    const ghlConfig: GHLConfig = { apiKey, locationId, baseUrl: ghlDomain };
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
                },
            });
            await mcpServer.connect(transport);
        }

        await transport.handleRequest(req as any, res as any, (req as any).body);

        transport.onclose = () => {
            if (transport?.sessionId) {
                this.transports.delete(transport.sessionId);
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
