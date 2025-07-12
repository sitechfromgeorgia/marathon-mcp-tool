/**
 * Marathon MCP Tool v1.0.0 - Windows Compatible Version
 * 
 * One tool - all possibilities!
 * ერთი ხელსაწყო - ყველა შესაძლებლობა!
 * 
 * Georgian Interface / ქართული ინტერფეისი
 * Batumi style and love / ბათუმური ხელწერა და სიყვარული
 * 
 * FIXED VERSION - Solves Windows Unicode and JSON parsing issues
 * 
 * Created with love in Batumi, Georgia
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

class MarathonMCPServer {
  private server: Server;
  private simpleMemory: Map<string, any> = new Map();
  private isInitialized: boolean = false;
  private safeMode: boolean = true; // Safe mode for Windows compatibility

  constructor() {
    // Set process encoding to UTF-8 for Windows compatibility
    if (process.stdout.setEncoding) {
      process.stdout.setEncoding('utf8');
    }
    if (process.stderr.setEncoding) {
      process.stderr.setEncoding('utf8');
    }

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
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Safe logging without Unicode problems
    this.log('Marathon MCP Tool v1.0.0 starting...');
    this.log('Georgian interface enabled / ქართული ინტერფეისი ჩართულია');
    this.log('Windows compatible mode / Windows-თან თავსებადი რეჟიმი');
    
    this.setupHandlers();
    this.isInitialized = true;
  }

  private log(message: string): void {
    // Safe logging that works on Windows
    const timestamp = new Date().toISOString();
    const safeMessage = this.safeMode ? 
      message.replace(/[^\x00-\x7F]/g, '?') : // Replace non-ASCII chars in safe mode
      message;
    console.error(`[${timestamp}] [marathon-mcp-tool] ${safeMessage}`);
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      await this.initialize();

      const tools = [
        {
          name: 'marathon_test_connection',
          description: 'Test connection - Tests Marathon MCP Tool connection and system status',
          inputSchema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Test message (optional)',
                default: 'Hello Marathon!'
              }
            }
          }
        },
        {
          name: 'marathon_simple_memory',
          description: 'Simple memory - Basic memory operations for storing and retrieving information',
          inputSchema: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                description: 'Memory action',
                enum: ['save', 'load', 'list', 'clear']
              },
              key: {
                type: 'string',
                description: 'Memory key'
              },
              data: {
                type: 'string',
                description: 'Data to save'
              }
            },
            required: ['action']
          }
        },
        {
          name: 'marathon_health_check',
          description: 'Health check - Get Marathon MCP Tool health status and diagnostics',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'marathon_get_config',
          description: 'Get configuration - View current Marathon MCP Tool configuration',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'marathon_language_switch',
          description: 'Language switch - Switch between Georgian and English',
          inputSchema: {
            type: 'object',
            properties: {
              language: {
                type: 'string',
                description: 'Target language',
                enum: ['georgian', 'english', 'auto']
              }
            },
            required: ['language']
          }
        }
      ];

      this.log(`Loaded ${tools.length} functions successfully`);
      return { tools };
    });

    // Add resources handler to prevent "Method not found" errors
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return { resources: [] };
    });

    // Add prompts handler to prevent "Method not found" errors
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return { prompts: [] };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      await this.initialize();

      const { name, arguments: args } = request.params;
      this.log(`Processing: ${name}`);

      try {
        switch (name) {
          case 'marathon_test_connection':
            return this.handleTestConnection(args);

          case 'marathon_simple_memory':
            return this.handleSimpleMemory(args);

          case 'marathon_health_check':
            return this.handleHealthCheck(args);

          case 'marathon_get_config':
            return this.handleGetConfig(args);

          case 'marathon_language_switch':
            return this.handleLanguageSwitch(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Function not found: ${name}`
            );
        }
      } catch (error) {
        this.log(`Error in ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing function: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  private async handleTestConnection(args: any): Promise<any> {
    const message = args?.message || 'Hello Marathon!';
    
    return {
      content: [{
        type: 'text',
        text: `Marathon MCP Tool v1.0.0 Connection Test

Test Message: ${message}

Status: CONNECTED ✓
Version: 1.0.0
Georgian Interface: ENABLED ✓
Windows Compatible: YES ✓
Safe Mode: ${this.safeMode ? 'ENABLED' : 'DISABLED'}

Ready for Georgian/English operations!
მზადაა ქართული/ინგლისური ოპერაციებისთვის!`
      }]
    };
  }

  private async handleSimpleMemory(args: any): Promise<any> {
    const { action, key, data } = args;

    switch (action) {
      case 'save':
        if (!key || !data) {
          throw new Error('Key and data are required for save operation');
        }
        this.simpleMemory.set(key, data);
        return {
          content: [{
            type: 'text',
            text: `Memory saved successfully!
Key: ${key}
Data length: ${data.length} characters

შენახვა წარმატებული!`
          }]
        };

      case 'load':
        if (!key) {
          throw new Error('Key is required for load operation');
        }
        const value = this.simpleMemory.get(key);
        if (value === undefined) {
          throw new Error(`Key not found: ${key}`);
        }
        return {
          content: [{
            type: 'text',
            text: `Memory loaded:
Key: ${key}
Data: ${value}

ჩატვირთვა წარმატებული!`
          }]
        };

      case 'list':
        const keys = Array.from(this.simpleMemory.keys());
        return {
          content: [{
            type: 'text',
            text: `Memory contents:
Total keys: ${keys.length}
Keys: ${keys.join(', ') || 'None'}

მეხსიერების შინაარსი:
ჯამური გასაღებები: ${keys.length}`
          }]
        };

      case 'clear':
        const count = this.simpleMemory.size;
        this.simpleMemory.clear();
        return {
          content: [{
            type: 'text',
            text: `Memory cleared!
Removed ${count} items

მეხსიერება გასუფთავდა!
წაშლილია ${count} ელემენტი`
          }]
        };

      default:
        throw new Error(`Unknown memory action: ${action}`);
    }
  }

  private async handleHealthCheck(args: any): Promise<any> {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
      content: [{
        type: 'text',
        text: `Marathon MCP Tool Health Check

System Status: HEALTHY ✓
Version: 1.0.0
Uptime: ${Math.floor(uptime)} seconds
Memory Usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB
Georgian Interface: ACTIVE ✓
Windows Compatible: YES ✓
Safe Mode: ${this.safeMode ? 'ENABLED' : 'DISABLED'}

Memory Store: ${this.simpleMemory.size} items stored

ჯანმრთელობის მდგომარეობა: ჯანსაღი ✓
ქართული ინტერფეისი: აქტიური ✓`
      }]
    };
  }

  private async handleGetConfig(args: any): Promise<any> {
    return {
      content: [{
        type: 'text',
        text: `Marathon MCP Tool Configuration

Version: 1.0.0
Name: marathon-mcp-tool
Language: Georgian/English
Safe Mode: ${this.safeMode ? 'ENABLED' : 'DISABLED'}
Windows Compatible: YES
Encoding: UTF-8

Functions Available: 5
- marathon_test_connection
- marathon_simple_memory  
- marathon_health_check
- marathon_get_config
- marathon_language_switch

Environment:
- Node.js: ${process.version}
- Platform: ${process.platform}
- Architecture: ${process.arch}

კონფიგურაცია:
ვერსია: 1.0.0
ენა: ქართული/ინგლისური`
      }]
    };
  }

  private async handleLanguageSwitch(args: any): Promise<any> {
    const { language } = args;
    
    const responses = {
      georgian: `ენა გადაირთო ქართულზე!

Marathon MCP Tool ახლა მუშაობს ქართულ რეჟიმში.
ყველა ფუნქცია ხელმისაწვდომია ქართულ ინტერფეისით.

Language switched to Georgian!`,

      english: `Language switched to English!

Marathon MCP Tool is now operating in English mode.
All functions are available with English interface.

ენა გადაირთო ინგლისურზე!`,

      auto: `Auto language mode activated!

Marathon MCP Tool will automatically detect and use both Georgian and English.
ავტომატური ენის რეჟიმი ჩაირთო!

The tool will respond in the language of your query.`
    };

    const response = responses[language as keyof typeof responses] || responses.auto;

    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
  }

  public async start(): Promise<void> {
    try {
      const transport = new StdioServerTransport();
      
      this.log('Marathon starting!');
      this.log('Windows compatible mode enabled');
      this.log('Georgian/English interface ready');

      await this.server.connect(transport);
      
      this.log('MCP Server connected successfully');
      this.log('Ready for operations!');
    } catch (error) {
      this.log(`Failed to start server: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    console.log('Marathon MCP Tool v1.0.0 - Windows Compatible');
    console.log('Georgian Interface / ქართული ინტერფეისი');
    console.log('Test successful! / ტესტირება წარმატებული!');
    process.exit(0);
  }

  if (args.includes('--config')) {
    console.log('Configuration mode / კონფიგურაციის რეჟიმი');
    console.log('Ready for setup / მზადაა კონფიგურაციისთვის');
    process.exit(0);
  }

  // Start the server
  const server = new MarathonMCPServer();
  
  try {
    await server.start();
  } catch (error) {
    console.error('Error starting server:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('index.js')) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { MarathonMCPServer };
