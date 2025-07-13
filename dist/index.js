#!/usr/bin/env node

/**
 * 🏃‍♂️ Marathon MCP Tool v2.0.0 - FULL VERSION WITH MEMORY
 * 🇬🇪 ბათუმური ხელწერით და სიყვარულით შექმნილი
 * 
 * 11 tools, 7 modules, full functionality
 * ES Module format, production ready
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { MarathonConfig } from './config/marathon-config.js';
import { MarathonLogger } from './utils/logger.js';
import { DocumentationModule } from './modules/documentation/index.js';
import { SystemProcessModule } from './modules/system-process/index.js';
import { CoreSystemModule } from './modules/core-system/index.js';
import { FileSystemModule } from './modules/file-system/index.js';
import { GitRepositoryModule } from './modules/git-repository/index.js';
import { AdvancedFeaturesModule } from './modules/advanced-features/index.js';
import { MemoryKnowledgeModule } from './modules/memory-knowledge/index.js';

class MarathonMCPServer {
  constructor() {
    this.server = new Server(
      { name: 'marathon-mcp-tool', version: '2.0.0' },
      { capabilities: { tools: {} } }
    );

    this.config = new MarathonConfig();
    this.logger = new MarathonLogger();
    this.modules = new Map();
    
    this.setupHandlers();
  }
  
  async initializeModules() {
    // Create modules WITH MEMORY MODULE NOW!
    const docsModule = new DocumentationModule(this.config, this.logger);
    const systemModule = new SystemProcessModule(this.config, this.logger);
    const coreModule = new CoreSystemModule(this.config, this.logger);
    const fsModule = new FileSystemModule(this.config, this.logger);
    const gitModule = new GitRepositoryModule(this.config, this.logger);
    const advancedModule = new AdvancedFeaturesModule(this.config, this.logger);
    const memoryModule = new MemoryKnowledgeModule(this.config, this.logger);

    // Store modules
    this.modules.set('docs', docsModule);
    this.modules.set('system', systemModule);
    this.modules.set('core', coreModule);
    this.modules.set('filesystem', fsModule);
    this.modules.set('git', gitModule);
    this.modules.set('advanced', advancedModule);
    this.modules.set('memory', memoryModule);

    this.logger.info('ყველა მოდული ინიციალიზებულია (Memory-თი ერთად!)');
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [];

      for (const [moduleName, module] of this.modules) {
        if (module.getTools && typeof module.getTools === 'function') {
          try {
            const moduleTools = await module.getTools();
            tools.push(...moduleTools);
          } catch (error) {
            this.logger.error(`Error getting tools from ${moduleName}:`, error);
          }
        }
      }

      this.logger.info(`ჩატვირთულია ${tools.length} ფუნქცია`);
      return { tools };
    });
    
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      this.logger.info(`მუშავდება: ${name}`);

      for (const [moduleName, module] of this.modules) {
        if (module.handleTool && typeof module.handleTool === 'function') {
          try {
            const result = await module.handleTool(name, args);
            if (result) {
              this.logger.info(`წარმატებით შესრულდა: ${name}`);
              return result;
            }
          } catch (error) {
            this.logger.error(`შეცდომა ${name}-ში:`, error);
            return {
              content: [{
                type: 'text',
                text: `შეცდომა: ${error.message}`
              }]
            };
          }
        }
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  async start() {
    this.logger.info('Marathon MCP Tool v2.0.0 იწყება... (მეხსიერებით!)');

    await this.initializeModules();
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    this.logger.info('Server მზადაა! 🏃‍♂️🇬🇪');
  }
}

// Start the server
const server = new MarathonMCPServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});