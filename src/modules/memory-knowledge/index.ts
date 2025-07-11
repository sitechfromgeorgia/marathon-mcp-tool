/**
 * 🧠 Memory & Knowledge Management Module v1.0.0
 * მეხსიერება და ცოდნის მენეჯმენტის მოდული
 * 
 * 🚧 Development Phase - Basic memory operations
 * 🚧 განვითარების ფაზა - ძირითადი მეხსიერების ოპერაციები
 * 
 * Simple Memory:
 * - marathon_memory_save - ინფორმაციის შენახვა / Save information
 * - marathon_memory_load - ინფორმაციის ჩატვირთვა / Load information
 * - marathon_memory_list - მეხსიერების სია / Memory list
 * 
 * Knowledge Graph (Basic):
 * - marathon_kb_create_entities - ენტითების შექმნა / Create entities
 * - marathon_kb_create_relations - კავშირების შექმნა / Create relations
 * - marathon_kb_search_nodes - ნოუდების ძიება / Search nodes
 * - marathon_kb_read_graph - მთლიანი გრაფის წაკითხვა / Read full graph
 * - marathon_kb_delete_entities - ენტითების წაშლა / Delete entities
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

interface MemoryEntry {
  id: string;
  key: string;
  value: any;
  timestamp: string;
  tags?: string[];
}

interface KnowledgeEntity {
  id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
  created: string;
}

interface KnowledgeRelation {
  id: string;
  from: string;
  to: string;
  type: string;
  properties: Record<string, any>;
  created: string;
}

export class MemoryKnowledgeModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'memory-knowledge';
  private memoryPath: string;
  private knowledgePath: string;

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
    this.memoryPath = join(homedir(), '.marathon-mcp', 'memory');
    this.knowledgePath = join(homedir(), '.marathon-mcp', 'knowledge');
    this.ensureDirectories();
  }

  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.memoryPath, { recursive: true });
      await fs.mkdir(this.knowledgePath, { recursive: true });
    } catch (error) {
      console.warn('⚠️ Memory directories creation error:', error);
    }
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      // Simple Memory
      {
        name: 'marathon_memory_save',
        description: `${georgian['marathon_memory_save']} - Save information to memory`,
        inputSchema: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Memory key / მეხსიერების გასაღები'
            },
            value: {
              description: 'Value to save / შესანახი მნიშვნელობა'
            },
            tags: {
              type: 'array',
              description: 'Tags for categorization / კატეგორიზაციისთვის თეგები',
              items: { type: 'string' }
            }
          },
          required: ['key', 'value']
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
              description: 'Memory key to load / ჩასატვირთი მეხსიერების გასაღები'
            }
          },
          required: ['key']
        }
      },
      {
        name: 'marathon_memory_list',
        description: 'მეხსიერების სია / Memory list - List all stored memories',
        inputSchema: {
          type: 'object',
          properties: {
            tags: {
              type: 'array',
              description: 'Filter by tags / ფილტრაცია თეგებით',
              items: { type: 'string' }
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results / შედეგების მაქსიმალური რაოდენობა',
              default: 20 // Reduced for development
            }
          }
        }
      },
      // Knowledge Graph (Basic)
      {
        name: 'marathon_kb_create_entities',
        description: `${georgian['marathon_kb_create_entities']} - Create knowledge entities`,
        inputSchema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              description: 'Entities to create / შესაქმნელი ენტითები',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  properties: { type: 'object' }
                },
                required: ['name', 'type']
              }
            }
          },
          required: ['entities']
        }
      },
      {
        name: 'marathon_kb_search_nodes',
        description: 'ნოუდების ძიება / Search nodes - Search knowledge graph nodes',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query / ძიების მოთხოვნა'
            },
            entity_type: {
              type: 'string',
              description: 'Filter by entity type / ენტითის ტიპით ფილტრაცია'
            },
            limit: {
              type: 'number',
              description: 'Maximum results / მაქსიმალური შედეგები',
              default: 10 // Reduced for development
            }
          },
          required: ['query']
        }
      }
    ];
  }

  public async handleTool(name: string, args: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      await this.logger.logFunctionCall(name, args, this.moduleName);
      
      if (!this.config.isModuleEnabled('memory_knowledge')) {
        throw new Error('მეხსიერება და ცოდნის მოდული გამორთულია / Memory and knowledge module is disabled');
      }
      
      let result;
      
      switch (name) {
        case 'marathon_memory_save':
          result = await this.saveMemory(args);
          break;
        case 'marathon_memory_load':
          result = await this.loadMemory(args);
          break;
        case 'marathon_memory_list':
          result = await this.listMemories(args);
          break;
        case 'marathon_kb_create_entities':
          result = await this.createEntities(args);
          break;
        case 'marathon_kb_search_nodes':
          result = await this.searchNodes(args);
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

  // Simple Memory Operations
  private async saveMemory(args: any): Promise<any> {
    const { key, value, tags = [] } = args;
    
    try {
      const memoryEntry: MemoryEntry = {
        id: this.generateId(),
        key,
        value,
        timestamp: new Date().toISOString(),
        tags
      };
      
      const filePath = join(this.memoryPath, `${key}.json`);
      await fs.writeFile(filePath, JSON.stringify(memoryEntry, null, 2), 'utf-8');
      
      return {
        status: 'success',
        message: `✅ ინფორმაცია შენახულია: ${key} / Information saved: ${key}`,
        memory_id: memoryEntry.id,
        key,
        tags,
        size: JSON.stringify(value).length,
        development_mode: true,
        timestamp: memoryEntry.timestamp
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ მეხსიერებაში შენახვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Memory save error`,
        key,
        development_mode: true
      };
    }
  }

  private async loadMemory(args: any): Promise<any> {
    const { key } = args;
    
    try {
      const filePath = join(this.memoryPath, `${key}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      const memoryEntry: MemoryEntry = JSON.parse(content);
      
      return {
        status: 'success',
        message: `✅ ინფორმაცია ჩაიტვირთა: ${key} / Information loaded: ${key}`,
        memory_id: memoryEntry.id,
        key: memoryEntry.key,
        value: memoryEntry.value,
        tags: memoryEntry.tags,
        saved_at: memoryEntry.timestamp,
        development_mode: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ მეხსიერებიდან ჩატვირთვის შეცდომა: ${error instanceof Error ? error.message : 'ვერ მოიძებნა'} / Memory load error: not found`,
        key,
        development_mode: true
      };
    }
  }

  private async listMemories(args: any): Promise<any> {
    const { tags = [], limit = 20 } = args;
    
    try {
      const files = await fs.readdir(this.memoryPath);
      const memories: any[] = [];
      
      for (const file of files) {
        if (file.endsWith('.json') && memories.length < limit) {
          try {
            const filePath = join(this.memoryPath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const memoryEntry: MemoryEntry = JSON.parse(content);
            
            // Filter by tags if specified
            if (tags.length === 0 || tags.some(tag => memoryEntry.tags?.includes(tag))) {
              memories.push({
                id: memoryEntry.id,
                key: memoryEntry.key,
                tags: memoryEntry.tags,
                timestamp: memoryEntry.timestamp,
                size: JSON.stringify(memoryEntry.value).length
              });
            }
          } catch {
            // Skip invalid files
          }
        }
      }
      
      // Sort by timestamp (newest first)
      memories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return {
        status: 'success',
        message: `📚 მეხსიერების სია: ${memories.length} ელემენტი / Memory list: ${memories.length} items`,
        memories,
        total_count: memories.length,
        filtered_by_tags: tags,
        development_mode: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ მეხსიერების სიის ჩატვირთვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Memory list error`,
        development_mode: true
      };
    }
  }

  // Knowledge Graph Operations (Basic)
  private async createEntities(args: any): Promise<any> {
    const { entities } = args;
    
    try {
      const createdEntities: KnowledgeEntity[] = [];
      
      for (const entityData of entities) {
        const entity: KnowledgeEntity = {
          id: this.generateId(),
          name: entityData.name,
          type: entityData.type,
          properties: entityData.properties || {},
          created: new Date().toISOString()
        };
        
        const filePath = join(this.knowledgePath, 'entities', `${entity.id}.json`);
        await fs.mkdir(join(this.knowledgePath, 'entities'), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(entity, null, 2), 'utf-8');
        
        createdEntities.push(entity);
      }
      
      return {
        status: 'success',
        message: `✅ ${createdEntities.length} ენტითი შეიქმნა / ${createdEntities.length} entities created`,
        entities: createdEntities.map(e => ({
          id: e.id,
          name: e.name,
          type: e.type,
          created: e.created
        })),
        development_mode: true,
        development_notice: '🚧 Basic knowledge graph implementation / ძირითადი ცოდნის გრაფის განხორციელება',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ენტითების შექმნის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Entity creation error`,
        development_mode: true
      };
    }
  }

  private async searchNodes(args: any): Promise<any> {
    const { query, entity_type, limit = 10 } = args;
    
    try {
      const entitiesDir = join(this.knowledgePath, 'entities');
      
      try {
        await fs.access(entitiesDir);
      } catch {
        return {
          status: 'success',
          message: '🔍 ძიება დასრულდა: 0 შედეგი / Search completed: 0 results',
          query,
          entities: [],
          total_found: 0,
          development_notice: '🚧 No entities found. Create some entities first / ენტითები არ მოიძებნა. ჯერ შექმენით ენტითები',
          development_mode: true
        };
      }
      
      const files = await fs.readdir(entitiesDir);
      const foundEntities: any[] = [];
      
      for (const file of files) {
        if (file.endsWith('.json') && foundEntities.length < limit) {
          try {
            const filePath = join(entitiesDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const entity: KnowledgeEntity = JSON.parse(content);
            
            // Simple search in name and type
            const searchLower = query.toLowerCase();
            const nameMatch = entity.name.toLowerCase().includes(searchLower);
            const typeMatch = entity.type.toLowerCase().includes(searchLower);
            const entityTypeMatch = !entity_type || entity.type === entity_type;
            
            if ((nameMatch || typeMatch) && entityTypeMatch) {
              foundEntities.push({
                id: entity.id,
                name: entity.name,
                type: entity.type,
                created: entity.created,
                match_reason: nameMatch ? 'name' : 'type'
              });
            }
          } catch {
            // Skip invalid files
          }
        }
      }
      
      return {
        status: 'success',
        message: `🔍 ძიება დასრულდა: ${foundEntities.length} შედეგი / Search completed: ${foundEntities.length} results`,
        query,
        entity_type,
        entities: foundEntities,
        total_found: foundEntities.length,
        development_mode: true,
        development_notice: '🚧 Basic search implementation / ძირითადი ძიების განხორციელება',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ნოუდების ძიების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Node search error`,
        query,
        development_mode: true
      };
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}