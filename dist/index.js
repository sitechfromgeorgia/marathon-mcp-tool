#!/usr/bin/env node

/**
 * 🏃‍♂️ Marathon MCP Tool - FULL VERSION WITH MEMORY
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
    this.modules.set('memory', memoryModule); // MEMORY MODULE INCLUDED!

    this.logger.info('🏃‍♂️ All 7 Marathon MCP modules loaded with memory!');
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      await this.initializeModules();

      const allTools = [];
      
      // Collect tools from all modules
      for (const [name, module] of this.modules) {
        const moduleTools = await module.getTools();
        allTools.push(...moduleTools);
      }

      this.logger.info(`🎯 Marathon MCP registered ${allTools.length} tools across ${this.modules.size} modules`);
      
      return { tools: allTools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      this.logger.info(`🔧 Tool called: ${name}`);

      // Route to appropriate module
      for (const [moduleName, module] of this.modules) {
        try {
          const result = await module.handleToolCall(name, args);
          if (result !== null) {
            this.logger.info(`✅ Tool ${name} executed successfully by ${moduleName} module`);
            return result;
          }
        } catch (error) {
          this.logger.error(`❌ Error in ${moduleName} module for tool ${name}:`, error);
          throw error;
        }
      }

      throw new Error(`❌ Unknown tool: ${name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition დაშვებულია! 🇬🇪');
  }
}

const server = new MarathonMCPServer();
server.run().catch(console.error);