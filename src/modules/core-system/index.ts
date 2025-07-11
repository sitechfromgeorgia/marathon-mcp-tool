/**
 * 🔧 Core System Module v1.0.0
 * ძირითადი სისტემის მოდული
 * 
 * 🚧 Development Phase - Basic core functionality
 * 🚧 განვითარების ფაზა - ძირითადი ბირთვული ფუნქციონალი
 * 
 * ფუნქციები / Functions:
 * - marathon_test_connection - კავშირის ტესტირება / Connection testing
 * - marathon_get_config - კონფიგურაციის ნახვა / View configuration
 * - marathon_set_config - კონფიგურაციის ცვლილება / Change configuration
 * - marathon_module_toggle - მოდულების ჩართვა/გამორთვა / Toggle modules
 * - marathon_get_status - სისტემის სტატუსი / System status
 * - marathon_language_switch - ენის ცვლილება / Language switch
 */

import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

export class CoreSystemModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'core-system';

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      {
        name: 'marathon_test_connection',
        description: `${georgian['marathon_test_connection']} - Tests Marathon MCP Tool connection and system status`,
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Test message (optional) / ტესტ მესიჯი (არასავალდებულო)',
              default: 'Hello Marathon!'
            }
          }
        }
      },
      {
        name: 'marathon_get_config',
        description: `${georgian['marathon_get_config']} - Get current Marathon configuration`,
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              description: 'Specific config section (optional) / კონკრეტული კონფიგურაციის სექცია',
              enum: ['modules', 'ui_preferences', 'security', 'development', 'all']
            }
          }
        }
      },
      {
        name: 'marathon_set_config',
        description: `${georgian['marathon_set_config']} - Update Marathon configuration`,
        inputSchema: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Configuration key (dot notation supported) / კონფიგურაციის გასაღები'
            },
            value: {
              description: 'New value for the configuration key / ახალი მნიშვნელობა'
            }
          },
          required: ['key', 'value']
        }
      },
      {
        name: 'marathon_module_toggle',
        description: `${georgian['marathon_module_toggle']} - Enable/disable modules`,
        inputSchema: {
          type: 'object',
          properties: {
            module: {
              type: 'string',
              description: 'Module name / მოდულის სახელი',
              enum: ['core_system', 'file_system', 'git_repository', 'memory_knowledge', 'system_process', 'documentation', 'advanced_features']
            },
            enabled: {
              type: 'boolean',
              description: 'Enable or disable the module / მოდულის ჩართვა ან გამორთვა'
            }
          },
          required: ['module']
        }
      },
      {
        name: 'marathon_get_status',
        description: `${georgian['marathon_get_status']} - Get system status and statistics`,
        inputSchema: {
          type: 'object',
          properties: {
            detailed: {
              type: 'boolean',
              description: 'Include detailed statistics / დეტალური სტატისტიკის ჩართვა',
              default: false
            }
          }
        }
      },
      {
        name: 'marathon_language_switch',
        description: `${georgian['marathon_language_switch']} - Switch interface language`,
        inputSchema: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              description: 'Target language / სამიზნე ენა',
              enum: ['georgian', 'english']
            }
          },
          required: ['language']
        }
      }
    ];
  }

  public async handleTool(name: string, args: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      await this.logger.logFunctionCall(name, args, this.moduleName);
      
      let result;
      
      switch (name) {
        case 'marathon_test_connection':
          result = await this.testConnection(args);
          break;
        case 'marathon_get_config':
          result = await this.getConfig(args);
          break;
        case 'marathon_set_config':
          result = await this.setConfig(args);
          break;
        case 'marathon_module_toggle':
          result = await this.toggleModule(args);
          break;
        case 'marathon_get_status':
          result = await this.getStatus(args);
          break;
        case 'marathon_language_switch':
          result = await this.switchLanguage(args);
          break;
        default:
          return null; // Tool not handled by this module
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

  private async testConnection(args: any): Promise<any> {
    const message = args.message || 'Hello Marathon!';
    
    const systemInfo = this.config.getSystemInfo();
    const logStats = await this.logger.getStats();
    
    return {
      status: 'success',
      message: '🏃‍♂️ Marathon MCP Tool v1.0.0 Development Edition',
      test_message: message,
      response: '🇬🇪 კავშირი წარმატებულია! / Connection successful!',
      development_notice: '🚧 განვითარების ფაზა - ძირითადი ფუნქციონალი / Development Phase - Core functionality',
      system_info: systemInfo,
      log_stats: logStats,
      timestamp: new Date().toISOString(),
      batumi_signature: '🌊 ბათუმის შავი ზღვის ტალღებისგან მისალმება! / Greetings from the waves of Batumi\'s Black Sea!'
    };
  }

  private async getConfig(args: any): Promise<any> {
    const section = args.section || 'all';
    
    if (section === 'all') {
      return {
        status: 'success',
        config: this.config.get(),
        section: 'all',
        message: '📊 მთლიანი კონფიგურაცია / Complete configuration',
        development_mode: true
      };
    }

    const configData = this.config.get(section);
    
    if (configData === undefined) {
      return {
        status: 'error',
        message: `კონფიგურაციის სექცია ვერ მოიძებნა: ${section} / Configuration section not found: ${section}`,
        available_sections: ['modules', 'ui_preferences', 'security', 'development', 'all']
      };
    }

    return {
      status: 'success',
      config: configData,
      section,
      message: `📊 კონფიგურაციის სექცია: ${section} / Configuration section: ${section}`,
      development_mode: true
    };
  }

  private async setConfig(args: any): Promise<any> {
    const { key, value } = args;
    
    try {
      const oldValue = this.config.get(key);
      this.config.set(key, value);
      await this.config.save();
      
      return {
        status: 'success',
        message: `✅ კონფიგურაცია განახლდა: ${key} / Configuration updated: ${key}`,
        key,
        old_value: oldValue,
        new_value: value,
        development_mode: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კონფიგურაციის განახლების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Configuration update error`,
        key,
        attempted_value: value
      };
    }
  }

  private async toggleModule(args: any): Promise<any> {
    const { module, enabled } = args;
    
    const oldState = this.config.isModuleEnabled(module);
    const newState = enabled !== undefined ? enabled : !oldState;
    
    // Prevent disabling core system in development
    if (module === 'core_system' && !newState) {
      return {
        status: 'warning',
        message: '⚠️ ძირითადი სისტემის მოდული ვერ გამოირთვება განვითარების ფაზაში / Core system module cannot be disabled in development phase',
        module,
        current_state: oldState
      };
    }
    
    this.config.toggleModule(module, newState);
    await this.config.save();
    
    const action = newState ? 'ჩართულია / enabled' : 'გამორთულია / disabled';
    
    return {
      status: 'success',
      message: `🎛️ მოდული ${action}: ${module}`,
      module,
      old_state: oldState,
      new_state: newState,
      georgian_name: this.getModuleGeorgianName(module),
      development_mode: true,
      available_modules: [
        'core_system',
        'file_system', 
        'git_repository',
        'memory_knowledge',
        'system_process',
        'documentation',
        'advanced_features'
      ]
    };
  }

  private async getStatus(args: any): Promise<any> {
    const detailed = args.detailed || false;
    
    const systemInfo = this.config.getSystemInfo();
    const logStats = await this.logger.getStats();
    
    const moduleStatus = Object.entries(this.config.get('modules')).map(([name, config]) => ({
      name,
      georgian_name: this.getModuleGeorgianName(name),
      enabled: config.enabled,
      settings_count: Object.keys(config.settings || {}).length,
      development_ready: name !== 'advanced_features' // Advanced features not ready in dev
    }));

    const status = {
      status: 'success',
      message: '📊 Marathon MCP Tool v1.0.0 Development Status / განვითარების სტატუსი',
      version: '1.0.0',
      edition: 'development',
      system: systemInfo,
      modules: moduleStatus,
      performance: {
        memory_usage: process.memoryUsage(),
        uptime: process.uptime(),
        node_version: process.version
      },
      development_info: {
        phase: 'Core functionality implementation',
        ready_modules: moduleStatus.filter(m => m.enabled && m.development_ready).length,
        total_modules: moduleStatus.length,
        debug_mode: true
      },
      timestamp: new Date().toISOString()
    };

    if (detailed) {
      status['logs'] = logStats;
      status['config_summary'] = {
        language: this.config.get('language'),
        theme: this.config.get('theme'),
        security_level: this.config.get('security_level'),
        auto_backup: this.config.get('auto_backup'),
        development_mode: this.config.get('development.debug_mode')
      };
    }

    return status;
  }

  private async switchLanguage(args: any): Promise<any> {
    const { language } = args;
    const oldLanguage = this.config.get('language');
    
    this.config.set('language', language);
    await this.config.save();
    
    const messages = {
      georgian: {
        success: '✅ ენა შეიცვალა ქართულად',
        interface: '🇬🇪 ქართული ინტერფეისი ჩართულია'
      },
      english: {
        success: '✅ Language changed to English',
        interface: '🇬🇧 English interface enabled'
      }
    };

    const msg = messages[language as keyof typeof messages] || messages.georgian;
    
    return {
      status: 'success',
      message: msg.success,
      interface_message: msg.interface,
      old_language: oldLanguage,
      new_language: language,
      available_languages: ['georgian', 'english'],
      development_mode: true,
      batumi_signature: language === 'georgian' 
        ? '🌊 ბათუმური ხელწერით' 
        : '🌊 Created with Batumi spirit'
    };
  }

  private getModuleGeorgianName(module: string): string {
    const names = {
      core_system: '🔧 ძირითადი სისტემა / Core System',
      file_system: '📁 ფაილების მენეჯმენტი / File Management',
      git_repository: '🐙 Git რეპოზიტორიები / Git Repositories',
      memory_knowledge: '🧠 მეხსიერება და ცოდნა / Memory and Knowledge',
      system_process: '⚙️ სისტემა და პროცესები / System and Processes',
      documentation: '📚 დოკუმენტაცია და კონტენტი / Documentation and Content',
      advanced_features: '🚀 გაფართოებული ფუნქციები (განვითარება) / Advanced Features (Development)'
    };
    
    return names[module as keyof typeof names] || module;
  }
}