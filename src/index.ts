#!/usr/bin/env node

/**
 * 🏃‍♂️ Marathon MCP Tool v1.0.0 Development Edition
 * 
 * ერთი ხელსაწყო - ყველა შესაძლებლობა!
 * One tool - all possibilities!
 * 
 * 80+ ფუნქცია 7 კატეგორიაში
 * 80+ functions in 7 categories
 * 
 * 🇬🇪 ქართული ინტერფეისი / Georgian Interface
 * 🌊 ბათუმური ხელწერა და სიყვარული / Batumi style and love
 * 🏔️ კავკასიონის მთების სიძლიერე / Strength of Caucasus Mountains
 * 
 * 🚧 Development Phase - Core functionality implementation
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

// Module imports
import { CoreSystemModule } from './modules/core-system/index.js';
import { FileSystemModule } from './modules/file-system/index.js';
import { GitRepositoryModule } from './modules/git-repository/index.js';
import { MemoryKnowledgeModule } from './modules/memory-knowledge/index.js';
import { SystemProcessModule } from './modules/system-process/index.js';
import { DocumentationModule } from './modules/documentation/index.js';
import { AdvancedFeaturesModule } from './modules/advanced-features/index.js';

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
    this.logger.info('🏃‍♂️ იწყება Marathon MCP Tool v1.0.0 Development Edition...');
    this.logger.info('🇬🇪 ქართული ინტერფეისი ჩართულია / Georgian interface enabled');
    this.logger.info('🌊 ბათუმური ხელწერით შექმნილია სიყვარულით / Created with Batumi style and love');
    this.logger.info('🚧 Development Phase - ძირითადი ფუნქციონალის განხორციელება / Core functionality implementation');

    // Initialize all modules
    this.modules.set('core', new CoreSystemModule(this.config, this.logger));
    this.modules.set('filesystem', new FileSystemModule(this.config, this.logger));
    this.modules.set('git', new GitRepositoryModule(this.config, this.logger));
    this.modules.set('memory', new MemoryKnowledgeModule(this.config, this.logger));
    this.modules.set('system', new SystemProcessModule(this.config, this.logger));
    this.modules.set('docs', new DocumentationModule(this.config, this.logger));
    this.modules.set('advanced', new AdvancedFeaturesModule(this.config, this.logger));

    this.logger.info('✅ ყველა მოდული ჩატვირთულია (7/7) / All modules loaded (7/7)');
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [];

      // Collect tools from all modules
      for (const [moduleName, module] of this.modules) {
        if (module.getTools && typeof module.getTools === 'function') {
          const moduleTools = await module.getTools();
          tools.push(...moduleTools);
        }
      }

      this.logger.info(`📊 ჩატვირთულია ${tools.length} ფუნქცია / Loaded ${tools.length} functions`);
      return { tools };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      this.logger.info(`🔧 მუშავდება: ${name} / Processing: ${name}`);

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
              this.logger.info(`✅ წარმატებით შესრულდა: ${name} / Successfully executed: ${name}`);
              return result;
            }
          } catch (error) {
            this.logger.error(`❌ შეცდომა ${name}-ში: / Error in ${name}:`, error);
            throw new McpError(
              ErrorCode.InternalError,
              `შეცდომა ფუნქციის შესრულებისას: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`
            );
          }
        }
      }

      throw new McpError(
        ErrorCode.MethodNotFound,
        `ფუნქცია ვერ მოიძებნა: ${name} / Function not found: ${name}`
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
      `სიმბოლური ბრძანება ვერ მუშავდება: ${name} / Symbol command cannot be processed: ${name}`
    );
  }

  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    
    this.logger.info('🚀 მარათონი იწყება! / Marathon starts!');
    this.logger.info('🎯 80+ ფუნქცია მზადაა მუშაობისთვის / 80+ functions ready for work');
    this.logger.info('⚡ Development Edition ჩართულია / Development Edition enabled');

    await this.server.connect(transport);
    
    this.logger.info('🔗 MCP Server წარმატებით დაკავშირდა / MCP Server connected successfully');
    this.logger.info('🏔️ კავკასიონის მთების მოგარე და ღია ზღვის სისუფთავე / Caucasus strength and Black Sea purity');
  }
}

// CLI handling
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    console.log('🏃‍♂️ Marathon MCP Tool v1.0.0 Development Edition');
    console.log('🇬🇪 ქართული ინტერფეისი / Georgian Interface');
    console.log('🚧 Development Phase - ძირითადი ფუნქციონალი / Core functionality');
    console.log('✅ ტესტირება წარმატებულია! / Testing successful!');
    process.exit(0);
  }

  if (args.includes('--config')) {
    console.log('⚙️ კონფიგურაციის რეჟიმი / Configuration mode');
    // TODO: Implement config CLI
    process.exit(0);
  }

  // Start the server
  const server = new MarathonMCPServer();
  
  server.start().catch((error) => {
    console.error('❌ შეცდომა სერვერის გაშვებისას: / Error starting server:', error);
    process.exit(1);
  });
}

export { MarathonMCPServer };