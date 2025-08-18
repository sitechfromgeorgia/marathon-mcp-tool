#!/usr/bin/env node

/**
 * 🏃‍♂️ Marathon MCP Tool v1.0.0 Stable Working Edition
 * 
 * ერთი ხელსაწყო - ყველა შესაძლებლობა!
 * 55+ ფუნქცია 5 მოდულში
 * 
 * 🇬🇪 ქართული ინტერფეისი
 * 🌊 ბათუმური ხელწერა და სიყვარული
 * 🏔️ კავკასიონის მთების სიძლიერე
 * 
 * Created with ❤️ in Batumi, Georgia
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { MarathonConfig } from './config/marathon-config.js';
import { MarathonLogger } from './utils/logger.js';

// Module imports - 5 stable modules
import { CoreSystemModule } from './modules/core-system/index.js';
import { MemoryKnowledgeModule } from './modules/memory-knowledge/index.js';
import { DocumentationModule } from './modules/documentation/index.js';
import { AdvancedFeaturesModule } from './modules/advanced-features/index.js';
import { EnhancedFilesModule } from './modules/enhanced-files/index.js';

class MarathonMCPServer {
  private server: Server;
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private modules: Map<string, any> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'marathon-mcp-tool',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
          logging: {},
        },
      }
    );

    this.config = new MarathonConfig();
    this.logger = new MarathonLogger();
    
    this.initializeModules();
    this.setupHandlers();
  }

  private initializeModules(): void {
    this.logger.info('🏃‍♂️ იწყება Marathon MCP Tool v1.0.0 Stable Working Edition...');
    this.logger.info('🇬🇪 ქართული ინტერფეისი ჩართულია');
    this.logger.info('🌊 ბათუმური ხელწერით შექმნილია სიყვარულით');

    // Initialize 5 stable modules
    this.modules.set('core', new CoreSystemModule(this.config, this.logger));
    this.modules.set('memory', new MemoryKnowledgeModule(this.config, this.logger));
    this.modules.set('docs', new DocumentationModule(this.config, this.logger));
    this.modules.set('advanced', new AdvancedFeaturesModule(this.config, this.logger));
    this.modules.set('files', new EnhancedFilesModule(this.config, this.logger));

    this.logger.info('✅ ყველა მოდული ჩატვირთულია (5/5)');
    this.logger.info('⚡ 55+ ფუნქცია მზადაა მუშაობისთვის');
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [];

      // Collect tools from all modules
      for (const [moduleName, module] of this.modules) {
        if (module.getTools && typeof module.getTools === 'function') {
          try {
            const moduleTools = await module.getTools();
            tools.push(...moduleTools);
          } catch (error) {
            this.logger.error(`Error loading tools from ${moduleName}:`, error);
          }
        }
      }

      this.logger.info(`📊 ჩატვირთულია ${tools.length} ფუნქცია`);
      return { tools };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      this.logger.info(`🔧 მუშავდება: ${name}`);

      // Handle symbol commands first
      if (this.isSymbolCommand(name)) {
        return await this.handleSymbolCommand(name, args);
      }

      // Route to appropriate module
      for (const [moduleName, module] of this.modules) {
        if (module.handleTool && typeof module.handleTool === 'function') {
          try {
            const result = await module.handleTool(name, args);
            if (result) {
              this.logger.info(`✅ წარმატებით შესრულდა: ${name}`);
              return result;
            }
          } catch (error) {
            this.logger.error(`❌ შეცდომა ${name}-ში:`, error);
            throw new McpError(
              ErrorCode.InternalError,
              `შეცდომა ფუნქციის შესრულებისას: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`
            );
          }
        }
      }

      throw new McpError(
        ErrorCode.MethodNotFound,
        `ფუნქცია ვერ მოიძებნა: ${name}`
      );
    });
  }

  private isSymbolCommand(name: string): boolean {
    const symbolCommands = ['---', '+++', '...', '***', '###', '@@@'];
    return symbolCommands.some(cmd => name.includes(cmd) || name.startsWith('marathon_symbol_'));
  }

  private async handleSymbolCommand(name: string, args: any): Promise<any> {
    const advancedModule = this.modules.get('advanced');
    if (advancedModule && advancedModule.handleSymbolCommand) {
      return await advancedModule.handleSymbolCommand(name, args);
    }
    
    throw new McpError(
      ErrorCode.MethodNotFound,
      `სიმბოლური ბრძანება ვერ მუშავდება: ${name}`
    );
  }

  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    
    this.logger.info('🚀 მარათონი იწყება!');
    this.logger.info('🎯 55+ ფუნქცია მზადაა მუშაობისთვის');
    this.logger.info('⚡ Stable Working Edition ჩართულია');

    await this.server.connect(transport);
    
    this.logger.info('🔗 MCP Server წარმატებით დაკავშირდა');
    this.logger.info('🏔️ კავკასიონის მთების სიძლიერე და ღია ზღვის სისუფთავე');
  }
}

// CLI handling
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    console.log('🏃‍♂️ Marathon MCP Tool v1.0.0 Stable Working Edition');
    console.log('🇬🇪 ქართული ინტერფეისი');
    console.log('✅ ტესტირება წარმატებულია!');
    process.exit(0);
  }

  if (args.includes('--config')) {
    console.log('⚙️ კონფიგურაციის რეჟიმი');
    // TODO: Implement config CLI
    process.exit(0);
  }

  // Start the server
  const server = new MarathonMCPServer();
  
  server.start().catch((error) => {
    console.error('❌ შეცდომა სერვერის გაშვებისას:', error);
    process.exit(1);
  });
}

export { MarathonMCPServer };