import { GHLApiClient } from '../ghl-client/api-client.js';
import { ContactTools } from '../tools/contacts.js';
import { ConversationTools } from '../tools/conversations.js'; // Import the new category
import { Tool } from '@modelcontextprotocol/sdk/types.js';

export class ToolManager {
  private toolCategoryClasses: Map<string, any> = new Map();
  private allTools: Tool[] = [];

  constructor() {}

  public async loadTools(): Promise<void> {
    console.log('[ToolManager] Loading tool category classes...');
    this.toolCategoryClasses.set('contacts', ContactTools);
    this.toolCategoryClasses.set('conversations', ConversationTools);

    this.compileAllToolDefinitions();
    console.log('[ToolManager] All tool categories loaded.');
  }

  private compileAllToolDefinitions(): void {
      this.allTools = [];
      for (const categoryClass of this.toolCategoryClasses.values()) {
          // Temporarily instantiate to get definitions. This is suboptimal but works for now.
          const tempInstance = new categoryClass(null);
          const definitions = tempInstance.getToolDefinitions();
          this.allTools.push(...definitions);
      }
  }

  public getToolDefinitionsForCategory(categoryName: string): Tool[] {
      if (categoryName === 'all') {
          return this.allTools;
      }
      const categoryClass = this.toolCategoryClasses.get(categoryName);
      if (!categoryClass) {
          return [];
      }
      const tempInstance = new categoryClass(null);
      return tempInstance.getToolDefinitions();
  }

  public getToolCount() {
    const categoryCounts: { [key: string]: number } = {};
    for (const [name, categoryClass] of this.toolCategoryClasses.entries()) {
        const tempInstance = new categoryClass(null);
        categoryCounts[name] = tempInstance.getToolDefinitions().length;
    }

    return {
        total: this.allTools.length,
        categories: categoryCounts
    };
  }

  public getCategoryHandler(categoryName: string, apiClient: GHLApiClient): any {
    const categoryClass = this.toolCategoryClasses.get(categoryName);
    if (!categoryClass) {
        return null;
    }
    return new categoryClass(apiClient);
  }
}
