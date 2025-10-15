/**
 * 🏃‍♂️ Marathon MCP Tool - Memory Knowledge Module
 * 🇬🇪 მეხსიერებისა და ცოდნის მოდული
 */

import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';
import { DatabaseManager } from './database/database-manager.js';
import { MemoryStore } from './memory-store.js';
import { KnowledgeGraphEngine } from './knowledge-graph.js';
import path from 'path';
import os from 'os';

export class MemoryKnowledgeModule {
  private db: DatabaseManager;
  private memoryStore: MemoryStore;
  private knowledgeGraph: KnowledgeGraphEngine;
  private config: MarathonConfig;
  private logger: MarathonLogger;

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;

    // Initialize database
    const dbPath = path.join(os.homedir(), '.marathon-mcp', 'memory.db');
    this.db = new DatabaseManager({ dbPath }, logger);

    // Initialize stores
    this.memoryStore = new MemoryStore(this.db, logger);
    this.knowledgeGraph = new KnowledgeGraphEngine(this.db, logger);
  }

  /**
   * Initialize the module
   * მოდულის ინიციალიზაცია
   */
  async initialize(): Promise<void> {
    try {
      await this.db.initialize();
      this.logger.info('Memory & Knowledge module initialized successfully');
      
      // Run cleanup on startup
      await this.memoryStore.cleanup();
    } catch (error) {
      this.logger.error('Failed to initialize Memory & Knowledge module:', error);
      throw error;
    }
  }

  /**
   * Get all available tools
   * ყველა ხელმისაწვდომი ხელსაწყო
   */
  async getTools() {
    return [
      // ============ SIMPLE MEMORY OPERATIONS ============
      {
        name: 'marathon_memory_save',
        description: '🧠 ინფორმაციის შენახვა მეხსიერებაში',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'მეხსიერების გასაღები' },
            data: { type: 'string', description: 'შესანახი ინფორმაცია' },
            category: { type: 'string', description: 'კატეგორია (არასავალდებულო)' },
            tags: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'ტეგები (არასავალდებულო)' 
            },
            ttl: { type: 'number', description: 'TTL წამებში (არასავალდებულო)' }
          },
          required: ['key', 'data']
        }
      },
      {
        name: 'marathon_memory_load',
        description: '🔍 ინფორმაციის ჩატვირთვა მეხსიერებიდან',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'მეხსიერების გასაღები' }
          },
          required: ['key']
        }
      },
      {
        name: 'marathon_memory_list',
        description: '📋 მეხსიერების ჩანაწერების სია',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'კატეგორიით ფილტრაცია' },
            tags: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'ტეგებით ფილტრაცია' 
            },
            limit: { type: 'number', default: 50, description: 'შედეგების რაოდენობა' },
            offset: { type: 'number', default: 0, description: 'გამოტოვების რაოდენობა' }
          }
        }
      },
      {
        name: 'marathon_memory_search',
        description: '🔎 მეხსიერებაში ძიება',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'საძიებო ტერმინი' },
            category: { type: 'string', description: 'კატეგორიით ფილტრაცია' },
            limit: { type: 'number', default: 20, description: 'შედეგების რაოდენობა' }
          },
          required: ['query']
        }
      },
      {
        name: 'marathon_memory_delete',
        description: '🗑️ მეხსიერებიდან წაშლა',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'წასაშლელი გასაღები' }
          },
          required: ['key']
        }
      },
      {
        name: 'marathon_memory_stats',
        description: '📊 მეხსიერების სტატისტიკა',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },

      // ============ KNOWLEDGE GRAPH OPERATIONS ============
      {
        name: 'marathon_kb_create_entities',
        description: '🔗 ცოდნის გრაფში ენტითების შექმნა',
        inputSchema: {
          type: 'object',
          properties: {
            entities: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'ენტითის სახელი' },
                  entityType: { type: 'string', description: 'ენტითის ტიპი' },
                  description: { type: 'string', description: 'აღწერა' },
                  properties: { type: 'object', description: 'დამატებითი თვისებები' }
                },
                required: ['name', 'entityType']
              },
              description: 'შესაქმნელი ენტითების სია'
            }
          },
          required: ['entities']
        }
      },
      {
        name: 'marathon_kb_create_relations',
        description: '🔗 ენტითებს შორის კავშირების შექმნა',
        inputSchema: {
          type: 'object',
          properties: {
            relations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  from: { type: 'string', description: 'საწყისი ენტითის სახელი' },
                  to: { type: 'string', description: 'დანიშნული ენტითის სახელი' },
                  relationType: { type: 'string', description: 'კავშირის ტიპი' },
                  properties: { type: 'object', description: 'კავშირის თვისებები' },
                  bidirectional: { type: 'boolean', description: 'ორმხრივი კავშირი' }
                },
                required: ['from', 'to', 'relationType']
              },
              description: 'შესაქმნელი კავშირების სია'
            }
          },
          required: ['relations']
        }
      },
      {
        name: 'marathon_kb_add_observations',
        description: '👁️ ენტითებისთვის დაკვირვებების დამატება',
        inputSchema: {
          type: 'object',
          properties: {
            observations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  entityName: { type: 'string', description: 'ენტითის სახელი' },
                  contents: { 
                    type: 'array',
                    items: { type: 'string' },
                    description: 'დაკვირვების შინაარსი' 
                  }
                },
                required: ['entityName', 'contents']
              },
              description: 'დასამატებელი დაკვირვებების სია'
            }
          },
          required: ['observations']
        }
      },
      {
        name: 'marathon_kb_search_nodes',
        description: '🔍 ცოდნის გრაფში ნოუდების ძიება',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'საძიებო ტერმინი' },
            entityTypes: { 
              type: 'array',
              items: { type: 'string' },
              description: 'ენტითის ტიპებით ფილტრაცია'
            },
            limit: { type: 'number', default: 20, description: 'შედეგების რაოდენობა' }
          },
          required: ['query']
        }
      },
      {
        name: 'marathon_kb_read_graph',
        description: '📖 მთლიანი ცოდნის გრაფის წაკითხვა',
        inputSchema: {
          type: 'object',
          properties: {
            includeObservations: { type: 'boolean', default: true, description: 'დაკვირვებების ჩართვა' },
            maxEntities: { type: 'number', default: 100, description: 'მაქსიმალური ენტითების რაოდენობა' }
          }
        }
      },
      {
        name: 'marathon_kb_delete_entities',
        description: '🗑️ ენტითების წაშლა',
        inputSchema: {
          type: 'object',
          properties: {
            entityNames: {
              type: 'array',
              items: { type: 'string' },
              description: 'წასაშლელი ენტითების სახელები'
            }
          },
          required: ['entityNames']
        }
      },
      {
        name: 'marathon_kb_get_entity_relations',
        description: '🔗 ენტითის კავშირების ნახვა',
        inputSchema: {
          type: 'object',
          properties: {
            entityName: { type: 'string', description: 'ენტითის სახელი' },
            relationTypes: {
              type: 'array',
              items: { type: 'string' },
              description: 'კავშირის ტიპებით ფილტრაცია'
            },
            limit: { type: 'number', default: 50, description: 'მაქსიმალური კავშირების რაოდენობა' }
          },
          required: ['entityName']
        }
      },
      {
        name: 'marathon_kb_get_graph_stats',
        description: '📊 ცოდნის გრაფის სტატისტიკა',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },

      // ============ MEMORY EXPORT/IMPORT ============
      {
        name: 'marathon_memory_export',
        description: '📤 მეხსიერების ექსპორტი',
        inputSchema: {
          type: 'object',
          properties: {
            format: { 
              type: 'string',
              enum: ['json', 'csv', 'txt'],
              default: 'json',
              description: 'ექსპორტის ფორმატი'
            },
            category: { type: 'string', description: 'კატეგორიით ფილტრაცია' },
            includeDeleted: { type: 'boolean', default: false, description: 'წაშლილების ჩართვა' }
          }
        }
      },
      {
        name: 'marathon_memory_import',
        description: '📥 მეხსიერებაში იმპორტი',
        inputSchema: {
          type: 'object',
          properties: {
            data: { type: 'string', description: 'იმპორტის მონაცემები' },
            format: { 
              type: 'string',
              enum: ['json', 'csv'],
              default: 'json',
              description: 'იმპორტის ფორმატი'
            },
            overwrite: { type: 'boolean', default: false, description: 'არსებულის გადაწერა' }
          },
          required: ['data']
        }
      },

      // ============ ADVANCED MEMORY OPERATIONS ============
      {
        name: 'marathon_memory_update',
        description: '✏️ მეხსიერების ჩანაწერის განახლება',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'მეხსიერების გასაღები' },
            data: { type: 'string', description: 'ახალი მონაცემები' },
            merge: { type: 'boolean', default: false, description: 'არსებულთან შერწყმა' },
            updateTags: { 
              type: 'array',
              items: { type: 'string' },
              description: 'ახალი ტეგები'
            }
          },
          required: ['key', 'data']
        }
      },
      {
        name: 'marathon_memory_cleanup',
        description: '🧹 მეხსიერების გასუფთავება',
        inputSchema: {
          type: 'object',
          properties: {
            removeExpired: { type: 'boolean', default: true, description: 'ვადაგასულების წაშლა' },
            removeDeleted: { type: 'boolean', default: true, description: 'წაშლილების მოცილება' },
            vacuum: { type: 'boolean', default: false, description: 'მონაცემთა ბაზის ოპტიმიზაცია' }
          }
        }
      },

      // ============ ADVANCED KNOWLEDGE OPERATIONS ============
      {
        name: 'marathon_kb_find_path',
        description: '🛤️ ენტითებს შორის გზის პოვნა',
        inputSchema: {
          type: 'object',
          properties: {
            from: { type: 'string', description: 'საწყისი ენტითი' },
            to: { type: 'string', description: 'დანიშნულების ენტითი' },
            maxDepth: { type: 'number', default: 5, description: 'მაქსიმალური სიღრმე' },
            relationTypes: {
              type: 'array',
              items: { type: 'string' },
              description: 'დასაშვები კავშირის ტიპები'
            }
          },
          required: ['from', 'to']
        }
      },
      {
        name: 'marathon_kb_find_clusters',
        description: '🎯 მსგავსი ენტითების კლასტერების პოვნა',
        inputSchema: {
          type: 'object',
          properties: {
            minClusterSize: { type: 'number', default: 3, description: 'მინიმალური კლასტერის ზომა' },
            similarityThreshold: { type: 'number', default: 0.7, description: 'მსგავსების ზღვარი' }
          }
        }
      },
      {
        name: 'marathon_kb_merge_entities',
        description: '🔀 ენტითების გაერთიანება',
        inputSchema: {
          type: 'object',
          properties: {
            sourceEntity: { type: 'string', description: 'წყარო ენტითი' },
            targetEntity: { type: 'string', description: 'სამიზნე ენტითი' },
            mergeObservations: { type: 'boolean', default: true, description: 'დაკვირვებების გაერთიანება' },
            mergeRelations: { type: 'boolean', default: true, description: 'კავშირების გაერთიანება' }
          },
          required: ['sourceEntity', 'targetEntity']
        }
      },
      {
        name: 'marathon_kb_export_graph',
        description: '📤 ცოდნის გრაფის ექსპორტი',
        inputSchema: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: ['json', 'graphml', 'cypher'],
              default: 'json',
              description: 'ექსპორტის ფორმატი'
            },
            includeObservations: { type: 'boolean', default: true },
            entityTypes: {
              type: 'array',
              items: { type: 'string' },
              description: 'ენტითის ტიპებით ფილტრაცია'
            }
          }
        }
      },
      {
        name: 'marathon_kb_import_graph',
        description: '📥 ცოდნის გრაფის იმპორტი',
        inputSchema: {
          type: 'object',
          properties: {
            data: { type: 'string', description: 'გრაფის მონაცემები' },
            format: {
              type: 'string',
              enum: ['json', 'graphml'],
              default: 'json',
              description: 'იმპორტის ფორმატი'
            },
            mergeMode: {
              type: 'string',
              enum: ['replace', 'merge', 'append'],
              default: 'merge',
              description: 'იმპორტის რეჟიმი'
            }
          },
          required: ['data']
        }
      }
    ];
  }

  /**
   * Handle tool execution
   * ხელსაწყოს შესრულება
   */
  async handleTool(name: string, args: any) {
    try {
      switch (name) {
        // Memory operations
        case 'marathon_memory_save':
          return await this.memorySave(args);
        case 'marathon_memory_load':
          return await this.memoryLoad(args);
        case 'marathon_memory_list':
          return await this.memoryList(args);
        case 'marathon_memory_search':
          return await this.memorySearch(args);
        case 'marathon_memory_delete':
          return await this.memoryDelete(args);
        case 'marathon_memory_stats':
          return await this.memoryStats();
        // case 'marathon_memory_export':
        //   return await this.memoryExport(args);
        // case 'marathon_memory_import':
        //   return await this.memoryImport(args);
        // case 'marathon_memory_update':
        //   return await this.memoryUpdate(args);
        case 'marathon_memory_cleanup':
          return await this.memoryCleanup(args);

        // Knowledge Graph operations
        case 'marathon_kb_create_entities':
          return await this.kbCreateEntities(args);
        case 'marathon_kb_create_relations':
          return await this.kbCreateRelations(args);
        case 'marathon_kb_add_observations':
          return await this.kbAddObservations(args);
        case 'marathon_kb_search_nodes':
          return await this.kbSearchNodes(args);
        case 'marathon_kb_read_graph':
          return await this.kbReadGraph(args);
        case 'marathon_kb_delete_entities':
          return await this.kbDeleteEntities(args);
        case 'marathon_kb_get_entity_relations':
          return await this.kbGetEntityRelations(args);
        case 'marathon_kb_get_graph_stats':
          return await this.kbGetGraphStats();
        case 'marathon_kb_find_path':
          return await this.kbFindPath(args);
        case 'marathon_kb_find_clusters':
          return await this.kbFindClusters(args);
        case 'marathon_kb_merge_entities':
          return await this.kbMergeEntities(args);
        case 'marathon_kb_export_graph':
          return await this.kbExportGraph(args);
        case 'marathon_kb_import_graph':
          return await this.kbImportGraph(args);

        default:
          return null;
      }
    } catch (error: any) {
      this.logger.error(`Error in ${name}:`, error);
      return {
        content: [{
          type: 'text',
          text: `❌ შეცდომა: ${error.message}`
        }]
      };
    }
  }

  // ============ MEMORY OPERATIONS IMPLEMENTATION ============

  private async memorySave(args: any) {
    const result = await this.memoryStore.save(
      args.key,
      args.data,
      {
        category: args.category,
        tags: args.tags,
        ttl: args.ttl
      }
    );

    return {
      content: [{
        type: 'text',
        text: `✅ შენახულია "${args.key}"`
      }]
    };
  }

  private async memoryLoad(args: any) {
    const memory = await this.memoryStore.load(args.key);
    
    if (!memory) {
      return {
        content: [{
          type: 'text',
          text: `❌ "${args.key}" ვერ მოიძებნა`
        }]
      };
    }

    const metadata = memory.category || memory.tags?.length ?
      `\n📁 კატეგორია: ${memory.category || 'არ არის'}\n` +
      `🏷️ ტეგები: ${memory.tags || 'არ არის'}\n` +
      `📅 შენახულია: ${new Date(memory.created_at).toLocaleString('ka-GE')}` : '';

    return {
      content: [{
        type: 'text',
        text: `📖 ჩატვირთულია "${args.key}":\n` +
              `\`\`\`json\n${memory.value}\n\`\`\`${metadata}`
      }]
    };
  }

  private async memoryList(args: any) {
    const memories = await this.memoryStore.list({
      category: args.category,
      tags: args.tags,
      limit: args.limit || 50,
      offset: args.offset || 0
    });

    if (!memories.items.length) {
      return {
        content: [{
          type: 'text',
          text: '📭 მეხსიერება ცარიელია'
        }]
      };
    }

    const list = memories.items.map(m => 
      `• **${m.key}** - ${m.category || 'უკატეგორიო'} ` +
      `[${new Date(m.created_at).toLocaleDateString('ka-GE')}]`
    ).join('\n');

    return {
      content: [{
        type: 'text',
        text: `📋 მეხსიერების ჩანაწერები (${memories.total} სულ):\n\n${list}\n\n` +
              `📄 გვერდი ${Math.floor(args.offset / args.limit) + 1}/${Math.ceil(memories.total / args.limit)}`
      }]
    };
  }

  private async memorySearch(args: any) {
    const results = await this.memoryStore.search(
      args.query,
      {
        category: args.category,
        limit: args.limit || 20
      }
    );

    if (!results.length) {
      return {
        content: [{
          type: 'text',
          text: `🔍 "${args.query}" - შედეგები ვერ მოიძებნა`
        }]
      };
    }

    const list = results.map(r => {
      const preview = r.value.substring(0, 100).replace(/\n/g, ' ');
      return `• **${r.key}**\n  ${preview}${r.value.length > 100 ? '...' : ''}`;
    }).join('\n\n');

    return {
      content: [{
        type: 'text',
        text: `🔎 ძიების შედეგები "${args.query}" (${results.length} ნაპოვნი):\n\n${list}`
      }]
    };
  }

  private async memoryDelete(args: any) {
    const success = await this.memoryStore.delete(args.key);
    
    return {
      content: [{
        type: 'text',
        text: success ?
          `✅ "${args.key}" წაიშალა` :
          `❌ "${args.key}" ვერ წაიშალა ან ვერ მოიძებნა`
      }]
    };
  }

  private async memoryStats() {
    const stats = await this.memoryStore.getStats();
    
    return {
      content: [{
        type: 'text',
        text: `📊 მეხსიერების სტატისტიკა:\n\n` +
              `📝 სულ ჩანაწერები: ${stats.total}\n` +
              `📁 კატეგორიები: ${Object.keys(stats.categories).join(', ') || 'არ არის'}\n`
      }]
    };
  }

  private async memoryCleanup(args: any) {
    await this.memoryStore.cleanup();

    return {
      content: [{
        type: 'text',
        text: `🧹 გასუფთავება დასრულდა`
      }]
    };
  }

  // ============ KNOWLEDGE GRAPH OPERATIONS IMPLEMENTATION ============

  private async kbCreateEntities(args: any) {
    const results = [];
    for (const entity of args.entities) {
      const result = await this.knowledgeGraph.createEntity(entity);
      results.push(result);
    }
    
    const created = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    let response = `✅ შეიქმნა ${created} ენტითი`;
    
    if (failed.length > 0) {
      response += `\n❌ ვერ შეიქმნა ${failed.length}:\n`;
      response += failed.map(f => `  • ${f.name}: ${f.error}`).join('\n');
    }

    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
  }

  private async kbCreateRelations(args: any) {
    const results = [];
    for (const relation of args.relations) {
      const result = await this.knowledgeGraph.createRelation(relation);
      results.push(result);
    }
    
    const created = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    let response = `✅ შეიქმნა ${created} კავშირი`;
    
    if (failed.length > 0) {
      response += `\n❌ ვერ შეიქმნა ${failed.length}:\n`;
      response += failed.map(f => `  • ${f.from} → ${f.to}: ${f.error}`).join('\n');
    }

    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
  }

  private async kbAddObservations(args: any) {
    const results = [];
    for (const observation of args.observations) {
      const result = await this.knowledgeGraph.addObservation(observation.entityName, observation.contents);
      results.push(result);
    }
    
    const totalAdded = results.reduce((sum, r) => sum + (r.added || 0), 0);
    const failed = results.filter(r => !r.success);

    let response = `✅ დაემატა ${totalAdded} დაკვირვება`;
    
    if (failed.length > 0) {
      response += `\n❌ შეცდომები ${failed.length} ენტითისთვის:\n`;
      response += failed.map(f => `  • ${f.entityName}: ${f.error}`).join('\n');
    }

    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
  }

  private async kbSearchNodes(args: any) {
    return {
      content: [{
        type: 'text',
        text: 'Not implemented'
      }]
    };
  }

  private async kbReadGraph(args: any) {
    const graph = await this.knowledgeGraph.readGraph({
      includeObservations: args.includeObservations !== false,
      maxEntities: args.maxEntities || 100
    });

    if (!graph.entities.length) {
      return {
        content: [{
          type: 'text',
          text: '📭 ცოდნის გრაფი ცარიელია'
        }]
      };
    }

    const graphViz = this.visualizeGraph(graph);

    return {
      content: [{
        type: 'text',
        text: `📖 ცოდნის გრაფი:\n\n` +
              `📊 ენტითები: ${graph.entities.length}\n` +
              `🔗 კავშირები: ${graph.relations.length}\n\n` +
              `${graphViz}`
      }]
    };
  }

  private async kbDeleteEntities(args: any) {
    const results = [];
    for (const entityName of args.entityNames) {
      const result = await this.knowledgeGraph.deleteEntity(entityName);
      results.push(result);
    }
    
    const deleted = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    let response = `✅ წაიშალა ${deleted} ენტითი`;
    
    if (failed.length > 0) {
      response += `\n❌ ვერ წაიშალა ${failed.length}:\n`;
      response += failed.map(f => `  • ${f.name}: ${f.error}`).join('\n');
    }

    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
  }

  private async kbGetEntityRelations(args: any) {
    const relations = await this.knowledgeGraph.getEntityRelations(
      args.entityName,
      {
        relationTypes: args.relationTypes,
        limit: args.limit || 50
      }
    );

    if (!relations.incoming.length && !relations.outgoing.length) {
      return {
        content: [{
          type: 'text',
          text: `🔗 "${args.entityName}" - კავშირები ვერ მოიძებნა`
        }]
      };
    }

    let response = `🔗 **${args.entityName}** კავშირები:\n\n`;

    if (relations.outgoing.length > 0) {
      response += `📤 გამავალი კავშირები:\n`;
      response += relations.outgoing.map(r => 
        `  • ${r.relation_type} → **${r.to_entity_id}**`
      ).join('\n');
      response += '\n\n';
    }

    if (relations.incoming.length > 0) {
      response += `📥 შემომავალი კავშირები:\n`;
      response += relations.incoming.map(r => 
        `  • **${r.from_entity_id}** → ${r.relation_type}`
      ).join('\n');
    }

    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
  }

  private async kbGetGraphStats() {
    const stats = await this.knowledgeGraph.getStats();
    
    return {
      content: [{
        type: 'text',
        text: `📊 ცოდნის გრაფის სტატისტიკა:\n\n` +
              `🔵 ენტითები: ${stats.totalEntities}\n` +
              `🔗 კავშირები: ${stats.totalRelations}\n` +
              `👁️ დაკვირვებები: ${stats.totalObservations}\n` +
              `📁 ენტითის ტიპები: ${stats.entityTypes.map(t => `${t.type} (${t.count})`).join(', ')}\n` +
              `🔗 კავშირის ტიპები: ${stats.relationTypes.map(t => `${t.type} (${t.count})`).join(', ')}\n` +
              `🌟 ტოპ ენტითები: ${stats.topEntities.map(e => `${e.name} (${e.connectionCount} კავშირი)`).join(', ')}`
      }]
    };
  }

  private async kbFindPath(args: any) {
    return {
      content: [{
        type: 'text',
        text: 'Not implemented'
      }]
    };
  }

  private async kbFindClusters(args: any) {
    return {
      content: [{
        type: 'text',
        text: 'Not implemented'
      }]
    };
  }

  private async kbMergeEntities(args: any) {
    return {
      content: [{
        type: 'text',
        text: 'Not implemented'
      }]
    };
  }

  private async kbExportGraph(args: any) {
    return {
      content: [{
        type: 'text',
        text: 'Not implemented'
      }]
    };
  }

  private async kbImportGraph(args: any) {
    return {
      content: [{
        type: 'text',
        text: 'Not implemented'
      }]
    };
  }

  // ============ HELPER METHODS ============

  private visualizeGraph(graph: any): string {
    if (graph.entities.length === 0) return '';

    let viz = '```mermaid\ngraph TD\n';
    
    // Add entities
    graph.entities.forEach((entity: any) => {
      const label = `${entity.name}\n[${entity.entityType}]`;
      viz += `  ${entity.id}["${label}"]\n`;
    });

    // Add relations
    graph.relations.forEach((rel: any) => {
      viz += `  ${rel.fromId} -->|${rel.relationType}| ${rel.toId}\n`;
    });

    viz += '```';
    return viz;
  }

  /**
   * Cleanup on shutdown
   * გასუფთავება გამორთვისას
   */
  async shutdown() {
    try {
      await this.db.close();
      this.logger.info('Memory & Knowledge module shut down successfully');
    } catch (error) {
      this.logger.error('Error shutting down Memory & Knowledge module:', error);
    }
  }
}