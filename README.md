# GHL Agency MCP Server

An efficient GoHighLevel MCP server designed for agency management with 34 essential tools. Built with performance in mind - uses only ~8,000 tokens vs 350,000+ tokens of the full server.

## Features

- **34 Essential Tools** - Focused on agency provider management
- **Efficient Context Usage** - Lazy loading keeps token usage minimal
- **Safe Mode** - Optional confirmation for destructive operations
- **Clean Architecture** - Modular design following best practices
- **Comprehensive READ** - Full visibility into GoHighLevel data
- **Targeted WRITE** - Focus on contacts, tags, workflows, and campaigns

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-repo/ghl-agency-mcp.git
cd ghl-agency-mcp
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your GoHighLevel credentials:
```env
GHL_API_KEY=your_private_integration_api_key
GHL_LOCATION_ID=your_location_id

# Optional
SAFE_MODE=true  # Adds confirmation prompts
DEBUG=true      # Enable debug logging
```

### 3. Build the Server

```bash
npm run build
```

### 4. Running the Server

You can run the server in two modes:

**A) HTTP Server (for local development or custom deployments)**

```bash
npm start
```
The server will run on `http://localhost:3000`.

**B) Stdio Server (for Claude Desktop)**

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ghl-agency": {
      "command": "node",
      "args": ["/path/to/your/ghl-agency-mcp/dist/index.js"],
      "env": {
        "GHL_API_KEY": "your_private_integration_api_key",
        "GHL_LOCATION_ID": "your_location_id",
        "SAFE_MODE": "true"
      }
    }
  }
}
```
*Replace `/path/to/your/ghl-agency-mcp` with the actual path to the project directory.*

### 5. Restart Claude Desktop

Quit and restart Claude Desktop. Look for the 🔨 tools icon to confirm connection.

## Available Tools

The server provides **34 tools** across several categories:

### Discovery (5)
- `get_location`, `get_location_custom_fields`, `get_location_templates`, `ghl_get_workflows`, `get_email_campaigns`

### Contact Management (11)
- `search_contacts`, `get_contact`, `create_contact`, `update_contact`, `add_contact_tags`, `remove_contact_tags`, `bulk_update_contact_tags`, `get_contact_notes`, `create_contact_note`, `get_contact_tasks`, `get_duplicate_contact`

### Tag Management (3)
- `get_location_tags`, `get_location_tag`, `create_location_tag`

### Custom Fields (3)
- `create_location_custom_field`, `update_location_custom_field`, `get_location_custom_field`

### Campaigns & Workflows (7)
- `add_contact_to_campaign`, `remove_contact_from_campaign`, `remove_contact_from_all_campaigns`, `add_contact_to_workflow`, `remove_contact_from_workflow`, `get_email_templates`, `create_email_template`

### Communication (4)
- `search_conversations`, `get_conversation`, `send_sms`, `send_email`

### Analytics (2)
- `search_opportunities`, `get_pipelines`

## Development

```bash
# Run HTTP server in watch mode for development
npm run dev

# Build the project
npm run build

# Run the production HTTP server
npm start

# Run the production Stdio server
npm run start:stdio
```

## Architecture

This server uses efficient patterns:
- **Centralized Tool Registry** - Tools are defined once and used by both HTTP and Stdio servers.
- **Lazy Loading** - Tools load on-demand, not upfront.
- **Minimal Descriptions** - 5-10 word tool descriptions for context efficiency.
- **Modular Design** - Clean separation of concerns.

## Troubleshooting

### Server won't start
- Check your API credentials in `.env`.
- Ensure you're using a Private Integration API key.
- Verify your Location ID is correct.

### Tools not showing in Claude
- Restart Claude Desktop completely.
- Check for syntax errors: `npm run build`.
- Look for the 🔨 icon in Claude Desktop.

### API errors
- Enable debug mode: `DEBUG=true`.
- Check API key has required scopes.
- Verify you're not hitting rate limits.

## License

MIT
