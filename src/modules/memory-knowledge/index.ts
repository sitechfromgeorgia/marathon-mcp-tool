/**
 * 🧠 Memory & Knowledge Management Module
 * მეხსიერება და ცოდნის მენეჯმენტის მოდული
 * 
 * Simple Memory:
 * - marathon_memory_save - ინფორმაციის შენახვა
 * - marathon_memory_load - ინფორმაციის ჩატვირთვა
 * - marathon_memory_list - მეხსიერების სია
 * 
 * Knowledge Graph:
 * - marathon_kb_create_entities - ენტითების შექმნა
 * - marathon_kb_create_relations - კავშირების შექმნა
 * - marathon_kb_add_observations - დაკვირვებების დამატება
 * - marathon_kb_search_nodes - ნოუდების ძიება
 * - marathon_kb_read_graph - მთლიანი გრაფის წაკითხვა
 * - marathon_kb_delete_entities - ენტითების წაშლა
 * - marathon_kb_delete_relations - კავშირების წაშლა
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

interface MemoryEntry {
  key: string;
  data: any;
  timestamp: string;
  tags?: string[];
}

interface KnowledgeEntity {
  name: string;
  type: string;
  observations: string[];
  relations: KnowledgeRelation[];
}

interface KnowledgeRelation {
  from: string;
  to: string;
  type: string;
  metadata?: any;
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
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    try {
      await fs.mkdir(this.memoryPath, { recursive: true });
      await fs.mkdir(this.knowledgePath, { recursive: true });
    } catch (error) {
      console.warn('⚠️ მეხსიერების ინიციალიზაციის შეცდომა:', error);
    }
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      // Simple Memory Operations
      {
        name: 'marathon_memory_save',
        description: `${georgian['marathon_memory_save']} - Save information to persistent memory`,
        inputSchema: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Memory key identifier'
            },
            data: {
              description: 'Data to save (any type)'
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Optional tags for categorization'
            }
          },
          required: ['key', 'data']
        }
      },
      {
        name: 'marathon_memory_load',
        description: `${georgian['marathon_memory_load']} - Load information from persistent memory`,
        inputSchema: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Memory key to load'
            }
          },
          required: ['key']
        }
      },
      {
        name: 'marathon_memory_list',
        description: `${georgian['marathon_memory_list']} - List all stored memory entries`,
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'object',
              properties: {
                tags: { type: 'array', items: { type: 'string' } },
                pattern: { type: 'string', description: 'Key pattern filter' },
                limit: { type: 'number', default: 50 }
              }
            }
          }
        }
      },
      
      // Knowledge Graph Operations
      {
        name: 'marathon_kb_create_entities',
        description: `${georgian['marathon_kb_create_entities']} - Create knowledge entities`,
        inputSchema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Entity name' },
                  type: { type: 'string', description: 'Entity type' },
                  observations: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Entity observations'
                  }
                },
                required: ['name', 'type', 'observations']
              }
            }
          },
          required: ['entities']
        }
      },
      {
        name: 'marathon_kb_create_relations',
        description: `${georgian['marathon_kb_create_relations']} - Create knowledge relations`,
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string', description: 'Source entity' },
                  to: { type: 'string', description: 'Target entity' },
                  type: { type: 'string', description: 'Relation type' },
                  metadata: { description: 'Optional metadata' }
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
              items: {
                type: 'object',
                properties: {
                  entity: { type: 'string', description: 'Entity name' },
                  content: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Observation content'
                  }
                },
                required: ['entity', 'content']
              }
            }
          },
          required: ['observations']
        }
      },
      {
        name: 'marathon_kb_search_nodes',
        description: `${georgian['marathon_kb_search_nodes']} - Search knowledge graph nodes`,
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query'
            },
            filters: {
              type: 'object',
              properties: {
                entity_type: { type: 'string' },
                relation_type: { type: 'string' },
                max_results: { type: 'number', default: 20 }
              }
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
              description: 'Include relations in output',
              default: true
            },
            format: {
              type: 'string',
              enum: ['json', 'graph', 'summary'],
              default: 'json'
            }
          }
        }
      },
      {
        name: 'marathon_kb_delete_entities',
        description: `${georgian['marathon_kb_delete_entities']} - Delete knowledge entities`,
        inputSchema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              items: { type: 'string' },
              description: 'Entity names to delete'
            }
          },
          required: ['entities']
        }
      },
      {
        name: 'marathon_kb_delete_relations',
        description: `${georgian['marathon_kb_delete_relations']} - Delete knowledge relations`,
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
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
        throw new Error('მეხსიერება და ცოდნის მოდული გამორთულია');
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
          result = await this.listMemory(args);
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

  // Simple Memory Operations
  private async saveMemory(args: any): Promise<any> {
    const { key, data, tags = [] } = args;
    
    try {
      const entry: MemoryEntry = {
        key,
        data,
        timestamp: new Date().toISOString(),
        tags
      };
      
      const filePath = join(this.memoryPath, `${key}.json`);
      await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8');
      
      return {
        status: 'success',
        message: `✅ მეხსიერებაში შენახულია: ${key}`,
        key,
        data_size: JSON.stringify(data).length,
        tags_count: tags.length,
        timestamp: entry.timestamp
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ მეხსიერების შენახვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        key
      };
    }
  }

  private async loadMemory(args: any): Promise<any> {
    const { key } = args;
    
    try {
      const filePath = join(this.memoryPath, `${key}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      const entry: MemoryEntry = JSON.parse(content);
      
      return {
        status: 'success',
        message: `✅ მეხსიერებიდან ჩატვირთულია: ${key}`,
        key,
        data: entry.data,
        tags: entry.tags,
        saved_at: entry.timestamp,
        loaded_at: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ მეხსიერების ჩატვირთვის შეცდომა: ${error instanceof Error ? error.message : 'ფაილი ვერ მოიძებნა'}`,
        key
      };
    }
  }

  private async listMemory(args: any): Promise<any> {
    const { filter = {} } = args;
    
    try {
      const files = await fs.readdir(this.memoryPath);
      const entries: MemoryEntry[] = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const content = await fs.readFile(join(this.memoryPath, file), 'utf-8');
            const entry: MemoryEntry = JSON.parse(content);
            entries.push(entry);
          } catch {
            continue;
          }
        }
      }
      
      let filteredEntries = entries;
      
      if (filter.tags) {
        filteredEntries = filteredEntries.filter(entry => 
          filter.tags.some((tag: string) => entry.tags?.includes(tag))
        );
      }
      
      if (filter.pattern) {
        filteredEntries = filteredEntries.filter(entry => 
          entry.key.includes(filter.pattern)
        );
      }
      
      if (filter.limit) {
        filteredEntries = filteredEntries.slice(0, filter.limit);
      }
      
      return {
        status: 'success',
        message: `💾 მეხსიერების სია: ${filteredEntries.length} ჩანაწერი`,
        total_entries: entries.length,
        filtered_entries: filteredEntries.length,
        entries: filteredEntries.map(entry => ({
          key: entry.key,
          tags: entry.tags,
          timestamp: entry.timestamp,
          data_preview: JSON.stringify(entry.data).slice(0, 100) + '...'
        })),
        filter_applied: filter
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ მეხსიერების სიის ჩატვირთვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`
      };
    }
  }

  // Knowledge Graph Operations
  private async createEntities(args: any): Promise<any> {
    const { entities } = args;
    
    try {
      const graphPath = join(this.knowledgePath, 'graph.json');
      let graph: { entities: KnowledgeEntity[], relations: KnowledgeRelation[] } = {
        entities: [],
        relations: []
      };
      
      try {
        const content = await fs.readFile(graphPath, 'utf-8');
        graph = JSON.parse(content);
      } catch {
        // New graph file
      }
      
      const created = [];
      
      for (const entity of entities) {
        const existingIndex = graph.entities.findIndex(e => e.name === entity.name);
        
        if (existingIndex >= 0) {
          // Update existing entity
          graph.entities[existingIndex].observations.push(...entity.observations);
          created.push({ name: entity.name, action: 'updated' });
        } else {
          // Create new entity
          graph.entities.push({
            name: entity.name,
            type: entity.type,
            observations: entity.observations,
            relations: []
          });
          created.push({ name: entity.name, action: 'created' });
        }
      }
      
      await fs.writeFile(graphPath, JSON.stringify(graph, null, 2), 'utf-8');
      
      return {
        status: 'success',
        message: `✅ ცოდნის გრაფში შექმნილია ${created.length} ენტითი`,
        entities_processed: created,
        total_entities: graph.entities.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ენტითების შექმნის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        entities_attempted: entities.length
      };
    }
  }

  private async createRelations(args: any): Promise<any> {
    const { relations } = args;
    
    try {
      const graphPath = join(this.knowledgePath, 'graph.json');
      let graph: { entities: KnowledgeEntity[], relations: KnowledgeRelation[] } = {
        entities: [],
        relations: []
      };
      
      try {
        const content = await fs.readFile(graphPath, 'utf-8');
        graph = JSON.parse(content);
      } catch {
        return {
          status: 'error',
          message: '❌ ცოდნის გრაფი ვერ მოიძებნა - ჯერ შექმენით ენტითები'
        };
      }
      
      const created = [];
      
      for (const relation of relations) {
        const fromExists = graph.entities.some(e => e.name === relation.from);
        const toExists = graph.entities.some(e => e.name === relation.to);
        
        if (!fromExists || !toExists) {
          created.push({ 
            relation: `${relation.from} → ${relation.to}`, 
            action: 'skipped', 
            reason: 'entity not found' 
          });
          continue;
        }
        
        const existingRelation = graph.relations.find(r => 
          r.from === relation.from && r.to === relation.to && r.type === relation.type
        );
        
        if (!existingRelation) {
          graph.relations.push({
            from: relation.from,
            to: relation.to,
            type: relation.type,
            metadata: relation.metadata
          });
          created.push({ 
            relation: `${relation.from} → ${relation.to}`, 
            action: 'created' 
          });
        } else {
          created.push({ 
            relation: `${relation.from} → ${relation.to}`, 
            action: 'exists' 
          });
        }
      }
      
      await fs.writeFile(graphPath, JSON.stringify(graph, null, 2), 'utf-8');
      
      return {
        status: 'success',
        message: `✅ ცოდნის გრაფში შექმნილია ${created.filter(r => r.action === 'created').length} კავშირი`,
        relations_processed: created,
        total_relations: graph.relations.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კავშირების შექმნის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        relations_attempted: relations.length
      };
    }
  }

  private async addObservations(args: any): Promise<any> {
    const { observations } = args;
    
    try {
      const graphPath = join(this.knowledgePath, 'graph.json');
      let graph: { entities: KnowledgeEntity[], relations: KnowledgeRelation[] } = {
        entities: [],
        relations: []
      };
      
      try {
        const content = await fs.readFile(graphPath, 'utf-8');
        graph = JSON.parse(content);
      } catch {
        return {
          status: 'error',
          message: '❌ ცოდნის გრაფი ვერ მოიძებნა'
        };
      }
      
      const added = [];
      
      for (const obs of observations) {
        const entityIndex = graph.entities.findIndex(e => e.name === obs.entity);
        
        if (entityIndex >= 0) {
          graph.entities[entityIndex].observations.push(...obs.content);
          added.push({ 
            entity: obs.entity, 
            observations_added: obs.content.length 
          });
        } else {
          added.push({ 
            entity: obs.entity, 
            observations_added: 0, 
            error: 'entity not found' 
          });
        }
      }
      
      await fs.writeFile(graphPath, JSON.stringify(graph, null, 2), 'utf-8');
      
      return {
        status: 'success',
        message: `✅ დაკვირვებები დამატებულია ${added.length} ენტითში`,
        observations_added: added,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ დაკვირვებების დამატების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`
      };
    }
  }

  private async searchNodes(args: any): Promise<any> {
    const { query, filters = {} } = args;
    
    try {
      const graphPath = join(this.knowledgePath, 'graph.json');
      const content = await fs.readFile(graphPath, 'utf-8');
      const graph: { entities: KnowledgeEntity[], relations: KnowledgeRelation[] } = JSON.parse(content);
      
      let results = graph.entities.filter(entity => {
        const nameMatch = entity.name.toLowerCase().includes(query.toLowerCase());
        const typeMatch = entity.type.toLowerCase().includes(query.toLowerCase());
        const observationMatch = entity.observations.some(obs => 
          obs.toLowerCase().includes(query.toLowerCase())
        );
        
        return nameMatch || typeMatch || observationMatch;
      });
      
      if (filters.entity_type) {
        results = results.filter(entity => entity.type === filters.entity_type);
      }
      
      if (filters.max_results) {
        results = results.slice(0, filters.max_results);
      }
      
      const enrichedResults = results.map(entity => {
        const relatedRelations = graph.relations.filter(r => 
          r.from === entity.name || r.to === entity.name
        );
        
        return {
          ...entity,
          related_entities: relatedRelations.map(r => ({
            entity: r.from === entity.name ? r.to : r.from,
            relation_type: r.type,
            direction: r.from === entity.name ? 'outgoing' : 'incoming'
          }))
        };
      });
      
      return {
        status: 'success',
        message: `🔍 ძიების შედეგები: ${results.length} ენტითი მოიძებნა`,
        query,
        results: enrichedResults,
        total_found: results.length,
        filters_applied: filters,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ძიების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        query
      };
    }
  }

  private async readGraph(args: any): Promise<any> {
    const { include_relations = true, format = 'json' } = args;
    
    try {
      const graphPath = join(this.knowledgePath, 'graph.json');
      const content = await fs.readFile(graphPath, 'utf-8');
      const graph: { entities: KnowledgeEntity[], relations: KnowledgeRelation[] } = JSON.parse(content);
      
      let result: any = {
        entities: graph.entities,
        total_entities: graph.entities.length,
        total_relations: graph.relations.length
      };
      
      if (include_relations) {
        result.relations = graph.relations;
      }
      
      if (format === 'summary') {
        const entityTypes = [...new Set(graph.entities.map(e => e.type))];
        const relationTypes = [...new Set(graph.relations.map(r => r.type))];
        
        result = {
          summary: {
            total_entities: graph.entities.length,
            total_relations: graph.relations.length,
            entity_types: entityTypes,
            relation_types: relationTypes,
            entities_by_type: entityTypes.map(type => ({
              type,
              count: graph.entities.filter(e => e.type === type).length
            }))
          }
        };
      }
      
      return {
        status: 'success',
        message: `📊 ცოდნის გრაფი: ${graph.entities.length} ენტითი, ${graph.relations.length} კავშირი`,
        format,
        include_relations,
        graph: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ცოდნის გრაფის წაკითხვის შეცდომა: ${error instanceof Error ? error.message : 'ფაილი ვერ მოიძებნა'}`
      };
    }
  }

  private async deleteEntities(args: any): Promise<any> {
    const { entities } = args;
    
    try {
      const graphPath = join(this.knowledgePath, 'graph.json');
      const content = await fs.readFile(graphPath, 'utf-8');
      const graph: { entities: KnowledgeEntity[], relations: KnowledgeRelation[] } = JSON.parse(content);
      
      const deleted = [];
      
      for (const entityName of entities) {
        const entityIndex = graph.entities.findIndex(e => e.name === entityName);
        
        if (entityIndex >= 0) {
          graph.entities.splice(entityIndex, 1);
          
          // Remove related relations
          const relationsToRemove = graph.relations.filter(r => 
            r.from === entityName || r.to === entityName
          );
          
          graph.relations = graph.relations.filter(r => 
            r.from !== entityName && r.to !== entityName
          );
          
          deleted.push({ 
            entity: entityName, 
            action: 'deleted',
            relations_removed: relationsToRemove.length
          });
        } else {
          deleted.push({ 
            entity: entityName, 
            action: 'not_found' 
          });
        }
      }
      
      await fs.writeFile(graphPath, JSON.stringify(graph, null, 2), 'utf-8');
      
      return {
        status: 'success',
        message: `✅ ${deleted.filter(d => d.action === 'deleted').length} ენტითი წაშლილია`,
        entities_processed: deleted,
        remaining_entities: graph.entities.length,
        remaining_relations: graph.relations.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ენტითების წაშლის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        entities_attempted: entities.length
      };
    }
  }

  private async deleteRelations(args: any): Promise<any> {
    const { relations } = args;
    
    try {
      const graphPath = join(this.knowledgePath, 'graph.json');
      const content = await fs.readFile(graphPath, 'utf-8');
      const graph: { entities: KnowledgeEntity[], relations: KnowledgeRelation[] } = JSON.parse(content);
      
      const deleted = [];
      
      for (const relation of relations) {
        const relationIndex = graph.relations.findIndex(r => 
          r.from === relation.from && r.to === relation.to && r.type === relation.type
        );
        
        if (relationIndex >= 0) {
          graph.relations.splice(relationIndex, 1);
          deleted.push({ 
            relation: `${relation.from} → ${relation.to}`, 
            action: 'deleted' 
          });
        } else {
          deleted.push({ 
            relation: `${relation.from} → ${relation.to}`, 
            action: 'not_found' 
          });
        }
      }
      
      await fs.writeFile(graphPath, JSON.stringify(graph, null, 2), 'utf-8');
      
      return {
        status: 'success',
        message: `✅ ${deleted.filter(d => d.action === 'deleted').length} კავშირი წაშლილია`,
        relations_processed: deleted,
        remaining_relations: graph.relations.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კავშირების წაშლის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        relations_attempted: relations.length
      };
    }
  }
}