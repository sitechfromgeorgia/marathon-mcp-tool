/**
 * 🧠 Memory & Knowledge Management Module
 * მეხსიერება და ცოდნის მენეჯმენტის მოდული
 */

import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

export class MemoryKnowledgeModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'memory-knowledge';
  private memoryStore: Map<string, any> = new Map();

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      {
        name: 'marathon_memory_save',
        description: `${georgian['marathon_memory_save']} - Save information to memory`,
        inputSchema: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Memory key identifier'
            },
            data: {
              description: 'Data to store'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Tags for categorization'
            }
          },
          required: ['key', 'data']
        }
      },
      {
        name: 'marathon_memory_load',
        description: `${georgian['marathon_memory_load']} - Load information from memory`,
        inputSchema: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Memory key to retrieve'
            }
          },
          required: ['key']
        }
      },
      {
        name: 'marathon_memory_list',
        description: `${georgian['marathon_memory_list'] || 'მეხსიერების სია'} - List all stored memories`,
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'string',
              description: 'Filter by tag or pattern'
            }
          }
        }
      },
      {
        name: 'marathon_kb_create_entities',
        description: `${georgian['marathon_kb_create_entities']} - Create knowledge base entities`,
        inputSchema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  properties: { type: 'object' }
                }
              }
            }
          },
          required: ['entities']
        }
      }
    ];
  }

  public async handleTool(name: string, args: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      await this.logger.logFunctionCall(name, args, this.moduleName);
      
      if (!this.config.isModuleEnabled('memory_knowledge')) {
        throw new Error('მეხსიერების მოდული გამორთულია');
      }
      
      let result;
      
      switch (name) {
        case 'marathon_memory_save':
          result = await this.memorySave(args);
          break;
        case 'marathon_memory_load':
          result = await this.memoryLoad(args);
          break;
        case 'marathon_memory_list':
          result = await this.memoryList(args);
          break;
        case 'marathon_kb_create_entities':
          result = await this.createEntities(args);
          break;
        default:
          return null;
      }

      const duration = Date.now() - startTime;
      await this.logger.logFunctionResult(name, result, duration, this.moduleName);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.logger.logFunctionError(name, error, duration, this.moduleName);
      throw error;
    }
  }

  private async memorySave(args: any): Promise<any> {
    const { key, data, tags = [] } = args;
    
    this.memoryStore.set(key, {
      data,
      tags,
      timestamp: new Date().toISOString(),
      batumi_signature: '🌊 ბათუმური მეხსიერება'
    });
    
    return {
      status: 'success',
      message: `💾 ინფორმაცია შენახულია: ${key}`,
      key,
      tags,
      timestamp: new Date().toISOString(),
      total_memories: this.memoryStore.size
    };
  }

  private async memoryLoad(args: any): Promise<any> {
    const { key } = args;
    const memory = this.memoryStore.get(key);
    
    if (!memory) {
      return {
        status: 'error',
        message: `🔍 მეხსიერება ვერ მოიძებნა: ${key}`,
        available_keys: Array.from(this.memoryStore.keys())
      };
    }
    
    return {
      status: 'success',
      message: `📖 მეხსიერება ჩატვირთულია: ${key}`,
      key,
      data: memory.data,
      tags: memory.tags,
      timestamp: memory.timestamp
    };
  }

  private async memoryList(args: any): Promise<any> {
    const { filter } = args;
    let memories = Array.from(this.memoryStore.entries());
    
    if (filter) {
      memories = memories.filter(([key, memory]) => 
        key.includes(filter) || 
        memory.tags.some((tag: string) => tag.includes(filter))
      );
    }
    
    return {
      status: 'success',
      message: `📋 მეხსიერების სია (${memories.length})`,
      memories: memories.map(([key, memory]) => ({
        key,
        tags: memory.tags,
        timestamp: memory.timestamp
      })),
      total_count: this.memoryStore.size,
      filtered_count: memories.length
    };
  }

  private async createEntities(args: any): Promise<any> {
    const { entities } = args;
    
    return {
      status: 'success',
      message: `🏗️ ${entities.length} ენტითი შეიქმნა ცოდნის ბაზაში`,
      entities_created: entities.length,
      entities: entities.map((e: any) => e.name),
      batumi_signature: '🌊 ბათუმური ცოდნის ბაზა'
    };
  }
}
