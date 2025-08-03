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
cd "/Users/robbyhiggins/Documents/MCP Servers/ghl-agency-mcp"
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

### 4. Configure Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ghl-agency": {
      "command": "node",
      "args": ["/Users/robbyhiggins/Documents/MCP Servers/ghl-agency-mcp/dist/index.js"],
      "env": {
        "GHL_API_KEY": "your_private_integration_api_key",
        "GHL_LOCATION_ID": "your_location_id",
        "SAFE_MODE": "true"
      }
    }
  }
}
```

### 5. Restart Claude Desktop

Quit and restart Claude Desktop. Look for the 🔨 tools icon to confirm connection.

## Available Tools

### Discovery Tools (5)
- `get_location` - View account structure
- `get_location_custom_fields` - See custom data fields
- `get_location_templates` - View email/SMS templates
- `ghl_get_workflows` - List all workflows
- `get_email_campaigns` - View email campaigns

### Contact Management (11)
- `search_contacts` - Find contacts
- `get_contact` - View contact details
- `create_contact` - Add new contact
- `update_contact` - Edit contact
- `add_contact_tags` - Add tags to contact ⭐
- `remove_contact_tags` - Remove tags
- `bulk_update_contact_tags` - Update multiple contacts ⭐
- `get_contact_notes` - View notes
- `create_contact_note` - Add notes
- `get_contact_tasks` - View tasks
- `get_duplicate_contact` - Check for duplicates

### Tag Management (3)
- `get_location_tags` - View all tags
- `get_location_tag` - View specific tag
- `create_location_tag` - Create new tag

### Custom Fields (3)
- `create_location_custom_field` - Add custom field
- `update_location_custom_field` - Edit custom field
- `get_location_custom_field` - View custom field

### Campaigns & Workflows (7)
- `add_contact_to_campaign` - Start email sequence ⭐
- `remove_contact_from_campaign` - Stop sequence
- `remove_contact_from_all_campaigns` - Emergency stop
- `add_contact_to_workflow` - Trigger automation ⭐
- `remove_contact_from_workflow` - Stop automation
- `get_email_templates` - View templates
- `create_email_template` - Save template

### Communication (4)
- `search_conversations` - View conversations
- `get_conversation` - Read conversation
- `send_sms` - Send text message
- `send_email` - Send email

### Analytics (2)
- `search_opportunities` - View opportunities
- `get_pipelines` - View sales pipelines

## Usage Examples

### Finding and Tagging Agency Providers

```
"Search for all contacts tagged as 'agency-provider'"
"Add the tag 'webinar-attendee' to contacts who opened our last email"
"Show me all contacts in California"
```

### Campaign Management

```
"List all active email campaigns"
"Add John Doe to the 'Welcome Series' campaign"
"Create an email template for our monthly newsletter"
```

### Workflow Automation

```
"Show me all available workflows"
"Add these 5 contacts to the 'New Provider Onboarding' workflow"
"Remove contact from all active workflows"
```

## Safe Mode

When `SAFE_MODE=true`, the server will:
- Log destructive operations without executing them
- Require confirmation for sends (SMS/email)
- Show what would happen before making changes

## Architecture

This server uses efficient patterns:
- **Lazy Loading** - Tools load on-demand, not upfront
- **Minimal Descriptions** - 5-10 word tool descriptions
- **Modular Design** - Clean separation of concerns
- **Smart Context** - ~8K tokens vs 350K+ for full server

## Troubleshooting

### Server won't start
- Check your API credentials in `.env`
- Ensure you're using a Private Integration API key
- Verify your Location ID is correct

### Tools not showing in Claude
- Restart Claude Desktop completely
- Check for syntax errors: `npm run build`
- Look for the 🔨 icon in Claude Desktop

### API errors
- Enable debug mode: `DEBUG=true`
- Check API key has required scopes
- Verify you're not hitting rate limits

## Development

```bash
# Watch mode for development
npm run dev

# Clean and rebuild
npm run clean && npm run build

# Check logs (debug mode)
DEBUG=true npm start
```

## Support

This server is designed for agency management workflows. For issues or questions:
1. Check debug logs with `DEBUG=true`
2. Verify API credentials and scopes
3. Ensure you're using the latest version

## License

MIT