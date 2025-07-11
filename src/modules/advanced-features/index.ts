/**
 * 🚀 Advanced Features Module v1.0.0 Enhanced
 * გაფართოებული ფუნქციების მოდული
 * 
 * 🎉 FULLY ACTIVATED - All features enabled!
 * 🎉 სრულად გააქტიურებული - ყველა ფუნქცია ჩართულია!
 * 
 * Symbol Commands:
 * - --- : Session Reset / სესიის განულება
 * - +++ : Marathon Mode / მარათონ რეჟიმი  
 * - ... : Continue Task / ამოცანის გაგრძელება
 * - *** : Emergency Save / გადაუდებელი შენახვა
 * - ### : Deep Analysis / ღრმა ანალიზი
 * - @@@ : Expert Mode / ექსპერტული რეჟიმი
 * 
 * Marathon Mode:
 * - Auto-save functionality / ავტომატური შენახვა
 * - Session recovery / სესიის აღდგენა
 * - Project tracking / პროექტის ტრექინგი
 * 
 * Analytics:
 * - Usage tracking / გამოყენების ტრექინგი
 * - Performance metrics / შესრულების მეტრიკები
 * - Function statistics / ფუნქციების სტატისტიკა
 */

import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';
import { join } from 'path';
import { homedir } from 'os';
import { promises as fs } from 'fs';

// Import enhanced modules
import { SymbolCommands } from './symbol-commands.js';
import { MarathonMode } from './marathon-mode.js';
import { SQLiteAdapter } from './sqlite-adapter.js';
import { BasicAnalytics } from './basic-analytics.js';

