/**
 * 🏃‍♂️ Marathon MCP Tool Configuration System v1.0.0
 * 🇬🇪 ქართული კონფიგურაციის სისტემა / Georgian Configuration System
 * 
 * 🚧 Development Phase - Basic configuration implementation
 * 🚧 განვითარების ფაზა - ძირითადი კონფიგურაციის განხორციელება
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface ModuleConfig {
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface MarathonConfigData {
  version: string;
  edition: string;
  language: 'georgian' | 'english';
  theme: string;
  performance_mode: 'balanced' | 'speed' | 'memory';
  auto_backup: boolean;
  security_level: 'low' | 'standard' | 'high';
  
  modules: {
    core_system: ModuleConfig;
    file_system: ModuleConfig;
    git_repository: ModuleConfig;
    memory_knowledge: ModuleConfig;
    system_process: ModuleConfig;
    documentation: ModuleConfig;
    advanced_features: ModuleConfig;
  };
  
  ui_preferences: {
    show_tooltips: boolean;
    compact_mode: boolean;
    show_function_count: boolean;
    group_by_category: boolean;
  };
  
  security: {
    require_confirmation: string[];
    audit_log: boolean;
    encrypt_memory: boolean;
  };
  
  development: {
    debug_mode: boolean;
    verbose_logging: boolean;
    feature_flags: Record<string, boolean>;
  };
}

export class MarathonConfig {
  private configPath: string;
  private config: MarathonConfigData;

  constructor() {
    this.configPath = join(homedir(), '.marathon-mcp', 'config.json');
    this.config = this.getDefaultConfig();
  }

  private getDefaultConfig(): MarathonConfigData {
    return {
      version: '1.0.0',
      edition: 'development',
      language: 'georgian',
      theme: 'batumi_sunset',
      performance_mode: 'balanced',
      auto_backup: true,
      security_level: 'standard',
      
      modules: {
        core_system: {
          enabled: true,
          settings: {
            auto_updates: false, // Disabled in development
            development_mode: true
          }
        },
        file_system: {
          enabled: true,
          settings: {
            max_file_size: '100MB',
            allowed_extensions: ['*'],
            backup_before_edit: true,
            safe_mode: true
          }
        },
        git_repository: {
          enabled: true,
          settings: {
            default_branch: 'main',
            auto_commit_message: true,
            require_pr_review: false,
            development_mode: true
          }
        },
        memory_knowledge: {
          enabled: true,
          settings: {
            max_memory_size: '50MB', // Reduced for development
            knowledge_graph_depth: 3, // Reduced for development
            auto_save_interval: 300
          }
        },
        system_process: {
          enabled: true,
          settings: {
            safe_commands_only: true,
            timeout_seconds: 30,
            max_concurrent_processes: 5 // Reduced for development
          }
        },
        documentation: {
          enabled: true,
          settings: {
            cache_docs: true,
            auto_update_docs: false, // Disabled in development
            preferred_language: 'georgian'
          }
        },
        advanced_features: {
          enabled: false, // Disabled in development phase
          settings: {
            ai_assistance: false,
            workflows: false,
            integrations: false,
            marathon_mode: false
          }
        }
      },
      
      ui_preferences: {
        show_tooltips: true,
        compact_mode: false,
        show_function_count: true,
        group_by_category: true
      },
      
      security: {
        require_confirmation: ['delete', 'execute', 'push'],
        audit_log: true,
        encrypt_memory: false // Disabled in development
      },
      
      development: {
        debug_mode: true,
        verbose_logging: true,
        feature_flags: {
          symbol_commands: false,
          advanced_ai: false,
          cloud_sync: false,
          analytics: false
        }
      }
    };
  }

  public async load(): Promise<void> {
    try {
      // Ensure config directory exists
      const configDir = join(homedir(), '.marathon-mcp');
      await fs.mkdir(configDir, { recursive: true });

      // Try to load existing config
      try {
        const configData = await fs.readFile(this.configPath, 'utf-8');
        const loadedConfig = JSON.parse(configData);
        
        // Merge with defaults to ensure all fields exist
        this.config = { ...this.getDefaultConfig(), ...loadedConfig };
        
        // Force development settings
        this.config.version = '1.0.0';
        this.config.edition = 'development';
        this.config.development.debug_mode = true;
        this.config.modules.advanced_features.enabled = false;
      } catch (error) {
        // Config doesn't exist, create it
        await this.save();
      }
    } catch (error) {
      console.warn('⚠️ კონფიგურაციის ჩატვირთვის შეცდომა, ნაგულისხმევი პარამეტრები: / Configuration loading error, default parameters:', error);
    }
  }

  public async save(): Promise<void> {
    try {
      const configDir = join(homedir(), '.marathon-mcp');
      await fs.mkdir(configDir, { recursive: true });
      
      await fs.writeFile(
        this.configPath,
        JSON.stringify(this.config, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('❌ კონფიგურაციის შენახვის შეცდომა: / Configuration save error:', error);
      throw error;
    }
  }

  public get(key?: string): any {
    if (!key) return this.config;
    
    const keys = key.split('.');
    let value: any = this.config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  public set(key: string, value: any): void {
    const keys = key.split('.');
    let current: any = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  public isModuleEnabled(module: string): boolean {
    return this.get(`modules.${module}.enabled`) || false;
  }

  public getModuleSettings(module: string): Record<string, any> {
    return this.get(`modules.${module}.settings`) || {};
  }

  public toggleModule(module: string, enabled?: boolean): void {
    const currentState = this.isModuleEnabled(module);
    const newState = enabled !== undefined ? enabled : !currentState;
    this.set(`modules.${module}.enabled`, newState);
  }

  public getGeorgianInterface(): Record<string, string> {
    return {
      // Core System / ძირითადი სისტემა
      'marathon_test_connection': 'კავშირის ტესტირება / Connection testing',
      'marathon_get_config': 'კონფიგურაციის ნახვა / View configuration',
      'marathon_set_config': 'კონფიგურაციის ცვლილება / Change configuration',
      'marathon_module_toggle': 'მოდულების ჩართვა/გამორთვა / Toggle modules',
      'marathon_get_status': 'სისტემის სტატუსი / System status',
      'marathon_language_switch': 'ენის ცვლილება / Language switch',
      
      // File System / ფაილების სისტემა
      'marathon_read_file': 'ფაილის წაკითხვა / Read file',
      'marathon_write_file': 'ფაილში ჩაწერა / Write to file',
      'marathon_edit_file': 'ფაილის რედაქტირება / Edit file',
      'marathon_create_directory': 'დირექტორიის შექმნა / Create directory',
      'marathon_list_directory': 'დირექტორიის სია / List directory',
      'marathon_search_files': 'ფაილების ძიება / Search files',
      
      // Git Repository / Git რეპოზიტორიები
      'marathon_git_create_repo': 'რეპოზიტორიის შექმნა / Create repository',
      'marathon_git_create_pr': 'Pull Request-ის შექმნა / Create Pull Request',
      'marathon_git_create_issue': 'Issue-ის შექმნა / Create issue',
      
      // Memory & Knowledge / მეხსიერება და ცოდნა
      'marathon_memory_save': 'ინფორმაციის შენახვა / Save information',
      'marathon_memory_load': 'ინფორმაციის ჩატვირთვა / Load information',
      'marathon_kb_create_entities': 'ენტითების შექმნა / Create entities',
      
      // System & Process / სისტემა და პროცესები
      'marathon_execute_command': 'ბრძანების შესრულება / Execute command',
      'marathon_list_processes': 'პროცესების სია / List processes',
      
      // Documentation / დოკუმენტაცია
      'marathon_fetch_docs': 'დოკუმენტაციის მიღება / Fetch documentation',
      'marathon_search_docs': 'დოკუმენტაციაში ძიება / Search documentation',
      
      // Advanced Features (Development) / გაფართოებული ფუნქციები (განვითარება)
      'marathon_smart_execute': 'AI-powered ბრძანების შესრულება (განვითარება) / AI-powered command execution (development)',
      'marathon_ai_assistant': 'ინტელექტუალური დამხმარე (განვითარება) / AI assistant (development)',
      'marathon_symbol_command': 'სიმბოლური ბრძანებები (განვითარება) / Symbol commands (development)'
    };
  }

  public getSystemInfo(): Record<string, any> {
    return {
      version: this.config.version,
      edition: this.config.edition,
      language: this.config.language,
      theme: this.config.theme,
      development_mode: this.config.development.debug_mode,
      modules_enabled: Object.entries(this.config.modules)
        .filter(([_, config]) => config.enabled)
        .map(([name, _]) => name),
      total_functions: this.getTotalFunctionCount(),
      georgian_interface: this.config.language === 'georgian',
      batumi_signature: '🌊 ბათუმური ხელწერით შექმნილია სიყვარულით / Created with Batumi style and love',
      development_status: {
        debug_enabled: this.config.development.debug_mode,
        verbose_logging: this.config.development.verbose_logging,
        feature_flags: this.config.development.feature_flags
      }
    };
  }

  private getTotalFunctionCount(): number {
    // Function counts for v1.0.0 development phase
    const counts = {
      core_system: 6,
      file_system: 12, // Reduced from 15
      git_repository: 15, // Reduced from 20
      memory_knowledge: 8, // Reduced from 10
      system_process: 6, // Reduced from 8
      documentation: 4, // Reduced from 6
      advanced_features: 0 // Disabled in development
    };

    return Object.entries(this.config.modules)
      .filter(([_, config]) => config.enabled)
      .reduce((total, [name, _]) => {
        return total + (counts[name as keyof typeof counts] || 0);
      }, 0);
  }
}