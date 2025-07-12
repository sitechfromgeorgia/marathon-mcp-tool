/**
 * 🧠 Memory & Knowledge Management Module v2.0.0 Enhanced
 * მეხსიერება და ცოდნის მენეჯმენტის მოდული
 * 
 * 🎉 FULLY UPGRADED - All 10 functions enabled!
 * 🎉 სრულად განახლდა - ყველა 10 ფუნქცია ჩართულია!
 * 
 * Simple Memory:
 * - marathon_memory_save - ინფორმაციის შენახვა / Save information
 * - marathon_memory_load - ინფორმაციის ჩატვირთვა / Load information
 * - marathon_memory_list - მეხსიერების სია / Memory list
 * 
 * Knowledge Graph (Complete):
 * - marathon_kb_create_entities - ენტითების შექმნა / Create entities
 * - marathon_kb_create_relations - კავშირების შექმნა / Create relations ✨NEW
 * - marathon_kb_add_observations - დაკვირვებების დამატება / Add observations ✨NEW
 * - marathon_kb_search_nodes - ნოუდების ძიება / Search nodes
 * - marathon_kb_read_graph - მთლიანი გრაფის წაკითხვა / Read full graph ✨NEW
 * - marathon_kb_delete_entities - ენტითების წაშლა / Delete entities ✨NEW
 * - marathon_kb_delete_relations - კავშირების წაშლა / Delete relations ✨NEW
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
  observations: string[];
  created: string;
  updated: string;
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
      await fs.mkdir(join(this.knowledgePath, 'entities'), { recursive: true });
      await fs.mkdir(join(this.knowledgePath, 'relations'), { recursive: true });
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
              default: 50
            }
          }
        }
      },
      
      // Knowledge Graph (Complete)
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
                  properties: { type: 'object' },
                  observations: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'Initial observations / საწყისი დაკვირვებები'
                  }
                },
                required: ['name', 'type']
              }
            }
          },
          required: ['entities']
        }
      },
      {
        name: 'marathon_kb_create_relations',
        description: `${georgian['marathon_kb_create_relations']} - Create relations between entities`,
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
              description: 'Relations to create / შესაქმნელი კავშირები',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string', description: 'Source entity name / წყარო ენტითის სახელი' },
                  to: { type: 'string', description: 'Target entity name / სამიზნე ენტითის სახელი' },
                  type: { type: 'string', description: 'Relation type / კავშირის ტიპი' },
                  properties: { type: 'object', description: 'Additional properties / დამატებითი თვისებები' }
                },
                required: ['from', 'to', 'type']
              }
            }
          },
          required: ['relations']
        }
      },
      {
        name: 'marathon_kb_add_observations',
        description: `${georgian['marathon_kb_add_observations']} - Add observations to entities`,
        inputSchema: {
          type: 'object',
          properties: {
            observations: {
              type: 'array',
              description: 'Observations to add / დასამატებელი დაკვირვებები',
              items: {
                type: 'object',
                properties: {
                  entity_name: { type: 'string', description: 'Entity name / ენტითის სახელი' },
                  contents: { 
                    type: 'array', 
                    items: { type: 'string' },
                    description: 'Observation contents / დაკვირვების შინაარსი'
                  }
                },
                required: ['entity_name', 'contents']
              }
            }
          },
          required: ['observations']
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
              default: 20
            }
          },
          required: ['query']
        }
      },
      {
        name: 'marathon_kb_read_graph',
        description: `${georgian['marathon_kb_read_graph']} - Read entire knowledge graph`,
        inputSchema: {
          type: 'object',
          properties: {
            include_relations: {
              type: 'boolean',
              description: 'Include relations in output / კავშირების ჩართვა',
              default: true
            },
            entity_type: {
              type: 'string',
              description: 'Filter by entity type / ენტითის ტიპით ფილტრაცია'
            },
            limit: {
              type: 'number',
              description: 'Maximum entities to return / მაქსიმალური ენტითები',
              default: 100
            }
          }
        }
      },
      {
        name: 'marathon_kb_delete_entities',
        description: `${georgian['marathon_kb_delete_entities']} - Delete entities from knowledge graph`,
        inputSchema: {
          type: 'object',
          properties: {
            entity_names: {
              type: 'array',
              items: { type: 'string' },
              description: 'Entity names to delete / წასაშლელი ენტითების სახელები'
            },
            cascade: {
              type: 'boolean',
              description: 'Delete related relations / დაკავშირებული კავშირების წაშლა',
              default: true
            }
          },
          required: ['entity_names']
        }
      },
      {
        name: 'marathon_kb_delete_relations',
        description: `${georgian['marathon_kb_delete_relations']} - Delete relations from knowledge graph`,
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
              description: 'Relations to delete / წასაშლელი კავშირები',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string' },
                  to: { type: 'string' },
                  type: { type: 'string' }
                },
                required: ['from', 'to', 'type']
              }
            }
          },
          required: ['relations']
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
        case 'marathon_kb_create_relations':
          result = await this.createRelations(args);
          break;
        case 'marathon_kb_add_observations':
          result = await this.addObservations(args);
          break;
        case 'marathon_kb_search_nodes':
          result = await this.searchNodes(args);
          break;
        case 'marathon_kb_read_graph':
          result = await this.readGraph(args);
          break;
        case 'marathon_kb_delete_entities':
          result = await this.deleteEntities(args);
          break;
        case 'marathon_kb_delete_relations':
          result = await this.deleteRelations(args);
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

  // Simple Memory Operations (Existing + Enhanced)
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
        timestamp: memoryEntry.timestamp
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ მეხსიერებაში შენახვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Memory save error`,
        key
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
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ მეხსიერებიდან ჩატვირთვის შეცდომა: ${error instanceof Error ? error.message : 'ვერ მოიძებნა'} / Memory load error: not found`,
        key
      };
    }
  }

  private async listMemories(args: any): Promise<any> {
    const { tags = [], limit = 50 } = args;
    
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
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ მეხსიერების სიის ჩატვირთვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Memory list error`
      };
    }
  }

  // Knowledge Graph Operations (Enhanced + New)
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
          observations: entityData.observations || [],
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        };
        
        const filePath = join(this.knowledgePath, 'entities', `${entity.id}.json`);
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
          observations_count: e.observations.length,
          created: e.created
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ენტითების შექმნის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Entity creation error`
      };
    }
  }

  // ✨ NEW: Create Relations
  private async createRelations(args: any): Promise<any> {
    const { relations } = args;
    
    try {
      const createdRelations: KnowledgeRelation[] = [];
      const errors: any[] = [];
      
      for (const relationData of relations) {
        try {
          // Check if entities exist
          const fromEntity = await this.findEntityByName(relationData.from);
          const toEntity = await this.findEntityByName(relationData.to);
          
          if (!fromEntity || !toEntity) {
            errors.push({
              relation: relationData,
              error: `Entity not found: ${!fromEntity ? relationData.from : relationData.to}`
            });
            continue;
          }
          
          const relation: KnowledgeRelation = {
            id: this.generateId(),
            from: relationData.from,
            to: relationData.to,
            type: relationData.type,
            properties: relationData.properties || {},
            created: new Date().toISOString()
          };
          
          const filePath = join(this.knowledgePath, 'relations', `${relation.id}.json`);
          await fs.writeFile(filePath, JSON.stringify(relation, null, 2), 'utf-8');
          
          createdRelations.push(relation);
        } catch (error) {
          errors.push({
            relation: relationData,
            error: error instanceof Error ? error.message : 'უცნობი შეცდომა'
          });
        }
      }
      
      return {
        status: 'success',
        message: `✅ ${createdRelations.length} კავშირი შეიქმნა / ${createdRelations.length} relations created`,
        relations: createdRelations.map(r => ({
          id: r.id,
          from: r.from,
          to: r.to,
          type: r.type,
          created: r.created
        })),
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კავშირების შექმნის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Relations creation error`
      };
    }
  }

  // ✨ NEW: Add Observations
  private async addObservations(args: any): Promise<any> {
    const { observations } = args;
    
    try {
      const results: any[] = [];
      const errors: any[] = [];
      
      for (const observationData of observations) {
        try {
          const entity = await this.findEntityByName(observationData.entity_name);
          
          if (!entity) {
            errors.push({
              entity_name: observationData.entity_name,
              error: 'Entity not found'
            });
            continue;
          }
          
          // Add new observations
          entity.observations.push(...observationData.contents);
          entity.updated = new Date().toISOString();
          
          // Save updated entity
          const filePath = join(this.knowledgePath, 'entities', `${entity.id}.json`);
          await fs.writeFile(filePath, JSON.stringify(entity, null, 2), 'utf-8');
          
          results.push({
            entity_name: observationData.entity_name,
            observations_added: observationData.contents.length,
            total_observations: entity.observations.length
          });
        } catch (error) {
          errors.push({
            entity_name: observationData.entity_name,
            error: error instanceof Error ? error.message : 'უცნობი შეცდომა'
          });
        }
      }
      
      return {
        status: 'success',
        message: `✅ დაკვირვებები დაემატა ${results.length} ენტითს / Observations added to ${results.length} entities`,
        results,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ დაკვირვებების დამატების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Observations addition error`
      };
    }
  }

  private async searchNodes(args: any): Promise<any> {
    const { query, entity_type, limit = 20 } = args;
    
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
          timestamp: new Date().toISOString()
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
            
            // Simple search in name, type, and observations
            const searchLower = query.toLowerCase();
            const nameMatch = entity.name.toLowerCase().includes(searchLower);
            const typeMatch = entity.type.toLowerCase().includes(searchLower);
            const observationMatch = entity.observations.some(obs => 
              obs.toLowerCase().includes(searchLower)
            );
            const entityTypeMatch = !entity_type || entity.type === entity_type;
            
            if ((nameMatch || typeMatch || observationMatch) && entityTypeMatch) {
              foundEntities.push({
                id: entity.id,
                name: entity.name,
                type: entity.type,
                observations_count: entity.observations.length,
                created: entity.created,
                match_reason: nameMatch ? 'name' : typeMatch ? 'type' : 'observation'
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
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ნოუდების ძიების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Node search error`,
        query
      };
    }
  }

  // ✨ NEW: Read Graph
  private async readGraph(args: any): Promise<any> {
    const { include_relations = true, entity_type, limit = 100 } = args;
    
    try {
      const entitiesDir = join(this.knowledgePath, 'entities');
      const relationsDir = join(this.knowledgePath, 'relations');
      
      // Read entities
      let entities: any[] = [];
      try {
        const entityFiles = await fs.readdir(entitiesDir);
        
        for (const file of entityFiles) {
          if (file.endsWith('.json') && entities.length < limit) {
            try {
              const filePath = join(entitiesDir, file);
              const content = await fs.readFile(filePath, 'utf-8');
              const entity: KnowledgeEntity = JSON.parse(content);
              
              if (!entity_type || entity.type === entity_type) {
                entities.push({
                  id: entity.id,
                  name: entity.name,
                  type: entity.type,
                  properties: entity.properties,
                  observations_count: entity.observations.length,
                  created: entity.created,
                  updated: entity.updated
                });
              }
            } catch {
              // Skip invalid files
            }
          }
        }
      } catch {
        // No entities directory
      }
      
      // Read relations if requested
      let relations: any[] = [];
      if (include_relations) {
        try {
          const relationFiles = await fs.readdir(relationsDir);
          
          for (const file of relationFiles) {
            if (file.endsWith('.json')) {
              try {
                const filePath = join(relationsDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const relation: KnowledgeRelation = JSON.parse(content);
                
                relations.push({
                  id: relation.id,
                  from: relation.from,
                  to: relation.to,
                  type: relation.type,
                  properties: relation.properties,
                  created: relation.created
                });
              } catch {
                // Skip invalid files
              }
            }
          }
        } catch {
          // No relations directory
        }
      }
      
      return {
        status: 'success',
        message: `📊 ცოდნის გრაფი წაიკითხა / Knowledge graph read`,
        graph: {
          entities,
          relations: include_relations ? relations : undefined,
          entity_count: entities.length,
          relation_count: relations.length
        },
        filters: {
          entity_type,
          include_relations,
          limit
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ გრაფის წაკითხვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Graph reading error`
      };
    }
  }

  // ✨ NEW: Delete Entities
  private async deleteEntities(args: any): Promise<any> {
    const { entity_names, cascade = true } = args;
    
    try {
      const deletedEntities: string[] = [];
      const deletedRelations: string[] = [];
      const errors: any[] = [];
      
      for (const entityName of entity_names) {
        try {
          const entity = await this.findEntityByName(entityName);
          
          if (!entity) {
            errors.push({
              entity_name: entityName,
              error: 'Entity not found'
            });
            continue;
          }
          
          // Delete entity file
          const entityPath = join(this.knowledgePath, 'entities', `${entity.id}.json`);
          await fs.unlink(entityPath);
          deletedEntities.push(entityName);
          
          // Delete related relations if cascade is true
          if (cascade) {
            const relationsToDelete = await this.findRelationsByEntity(entityName);
            for (const relation of relationsToDelete) {
              const relationPath = join(this.knowledgePath, 'relations', `${relation.id}.json`);
              await fs.unlink(relationPath);
              deletedRelations.push(`${relation.from} -> ${relation.to} (${relation.type})`);
            }
          }
        } catch (error) {
          errors.push({
            entity_name: entityName,
            error: error instanceof Error ? error.message : 'უცნობი შეცდომა'
          });
        }
      }
      
      return {
        status: 'success',
        message: `✅ ${deletedEntities.length} ენტითი წაიშალა / ${deletedEntities.length} entities deleted`,
        deleted_entities: deletedEntities,
        deleted_relations: cascade ? deletedRelations : undefined,
        errors: errors.length > 0 ? errors : undefined,
        cascade,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ენტითების წაშლის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Entity deletion error`
      };
    }
  }

  // ✨ NEW: Delete Relations
  private async deleteRelations(args: any): Promise<any> {
    const { relations } = args;
    
    try {
      const deletedRelations: string[] = [];
      const errors: any[] = [];
      
      for (const relationData of relations) {
        try {
          const relation = await this.findRelation(relationData.from, relationData.to, relationData.type);
          
          if (!relation) {
            errors.push({
              relation: relationData,
              error: 'Relation not found'
            });
            continue;
          }
          
          // Delete relation file
          const relationPath = join(this.knowledgePath, 'relations', `${relation.id}.json`);
          await fs.unlink(relationPath);
          deletedRelations.push(`${relationData.from} -> ${relationData.to} (${relationData.type})`);
        } catch (error) {
          errors.push({
            relation: relationData,
            error: error instanceof Error ? error.message : 'უცნობი შეცდომა'
          });
        }
      }
      
      return {
        status: 'success',
        message: `✅ ${deletedRelations.length} კავშირი წაიშალა / ${deletedRelations.length} relations deleted`,
        deleted_relations: deletedRelations,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კავშირების წაშლის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Relations deletion error`
      };
    }
  }

  // Helper methods
  private async findEntityByName(name: string): Promise<KnowledgeEntity | null> {
    try {
      const entitiesDir = join(this.knowledgePath, 'entities');
      const files = await fs.readdir(entitiesDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = join(entitiesDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const entity: KnowledgeEntity = JSON.parse(content);
          
          if (entity.name === name) {
            return entity;
          }
        }
      }
    } catch {
      // Directory doesn't exist or error reading
    }
    
    return null;
  }

  private async findRelationsByEntity(entityName: string): Promise<KnowledgeRelation[]> {
    const relations: KnowledgeRelation[] = [];
    
    try {
      const relationsDir = join(this.knowledgePath, 'relations');
      const files = await fs.readdir(relationsDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = join(relationsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const relation: KnowledgeRelation = JSON.parse(content);
          
          if (relation.from === entityName || relation.to === entityName) {
            relations.push(relation);
          }
        }
      }
    } catch {
      // Directory doesn't exist or error reading
    }
    
    return relations;
  }

  private async findRelation(from: string, to: string, type: string): Promise<KnowledgeRelation | null> {
    try {
      const relationsDir = join(this.knowledgePath, 'relations');
      const files = await fs.readdir(relationsDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = join(relationsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const relation: KnowledgeRelation = JSON.parse(content);
          
          if (relation.from === from && relation.to === to && relation.type === type) {
            return relation;
          }
        }
      }
    } catch {
      // Directory doesn't exist or error reading
    }
    
    return null;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