export class AdvancedFeaturesModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'advanced-features';
  
  // Enhanced feature handlers
  private symbolCommands: SymbolCommands;
  private marathonMode: MarathonMode;
  private sqliteAdapter: SQLiteAdapter;
  private analytics: BasicAnalytics;

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
    
    // Initialize enhanced features
    this.sqliteAdapter = new SQLiteAdapter();
    this.symbolCommands = new SymbolCommands(this.sqliteAdapter);
    this.marathonMode = new MarathonMode(this.sqliteAdapter, logger);
    this.analytics = new BasicAnalytics();
    
    this.initializeEnhancedFeatures();
  }

  private async initializeEnhancedFeatures(): Promise<void> {
    try {
      // Initialize SQLite if enabled
      if (this.config.isSQLiteEnabled()) {
        await this.sqliteAdapter.initialize();
        console.log('🚀 SQLite database initialized / SQLite ბაზა ინიციალიზებულია');
      }
      
      // Auto-activate Marathon Mode if configured
      if (this.config.isMarathonModeEnabled()) {
        // Don't auto-activate, let user decide
        console.log('🏃‍♂️ Marathon Mode ready / მარათონ რეჟიმი მზადაა');
      }
      
      console.log('✅ Enhanced features initialized / გაფართოებული ფუნქციები ინიციალიზებულია');
    } catch (error) {
      console.warn('⚠️ Enhanced features initialization warning:', error);
    }
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    const tools = [
      // Symbol Commands
      {
        name: 'marathon_symbol_command',
        description: `${georgian['marathon_symbol_command']} - Execute symbol commands (---, +++, ..., ***, ###, @@@)`,
        inputSchema: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              description: 'Symbol command to execute / შესასრულებელი სიმბოლური ბრძანება',
              enum: ['---', '+++', '...', '***', '###', '@@@']
            },
            context: {
              type: 'string',
              description: 'Optional context / არაუცილებელი კონტექსტი'
            }
          },
          required: ['symbol']
        }
      },
      
      // Marathon Mode
      {
        name: 'marathon_mode_activate',
        description: `${georgian['marathon_mode_activate']} - Activate Marathon Mode for long-term projects`,
        inputSchema: {
          type: 'object',
          properties: {
            project_name: {
              type: 'string',
              description: 'Project name / პროექტის დასახელება'
            },
            auto_save_interval: {
              type: 'number',
              description: 'Auto-save interval in minutes / ავტო-შენახვის ინტერვალი წუთებში',
              default: 2
            }
          }
        }
      },
      
      {
        name: 'marathon_mode_deactivate',
        description: `${georgian['marathon_mode_deactivate']} - Deactivate Marathon Mode`,
        inputSchema: {
          type: 'object',
          properties: {
            save_final_state: {
              type: 'boolean',
              description: 'Save final state before deactivation / დასაბოლოო მდგომარეობის შენახვა გამორთვამდე',
              default: true
            }
          }
        }
      },
      
      // Analytics
      {
        name: 'marathon_analytics_report',
        description: `${georgian['marathon_analytics_report']} - Get usage analytics report`,
        inputSchema: {
          type: 'object',
          properties: {
            period: {
              type: 'string',
              description: 'Time period / დროის პერიოდი',
              enum: ['today', 'week', 'month', 'all'],
              default: 'today'
            },
            detailed: {
              type: 'boolean',
              description: 'Include detailed metrics / დეტალური მეტრიკების ჩართვა',
              default: false
            }
          }
        }
      },
      
      // SQLite Status
      {
        name: 'marathon_sqlite_status',
        description: `${georgian['marathon_sqlite_status']} - Check SQLite database status`,
        inputSchema: {
          type: 'object',
          properties: {
            detailed: {
              type: 'boolean',
              description: 'Show detailed database info / დეტალური ბაზის ინფორმაცია',
              default: false
            }
          }
        }
      },
      
      // Auto Save
      {
        name: 'marathon_auto_save',
        description: `${georgian['marathon_auto_save']} - Trigger manual auto-save`,
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Save description / შენახვის აღწერა'
            },
            priority: {
              type: 'string',
              description: 'Save priority / შენახვის პრიორიტეტი',
              enum: ['low', 'normal', 'high', 'emergency'],
              default: 'normal'
            }
          }
        }
      }
    ];

    return tools;
  }

  public async handleTool(name: string, args: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      await this.logger.logFunctionCall(name, args, this.moduleName);
      this.analytics.track(name); // Track usage
      
      if (!this.config.isModuleEnabled('advanced_features')) {
        throw new Error('გაფართოებული ფუნქციების მოდული გამორთულია / Advanced features module is disabled');
      }
      
      let result;
      
      switch (name) {
        case 'marathon_symbol_command':
          result = await this.handleSymbolCommand(args);
          break;
        case 'marathon_mode_activate':
          result = await this.activateMarathonMode(args);
          break;
        case 'marathon_mode_deactivate':
          result = await this.deactivateMarathonMode(args);
          break;
        case 'marathon_analytics_report':
          result = await this.getAnalyticsReport(args);
          break;
        case 'marathon_sqlite_status':
          result = await this.getSQLiteStatus(args);
          break;
        case 'marathon_auto_save':
          result = await this.triggerAutoSave(args);
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

  // Symbol Commands Handler
  private async handleSymbolCommand(args: any): Promise<any> {
    const { symbol, context } = args;
    
    if (!this.config.isSymbolCommandsEnabled()) {
      return {
        status: 'disabled',
        message: '🚧 სიმბოლური ბრძანებები გამორთულია / Symbol commands are disabled',
        symbol,
        note: 'Enable in configuration / ჩართეთ კონფიგურაციაში'
      };
    }
    
    return await this.symbolCommands.process(symbol, context);
  }

  // Marathon Mode Handlers
  private async activateMarathonMode(args: any): Promise<any> {
    const { project_name, auto_save_interval = 2 } = args;
    
    if (!this.config.isMarathonModeEnabled()) {
      return {
        status: 'disabled',
        message: '🚧 მარათონ რეჟიმი გამორთულია / Marathon Mode is disabled',
        note: 'Enable in configuration / ჩართეთ კონფიგურაციაში'
      };
    }
    
    return await this.marathonMode.activate(project_name, auto_save_interval);
  }

  private async deactivateMarathonMode(args: any): Promise<any> {
    const { save_final_state = true } = args;
    return await this.marathonMode.deactivate(save_final_state);
  }

  // Analytics Handler
  private async getAnalyticsReport(args: any): Promise<any> {
    const { period = 'today', detailed = false } = args;
    
    if (!this.config.isAnalyticsEnabled()) {
      return {
        status: 'disabled',
        message: '🚧 ანალიტიკა გამორთულია / Analytics are disabled',
        note: 'Enable in configuration / ჩართეთ კონფიგურაციაში'
      };
    }
    
    return this.analytics.getReport(period, detailed);
  }

  // SQLite Status Handler
  private async getSQLiteStatus(args: any): Promise<any> {
    const { detailed = false } = args;
    
    if (!this.config.isSQLiteEnabled()) {
      return {
        status: 'disabled',
        message: '🚧 SQLite გამორთულია / SQLite is disabled',
        note: 'Enable in configuration / ჩართეთ კონფიგურაციაში'
      };
    }
    
    return await this.sqliteAdapter.getStatus(detailed);
  }

  // Auto Save Handler
  private async triggerAutoSave(args: any): Promise<any> {
    const { description, priority = 'normal' } = args;
    
    return await this.marathonMode.manualSave(description, priority);
  }

  // Get enhanced module status
  public getEnhancedStatus(): any {
    return {
      status: 'enhanced',
      edition: 'v1.0.0 Enhanced',
      features: {
        symbol_commands: {
          enabled: this.config.isSymbolCommandsEnabled(),
          available: ['---', '+++', '...', '***', '###', '@@@']
        },
        marathon_mode: {
          enabled: this.config.isMarathonModeEnabled(),
          active: this.marathonMode.isActive()
        },
        sqlite_memory: {
          enabled: this.config.isSQLiteEnabled(),
          status: 'ready'
        },
        analytics: {
          enabled: this.config.isAnalyticsEnabled(),
          tracked_events: this.analytics.getEventCount()
        }
      },
      batumi_signature: '🌊 ბათუმური ხელწერით - გაფართოებული ვერსია / Batumi style - Enhanced edition',
      activation_message: {
        georgian: '🚀 ყველა გაფართოებული ფუნქცია აქტიურია!',
        english: '🚀 All enhanced features are active!'
      }
    };
  }
}