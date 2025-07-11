/**
 * 🏃‍♂️ Marathon MCP Tool Configuration System
 * 🇬🇪 ქართული კონფიგურაციის სისტემა
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
      version: '2.0.0',
      edition: 'universal',
      language: 'georgian',
      theme: 'batumi_sunset',
      performance_mode: 'balanced',
      auto_backup: true,
      security_level: 'standard',
      
      modules: {
        core_system: {
          enabled: true,
          settings: {
            auto_updates: true
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
            require_pr_review: false
          }
        },
        memory_knowledge: {
          enabled: true,
          settings: {
            max_memory_size: '100MB',
            knowledge_graph_depth: 5,
            auto_save_interval: 300
          }
        },
        system_process: {
          enabled: true,
          settings: {
            safe_commands_only: true,
            timeout_seconds: 30,
            max_concurrent_processes: 10
          }
        },
        documentation: {
          enabled: true,
          settings: {
            cache_docs: true,
            auto_update_docs: true,
            preferred_language: 'georgian'
          }
        },
        advanced_features: {
          enabled: true,
          settings: {
            ai_assistance: true,
            workflows: true,
            integrations: true,
            marathon_mode: true
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
        encrypt_memory: true
      }
    };
  }

  public async load(): Promise<void> {
    try {
      const configDir = join(homedir(), '.marathon-mcp');
      await fs.mkdir(configDir, { recursive: true });

      try {
        const configData = await fs.readFile(this.configPath, 'utf-8');
        const loadedConfig = JSON.parse(configData);
        this.config = { ...this.getDefaultConfig(), ...loadedConfig };
      } catch (error) {
        await this.save();
      }
    } catch (error) {
      console.warn('⚠️ კონფიგურაციის ჩატვირთვის შეცდომა, ნაგულისხმევი პარამეტრები:', error);
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
      console.error('❌ კონფიგურაციის შენახვის შეცდომა:', error);
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
      // Core System
      'marathon_test_connection': 'კავშირის ტესტირება',
      'marathon_get_config': 'კონფიგურაციის ნახვა',
      'marathon_set_config': 'კონფიგურაციის ცვლილება',
      'marathon_module_toggle': 'მოდულების ჩართვა/გამორთვა',
      'marathon_get_status': 'სისტემის სტატუსი',
      'marathon_language_switch': 'ენის ცვლილება',
      
      // File System
      'marathon_read_file': 'ფაილის წაკითხვა',
      'marathon_write_file': 'ფაილში ჩაწერა',
      'marathon_edit_file': 'ფაილის რედაქტირება',
      'marathon_create_directory': 'დირექტორიის შექმნა',
      'marathon_list_directory': 'დირექტორიის სია',
      'marathon_search_files': 'ფაილების ძიება',
      
      // Git Repository
      'marathon_git_create_repo': 'რეპოზიტორიის შექმნა',
      'marathon_git_create_pr': 'Pull Request-ის შექმნა',
      'marathon_git_create_issue': 'Issue-ის შექმნა',
      
      // Memory & Knowledge
      'marathon_memory_save': 'ინფორმაციის შენახვა',
      'marathon_memory_load': 'ინფორმაციის ჩატვირთვა',
      'marathon_kb_create_entities': 'ენტითების შექმნა',
      
      // System & Process
      'marathon_execute_command': 'ბრძანების შესრულება',
      'marathon_list_processes': 'პროცესების სია',
      
      // Documentation
      'marathon_fetch_docs': 'დოკუმენტაციის მიღება',
      'marathon_search_docs': 'დოკუმენტაციაში ძიება',
      
      // Advanced Features
      'marathon_smart_execute': 'AI-powered ბრძანების შესრულება',
      'marathon_ai_assistant': 'ინტელექტუალური დამხმარე',
      'marathon_symbol_command': 'სიმბოლური ბრძანებები'
    };
  }

  public getSystemInfo(): Record<string, any> {
    return {
      version: this.config.version,
      edition: this.config.edition,
      language: this.config.language,
      theme: this.config.theme,
      modules_enabled: Object.entries(this.config.modules)
        .filter(([_, config]) => config.enabled)
        .map(([name, _]) => name),
      total_functions: this.getTotalFunctionCount(),
      georgian_interface: this.config.language === 'georgian',
      batumi_signature: '🌊 ბათუმური ხელწერით შექმნილია სიყვარულით'
    };
  }

  private getTotalFunctionCount(): number {
    const counts = {
      core_system: 6,
      file_system: 15,
      git_repository: 20,
      memory_knowledge: 10,
      system_process: 8,
      documentation: 6,
      advanced_features: 15
    };

    return Object.entries(this.config.modules)
      .filter(([_, config]) => config.enabled)
      .reduce((total, [name, _]) => {
        return total + (counts[name as keyof typeof counts] || 0);
      }, 0);
  }
}