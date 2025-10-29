import { GHLApiClient } from '../ghl-client/api-client.js';
import { ContactTools } from '../tools/contacts.js';
import { ConversationTools } from '../tools/conversations.js'; // Import the new category
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export class ToolManager {
  private apiClient: GHLApiClient;
  private toolCategories: Map<string, any> = new Map();
  private allTools: Tool[] = [];

  constructor(apiClient: GHLApiClient) {
    this.apiClient = apiClient;
  }

  public async loadTools(): Promise<void> {
    console.log('[ToolManager] Dynamically loading tool categories...');

    // 1. Load ContactTools
    const contactsCategory = new ContactTools(this.apiClient);
    this.toolCategories.set('contacts', contactsCategory);

    // 2. Load ConversationTools (NEW)
    const conversationsCategory = new ConversationTools(this.apiClient);
    this.toolCategories.set('conversations', conversationsCategory);

    // ... In the future, we will load other categories here.

    this.compileTools();
    console.log('[ToolManager] All tool categories loaded.');
  }

  private compileTools(): void {
      this.allTools = [];
      for (const category of this.toolCategories.values()) {
          const definitions = category.getToolDefinitions();
          this.allTools.push(...definitions);
      }
  }

  public getToolDefinitionsForCategory(categoryName: string): Tool[] {
      if (categoryName === 'all') {
          return this.allTools;
      }
      const category = this.toolCategories.get(categoryName);
      if (!category) {
          return [];
      }
      return category.getToolDefinitions();
  }

  public getToolCount() {
    const categoryCounts: { [key: string]: number } = {};
    for (const [name, category] of this.toolCategories.entries()) {
        categoryCounts[name] = category.getToolDefinitions().length;
    }

    return {
        total: this.allTools.length,
        categories: categoryCounts
    };
  }

  public getCategoryHandler(categoryName: string): any {
    return this.toolCategories.get(categoryName);
  }
}
