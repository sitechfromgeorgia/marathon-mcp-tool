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
        case 'marathon_memory_export':
          return await this.memoryExport(args);
        case 'marathon_memory_import':
          return await this.memoryImport(args);
        case 'marathon_memory_update':
          return await this.memoryUpdate(args);
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
        text: `✅ შენახულია "${args.key}"\n` +
              `📊 მეხსიერების ზომა: ${result.memorySize} ჩანაწერი`
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
      `🏷️ ტეგები: ${memory.tags?.join(', ') || 'არ არის'}\n` +
      `📅 შენახულია: ${new Date(memory.createdAt).toLocaleString('ka-GE')}` : '';

    return {
      content: [{
        type: 'text',
        text: `📖 ჩატვირთულია "${args.key}":\n` +
              `\`\`\`json\n${memory.data}\n\`\`\`${metadata}`
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
      `[${new Date(m.createdAt).toLocaleDateString('ka-GE')}]`
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
      const preview = r.data.substring(0, 100).replace(/\n/g, ' ');
      return `• **${r.key}** (${r.score.toFixed(2)} score)\n  ${preview}${r.data.length > 100 ? '...' : ''}`;
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
              `📝 სულ ჩანაწერები: ${stats.totalEntries}\n` +
              `🗑️ წაშლილი: ${stats.deletedEntries}\n` +
              `📁 კატეგორიები: ${stats.categories.join(', ') || 'არ არის'}\n` +
              `🏷️ ტეგები: ${stats.topTags.map(t => `${t.tag} (${t.count})`).join(', ')}\n` +
              `💾 ბაზის ზომა: ${(stats.databaseSize / 1024 / 1024).toFixed(2)} MB`
      }]
    };
  }

  private async memoryExport(args: any) {
    const data = await this.memoryStore.export({
      format: args.format || 'json',
      category: args.category,
      includeDeleted: args.includeDeleted || false
    });

    return {
      content: [{
        type: 'text',
        text: `📤 მეხსიერება ექსპორტირებულია (${args.format || 'json'} ფორმატი):\n\n\`\`\`\n${data}\n\`\`\``
      }]
    };
  }

  private async memoryImport(args: any) {
    const result = await this.memoryStore.import(
      args.data,
      {
        format: args.format || 'json',
        overwrite: args.overwrite || false
      }
    );

    return {
      content: [{
        type: 'text',
        text: `📥 იმპორტი დასრულდა:\n` +
              `✅ იმპორტირებული: ${result.imported}\n` +
              `⏭️ გამოტოვებული: ${result.skipped}\n` +
              `❌ შეცდომები: ${result.errors}`
      }]
    };
  }

  private async memoryUpdate(args: any) {
    const result = await this.memoryStore.update(
      args.key,
      args.data,
      {
        merge: args.merge || false,
        tags: args.updateTags
      }
    );

    return {
      content: [{
        type: 'text',
        text: result.success ?
          `✅ "${args.key}" განახლდა` :
          `❌ "${args.key}" ვერ განახლდა`
      }]
    };
  }

  private async memoryCleanup(args: any) {
    const result = await this.memoryStore.cleanup({
      removeExpired: args.removeExpired !== false,
      removeDeleted: args.removeDeleted !== false,
      vacuum: args.vacuum || false
    });

    return {
      content: [{
        type: 'text',
        text: `🧹 გასუფთავება დასრულდა:\n` +
              `🗑️ წაშლილი ვადაგასული: ${result.expiredRemoved}\n` +
              `🗑️ წაშლილი მონიშნული: ${result.deletedRemoved}\n` +
              `💾 გათავისუფლებული სივრცე: ${(result.freedSpace / 1024).toFixed(2)} KB`
      }]
    };
  }

  // ============ KNOWLEDGE GRAPH OPERATIONS IMPLEMENTATION ============

  private async kbCreateEntities(args: any) {
    const results = await this.knowledgeGraph.createEntities(args.entities);
    
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
    const results = await this.knowledgeGraph.createRelations(args.relations);
    
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
    const results = await this.knowledgeGraph.addObservations(args.observations);
    
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
    const results = await this.knowledgeGraph.searchNodes(
      args.query,
      {
        entityTypes: args.entityTypes,
        limit: args.limit || 20
      }
    );

    if (!results.length) {
      return {
        content: [{
          type: 'text',
          text: `🔍 "${args.query}" - ენტითები ვერ მოიძებნა`
        }]
      };
    }

    const list = results.map(node => {
      const obs = node.observations?.length ? ` (${node.observations.length} დაკვირვება)` : '';
      return `• **${node.name}** [${node.entityType}]${obs}\n  ${node.description || 'აღწერა არ არის'}`;
    }).join('\n\n');

    return {
      content: [{
        type: 'text',
        text: `🔍 ნაპოვნი ენტითები "${args.query}" (${results.length}):\n\n${list}`
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
    const results = await this.knowledgeGraph.deleteEntities(args.entityNames);
    
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
        `  • ${r.relationType} → **${r.to}**`
      ).join('\n');
      response += '\n\n';
    }

    if (relations.incoming.length > 0) {
      response += `📥 შემომავალი კავშირები:\n`;
      response += relations.incoming.map(r => 
        `  • **${r.from}** → ${r.relationType}`
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
    const paths = await this.knowledgeGraph.findPath(
      args.from,
      args.to,
      {
        maxDepth: args.maxDepth || 5,
        relationTypes: args.relationTypes
      }
    );

    if (!paths.length) {
      return {
        content: [{
          type: 'text',
          text: `🛤️ "${args.from}" → "${args.to}" გზა ვერ მოიძებნა`
        }]
      };
    }

    const pathsViz = paths.map((path, i) => {
      const steps = path.map((step, j) => {
        if (j === 0) return `**${step.entity}**`;
        return `--[${step.relation}]--> **${step.entity}**`;
      }).join(' ');
      return `${i + 1}. ${steps} (სიგრძე: ${path.length - 1})`;
    }).join('\n');

    return {
      content: [{
        type: 'text',
        text: `🛤️ ნაპოვნი გზები "${args.from}" → "${args.to}":\n\n${pathsViz}`
      }]
    };
  }

  private async kbFindClusters(args: any) {
    const clusters = await this.knowledgeGraph.findClusters({
      minClusterSize: args.minClusterSize || 3,
      similarityThreshold: args.similarityThreshold || 0.7
    });

    if (!clusters.length) {
      return {
        content: [{
          type: 'text',
          text: '🎯 კლასტერები ვერ მოიძებნა'
        }]
      };
    }

    const clustersViz = clusters.map((cluster, i) => {
      const members = cluster.members.join(', ');
      return `${i + 1}. **კლასტერი ${cluster.id}** (${cluster.size} წევრი, ${cluster.density.toFixed(2)} სიმჭიდროვე)\n   წევრები: ${members}`;
    }).join('\n\n');

    return {
      content: [{
        type: 'text',
        text: `🎯 ნაპოვნი კლასტერები (${clusters.length}):\n\n${clustersViz}`
      }]
    };
  }

  private async kbMergeEntities(args: any) {
    const result = await this.knowledgeGraph.mergeEntities(
      args.sourceEntity,
      args.targetEntity,
      {
        mergeObservations: args.mergeObservations !== false,
        mergeRelations: args.mergeRelations !== false
      }
    );

    return {
      content: [{
        type: 'text',
        text: result.success ?
          `✅ "${args.sourceEntity}" გაერთიანდა "${args.targetEntity}"-თან\n` +
          `📊 გადატანილი: ${result.observationsMerged} დაკვირვება, ${result.relationsMerged} კავშირი` :
          `❌ გაერთიანება ვერ მოხერხდა: ${result.error}`
      }]
    };
  }

  private async kbExportGraph(args: any) {
    const data = await this.knowledgeGraph.exportGraph({
      format: args.format || 'json',
      includeObservations: args.includeObservations !== false,
      entityTypes: args.entityTypes
    });

    return {
      content: [{
        type: 'text',
        text: `📤 ცოდნის გრაფი ექსპორტირებულია (${args.format || 'json'}):\n\n\`\`\`\n${data}\n\`\`\``
      }]
    };
  }

  private async kbImportGraph(args: any) {
    const result = await this.knowledgeGraph.importGraph(
      args.data,
      {
        format: args.format || 'json',
        mergeMode: args.mergeMode || 'merge'
      }
    );

    return {
      content: [{
        type: 'text',
        text: `📥 გრაფის იმპორტი დასრულდა:\n` +
              `✅ ენტითები: ${result.entitiesImported}\n` +
              `✅ კავშირები: ${result.relationsImported}\n` +
              `✅ დაკვირვებები: ${result.observationsImported}\n` +
              `❌ შეცდომები: ${result.errors}`
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