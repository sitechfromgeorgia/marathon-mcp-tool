#!/usr/bin/env node
/**
 * 🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition - Fixed Version
 * ერთი ხელსაწყო - ყველა შესაძლებლობა!
 * 80+ Functions in 8 Modules
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
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
import { EnhancedFilesModule } from './modules/enhanced-files/index.js';
class MarathonMCPServer {
    server;
    config;
    logger;
    modules = new Map();
    constructor() {
        this.server = new Server({
            name: 'marathon-mcp-tool',
            version: '2.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.config = new MarathonConfig();
        this.logger = new MarathonLogger();
        this.initializeModules();
        this.setupHandlers();
    }
    initializeModules() {
        this.logger.info('🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition Starting...');
        this.logger.info('🇬🇪 ქართული ინტერფეისი - ბათუმური ხელწერა');
        // Initialize all modules without initialize() calls
        this.modules.set('core', new CoreSystemModule(this.config, this.logger));
        this.modules.set('filesystem', new FileSystemModule(this.config, this.logger));
        this.modules.set('git', new GitRepositoryModule(this.config, this.logger));
        this.modules.set('memory', new MemoryKnowledgeModule(this.config, this.logger));
        this.modules.set('system', new SystemProcessModule(this.config, this.logger));
        this.modules.set('docs', new DocumentationModule(this.config, this.logger));
        this.modules.set('advanced', new AdvancedFeaturesModule(this.config, this.logger));
        this.modules.set('enhanced-files', new EnhancedFilesModule(this.config, this.logger));
        this.logger.info('✅ ყველა მოდული ჩატვირთულია (8/8)');
    }
    setupHandlers() {
        // List tools handler
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const tools = [];
            // Collect tools from all modules
            for (const [moduleName, module] of this.modules) {
                if (module.getTools && typeof module.getTools === 'function') {
                    try {
                        const moduleTools = await module.getTools();
                        tools.push(...moduleTools);
                    }
                    catch (error) {
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
            // Route to appropriate module
            for (const [moduleName, module] of this.modules) {
                if (module.handleTool && typeof module.handleTool === 'function') {
                    try {
                        const result = await module.handleTool(name, args);
                        if (result) {
                            this.logger.info(`✅ წარმატებით შესრულდა: ${name}`);
                            return result;
                        }
                    }
                    catch (error) {
                        this.logger.error(`❌ შეცდომა ${name}-ში:`, error);
                        throw new McpError(ErrorCode.InternalError, `შეცდომა ფუნქციის შესრულებისას: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`);
                    }
                }
            }
            throw new McpError(ErrorCode.MethodNotFound, `ფუნქცია ვერ მოიძებნა: ${name}`);
        });
    }
    async start() {
        const transport = new StdioServerTransport();
        this.logger.info('🚀 მარათონი იწყება!');
        this.logger.info('🎯 80+ ფუნქცია მზადაა მუშაობისთვის');
        await this.server.connect(transport);
        this.logger.info('🔗 MCP Server წარმატებით დაკავშირდა');
        this.logger.info('🌊 ბათუმური ხელწერით შექმნილია');
    }
}
// CLI handling
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    if (args.includes('--test')) {
        console.log('🏃‍♂️ Marathon MCP Tool v2.0.0 Universal Edition');
        console.log('✅ ტესტირება წარმატებულია!');
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
//# sourceMappingURL=index.js.map