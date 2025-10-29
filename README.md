# Unified GoHighLevel MCP Server

## 1. Overview

This project is a powerful, unified, and scalable GoHighLevel (GHL) MCP Server designed to consolidate the best features from various community projects into a single, well-architected solution.

### Key Architectural Features:

*   **Modular & Scalable:** Each category of tools (e.g., Contacts, Conversations) is isolated in its own module, making the system easy to maintain and extend.
*   **Category-Based Endpoints:** To optimize for AI agents, tools are accessible via category-specific URLs (e.g., `/mcp/contacts`). This reduces the "context noise" for the AI, allowing it to focus on a specific task. A global `/mcp/all` endpoint is also available.
*   **Centralized Tool Management:** A `ToolManager` dynamically loads all available tool categories, making registration of new tools seamless.
*   **Modern & Robust Core:** Built with Express.js and the latest `@modelcontextprotocol/sdk`, using the recommended `StreamableHTTPServerTransport` for maximum compatibility and performance.
*   **Deployment-Ready:** Pre-configured for easy deployment on Railway.app.

---

## 2. Local Development Setup

### Prerequisites

*   Node.js >= 18.0.0
*   A GoHighLevel account

### Steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd unified-ghl-mcp-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Copy the example file:
    ```bash
    cp .env.example .env
    ```
    Now, edit the `.env` file and add your GoHighLevel credentials:
    ```env
    # Required: Get this from Settings > Private Integrations in your GHL account
    GHL_API_KEY="your_private_integration_api_key"
    GHL_LOCATION_ID="your_ghl_location_id"

    # Optional
    PORT=8000
    GHL_BASE_URL="https://services.leadconnectorhq.com"
    ```

4.  **Build and run the server:**
    For development with auto-reloading:
    ```bash
    npm run dev
    ```
    To run the production build:
    ```bash
    npm run build
    npm start
    ```
    The server will be running on `http://localhost:8000`.

---

## 3. Deployment to Railway

This project is pre-configured for one-click deployment on Railway.

### Steps:

1.  **Create a new Railway project:**
    *   Go to your Railway dashboard and click "New Project".
    *   Select "Deploy from a GitHub repo" and choose this repository.

2.  **Add Environment Variables:**
    *   In your new project's dashboard, go to the "Variables" tab.
    *   Add the following variables with your GHL credentials:
        *   `GHL_API_KEY`: Your Private Integration API Key.
        *   `GHL_LOCATION_ID`: Your GoHighLevel Location ID.
    *   Railway will automatically use the `PORT` variable it provides, so you don't need to set it manually.

3.  **Deploy:**
    *   Railway will automatically detect the `railway.json` file and the `start` script in `package.json`.
    *   It will build the project and deploy it. Once the deployment is complete, you will get a public URL for your server.

---

## 4. Developer Guide: Adding a New Tool Category

Our architecture makes it simple to add new categories of tools. Let's say you want to add a "Calendars" category. Here’s how you do it:

### Step 1: Create the Types File

Create a new file at `src/types/calendars.ts`. In this file, you'll define all the TypeScript interfaces for the parameters and return types of your new tools.

```typescript
// src/types/calendars.ts

// Interface for the parameters of a tool
export interface MCPGetCalendarsParams {
  locationId: string;
}

// Interface for the GHL API response
export interface GHLCalendar {
  id: string;
  name: string;
  // ... other properties
}
```

### Step 2: Create the Tool Class File

Create a new file at `src/tools/calendars.ts`. This class will define the tools and contain the logic to execute them.

```typescript
// src/tools/calendars.ts

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../ghl-client/api-client.js';
import { MCPGetCalendarsParams } from '../types/calendars.js';

export class CalendarTools {
    constructor(private ghlClient: GHLApiClient) {}

    // 1. Define your tools
    getToolDefinitions(): Tool[] {
        return [
            {
                name: 'get_calendars',
                description: 'Retrieves all calendars for a location.',
                inputSchema: {
                    type: 'object',
                    properties: { /* ... define params ... */ },
                }
            },
            // ... other calendar-related tools
        ];
    }

    // 2. Implement the execution logic
    async executeTool(toolName: string, params: any): Promise<any> {
        switch (toolName) {
            case 'get_calendars':
                // Use the shared GHL API client to make the request
                return await this.ghlClient.makeRequest('GET', '/calendars', {}, params);

            // ... other cases

            default:
                throw new Error(`Unknown calendar tool: ${toolName}`);
        }
    }
}
```

### Step 3: Register the New Category in ToolManager

The final step is to make the server aware of your new category. Open `src/core/tool-manager.ts` and simply import and instantiate your new class in the `loadTools` method.

```typescript
// src/core/tool-manager.ts

import { GHLApiClient } from '../ghl-client/api-client.js';
import { ContactTools } from '../tools/contacts.js';
import { ConversationTools } from '../tools/conversations.js';
import { CalendarTools } from '../tools/calendars.js'; // 1. Import your new class
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export class ToolManager {
  // ... (constructor and other methods)

  public async loadTools(): Promise<void> {
    console.log('[ToolManager] Dynamically loading tool categories...');

    // ... (existing categories)

    // 2. Load CalendarTools
    const calendarsCategory = new CalendarTools(this.apiClient);
    this.toolCategories.set('calendars', calendarsCategory);

    this.compileTools();
    console.log('[ToolManager] All tool categories loaded.');
  }

  // ... (rest of the file)
}
```

That's it! The server will now automatically expose your new tools under the `/mcp/calendars` endpoint and include them in the global `/mcp/all` endpoint.

---

## 5. API Endpoints

The server exposes the following endpoints:

*   `/health`: A health check endpoint that returns the server status and a list of loaded tool categories.
*   `/mcp/all`: The main MCP endpoint that provides access to **all** available tools from all categories.
*   `/mcp/{category}`: A category-specific endpoint that provides access only to the tools within that category. Examples:
    *   `/mcp/contacts`
    *   `/mcp/conversations`
    *   *(New categories you add will automatically have their own endpoint here)*
