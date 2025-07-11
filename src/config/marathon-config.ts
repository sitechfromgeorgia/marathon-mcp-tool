/**
 * 🏃‍♂️ Marathon MCP Tool Configuration System v1.0.0 Enhanced
 * 🇬🇪 ქართული კონფიგურაციის სისტემა / Georgian Configuration System
 * 
 * 🚀 Enhanced Edition - All features activated!
 * 🚀 გაფართოებული ვერსია - ყველა ფუნქცია ჩართულია!
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
      edition: 'enhanced', // 🚀 Enhanced Edition activated!
      language: 'georgian',
      theme: 'batumi_sunset',
      performance_mode: 'balanced',
      auto_backup: true,
      security_level: 'standard',
      
      modules: {
        core_system: {
          enabled: true,
          settings: {
            auto_updates: false,
            enhanced_mode: true // 🚀 Enhanced features
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
            enhanced_mode: true // 🚀 Enhanced features
          }
        },
        memory_knowledge: {
          enabled: true,
          settings: {
            max_memory_size: '200MB', // 🚀 Increased for enhanced mode
            knowledge_graph_depth: 5, // 🚀 Increased for enhanced mode
            auto_save_interval: 120, // 🚀 More frequent auto-save
            sqlite_enabled: true // 🚀 SQLite integration
          }
        },
        system_process: {
          enabled: true,
          settings: {
            safe_commands_only: true,
            timeout_seconds: 30,
            max_concurrent_processes: 10, // 🚀 Increased for enhanced mode
            enhanced_monitoring: true // 🚀 Enhanced monitoring
          }
        },
        documentation: {
          enabled: true,
          settings: {
            cache_docs: true,
            auto_update_docs: true, // 🚀 Enabled in enhanced mode
            preferred_language: 'georgian',
            enhanced_search: true // 🚀 Enhanced search
          }
        },
        advanced_features: {
          enabled: true, // 🚀 ACTIVATED!
          settings: {
            symbol_commands: true, // 🚀 Symbol Commands (---, +++, etc.)
            marathon_mode: true, // 🚀 Marathon Mode
            ai_assistance: true, // 🚀 Basic AI
            sqlite_memory: true, // 🚀 SQLite Memory
            analytics: true, // 🚀 Basic Analytics
            workflows: false, // Future feature
            integrations: false, // Future feature
            cloud_sync: false // Future feature
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
        encrypt_memory: false // Keep disabled for now
      },
      
      development: {
        debug_mode: false, // 🚀 Production ready
        verbose_logging: false, // 🚀 Production ready
        feature_flags: {
          symbol_commands: true, // 🚀 ENABLED
          marathon_mode: true, // 🚀 ENABLED
          sqlite_memory: true, // 🚀 ENABLED
          analytics: true, // 🚀 ENABLED
          advanced_ai: false, // Future (v1.1.0)
          cloud_sync: false, // Future (v1.2.0)
          web_dashboard: false // Future (v2.0.0)
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
        
        // Force enhanced settings
        this.config.version = '1.0.0';
        this.config.edition = 'enhanced';
        this.config.development.debug_mode = false;
        this.config.modules.advanced_features.enabled = true;
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
      
      // 🚀 Enhanced Features - ACTIVATED! / გაფართოებული ფუნქციები - ჩართული!
      'marathon_symbol_command': 'სიმბოლური ბრძანებები (---, +++, ...) / Symbol commands',
      'marathon_mode_activate': 'მარათონ რეჟიმის ჩართვა / Activate Marathon Mode',
      'marathon_mode_deactivate': 'მარათონ რეჟიმის გამორთვა / Deactivate Marathon Mode',
      'marathon_analytics_report': 'ანალიტიკის რეპორტი / Analytics report',
      'marathon_sqlite_status': 'SQLite მდგომარეობა / SQLite status',
      'marathon_auto_save': 'ავტომატური შენახვა / Auto save'
    };
  }

  public getSystemInfo(): Record<string, any> {
    return {
      version: this.config.version,
      edition: this.config.edition, // 🚀 "enhanced"
      language: this.config.language,
      theme: this.config.theme,
      enhanced_mode: this.config.edition === 'enhanced', // 🚀 Enhanced mode indicator
      modules_enabled: Object.entries(this.config.modules)
        .filter(([_, config]) => config.enabled)
        .map(([name, _]) => name),
      total_functions: this.getTotalFunctionCount(),
      georgian_interface: this.config.language === 'georgian',
      batumi_signature: '🌊 ბათუმური ხელწერით შექმნილია სიყვარულით / Created with Batumi style and love',
      enhanced_features: { // 🚀 Enhanced features status
        symbol_commands: this.config.development.feature_flags.symbol_commands,
        marathon_mode: this.config.development.feature_flags.marathon_mode,
        sqlite_memory: this.config.development.feature_flags.sqlite_memory,
        analytics: this.config.development.feature_flags.analytics
      }
    };
  }

  private getTotalFunctionCount(): number {
    // Enhanced function counts for v1.0.0 enhanced edition
    const counts = {
      core_system: 6,
      file_system: 15,
      git_repository: 20,
      memory_knowledge: 12, // 🚀 Increased with SQLite
      system_process: 8,
      documentation: 6,
      advanced_features: 10 // 🚀 ACTIVATED! Symbol commands + Marathon Mode + Analytics
    };

    return Object.entries(this.config.modules)
      .filter(([_, config]) => config.enabled)
      .reduce((total, [name, _]) => {
        return total + (counts[name as keyof typeof counts] || 0);
      }, 0);
  }

  // 🚀 Enhanced feature getters
  public isSymbolCommandsEnabled(): boolean {
    return this.config.development.feature_flags.symbol_commands;
  }

  public isMarathonModeEnabled(): boolean {
    return this.config.development.feature_flags.marathon_mode;
  }

  public isSQLiteEnabled(): boolean {
    return this.config.development.feature_flags.sqlite_memory;
  }

  public isAnalyticsEnabled(): boolean {
    return this.config.development.feature_flags.analytics;
  }
}