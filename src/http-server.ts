import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import * as dotenv from 'dotenv';
import { setupTools } from './tool-registry.js';
import { toolDefinitions } from './tools/tool-definitions.js';

dotenv.config();

const app = express();
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3000;
const SAFE_MODE = process.env.SAFE_MODE === 'true';
const DEBUG = process.env.DEBUG === 'true';

// Initialize MCP Server
const server = new Server(
  {
    name: 'ghl-agency-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Setup tool handlers
try {
  setupTools(server);
} catch (e) {
  const err = e as Error;
  console.error(`❌ Failed to set up tools: ${err.message}`);
  if (err.message.includes('GHL_API_KEY') || err.message.includes('GHL_LOCATION_ID')) {
    console.error('Please ensure GHL_API_KEY and GHL_LOCATION_ID are set in your .env file.');
  }
  process.exit(1);
}

const toolCount = toolDefinitions.length;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    tools: toolCount,
    safeMode: SAFE_MODE,
    debug: DEBUG,
  });
});

// MCP endpoint - List tools
app.get('/mcp', async (req, res) => {
  try {
    const tools = await server.listTools();
    res.json({
      tools: tools.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }))
    });
  } catch (error) {
    console.error('Error listing tools:', error);
    res.status(500).json({ error: 'Failed to list tools' });
  }
});

// MCP endpoint - Execute tool
app.post('/mcp', async (req, res) => {
  try {
    const { tool, arguments: args } = req.body;
        
    if (!tool) {
      return res.status(400).json({ error: 'Missing tool name' });
    }

    if (DEBUG) {
      console.log(`[DEBUG] Executing tool: ${tool}`, args);
    }

    // Execute the tool
    const result = await server.callTool({
      params: {
        name: tool,
        arguments: args || {}
      }
    });

    res.json(result);
  } catch (error)
  {
    console.error('Error executing tool:', error);
    res.status(500).json({ 
      error: 'Failed to execute tool',
      message: (error as Error).message 
     });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ GHL Agency MCP Server running on port ${PORT}`);
  console.log(`📊 Tools available: ${toolCount}`);
  console.log(`🔒 Safe Mode: ${SAFE_MODE ? 'ON' : 'OFF'}`);
  console.log(`🐛 Debug Mode: ${DEBUG ? 'ON' : 'OFF'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
