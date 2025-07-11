/**
 * ⚙️ System & Process Management Module v1.0.0
 * სისტემა და პროცესების მენეჯმენტის მოდული
 * 
 * 🚧 Development Phase - Basic system operations (safe mode)
 * 🚧 განვითარების ფაზა - ძირითადი სისტემური ოპერაციები (უსაფრთხო რეჟიმი)
 * 
 * Command Execution:
 * - marathon_execute_command - ბრძანების შესრულება / Execute command
 * - marathon_list_processes - პროცესების სია / List processes
 * 
 * System Configuration:
 * - marathon_get_system_config - სისტემის კონფიგურაცია / System configuration
 * 
 * Note: In development phase, dangerous commands are blocked
 * შენიშვნა: განვითარების ფაზაში, საშიში ბრძანებები დაბლოკილია
 */

import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

export class SystemProcessModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'system-process';

  // Safe commands allowed in development
  private readonly allowedCommands = [
    'ls', 'dir', 'pwd', 'whoami', 'date', 'time', 'echo',
    'cat', 'head', 'tail', 'grep', 'find', 'which', 'where',
    'node', 'npm', 'git', 'tsc', 'code', 'code-insiders'
  ];

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      {
        name: 'marathon_execute_command',
        description: `${georgian['marathon_execute_command']} - Execute system command (safe mode in development)`,
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'Command to execute / შესასრულებელი ბრძანება'
            },
            timeout: {
              type: 'number',
              description: 'Timeout in seconds / დრო წამებში',
              default: 10 // Reduced for development
            },
            safe_mode: {
              type: 'boolean',
              description: 'Enable safe mode / უსაფრთხო რეჟიმი',
              default: true
            }
          },
          required: ['command']
        }
      },
      {
        name: 'marathon_list_processes',
        description: `${georgian['marathon_list_processes']} - List running processes (basic info in development)`,
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'string',
              description: 'Filter processes by name / პროცესების ფილტრაცია'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of processes / პროცესების მაქსიმალური რაოდენობა',
              default: 10 // Reduced for development
            }
          }
        }
      },
      {
        name: 'marathon_get_system_config',
        description: 'სისტემის კონფიგურაცია / System configuration - Get basic system information',
        inputSchema: {
          type: 'object',
          properties: {
            detailed: {
              type: 'boolean',
              description: 'Include detailed information / დეტალური ინფორმაცია',
              default: false
            }
          }
        }
      }
    ];
  }

  public async handleTool(name: string, args: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      await this.logger.logFunctionCall(name, args, this.moduleName);
      
      if (!this.config.isModuleEnabled('system_process')) {
        throw new Error('სისტემისა და პროცესების მოდული გამორთულია / System and process module is disabled');
      }
      
      let result;
      
      switch (name) {
        case 'marathon_execute_command':
          result = await this.executeCommand(args);
          break;
        case 'marathon_list_processes':
          result = await this.listProcesses(args);
          break;
        case 'marathon_get_system_config':
          result = await this.getSystemConfig(args);
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

  private async executeCommand(args: any): Promise<any> {
    const { command, timeout = 10, safe_mode = true } = args;
    
    try {
      const commandParts = command.trim().split(' ');
      const baseCommand = commandParts[0];
      
      // Safety check in development mode
      if (safe_mode && !this.allowedCommands.includes(baseCommand)) {
        return {
          status: 'blocked',
          message: `🚧 ბრძანება დაბლოკილია განვითარების რეჟიმში: ${baseCommand} / Command blocked in development mode: ${baseCommand}`,
          command,
          allowed_commands: this.allowedCommands,
          development_mode: true,
          safety_notice: 'For security, only safe commands are allowed in development phase / უსაფრთხოებისთვის, განვითარების ფაზაში მხოლოდ უსაფრთხო ბრძანებებია ნებადართული'
        };
      }
      
      // Simulate command execution (in real implementation, use child_process)
      const simulatedResults = {
        'pwd': process.cwd(),
        'whoami': process.env.USER || process.env.USERNAME || 'marathon-user',
        'date': new Date().toISOString(),
        'time': new Date().toLocaleTimeString(),
        'node --version': process.version,
        'echo hello': 'hello'
      };
      
      const result = simulatedResults[command] || `Simulated output for: ${command}`;
      
      return {
        status: 'success',
        message: `✅ ბრძანება შესრულდა (სიმულაცია): ${command} / Command executed (simulation): ${command}`,
        command,
        output: result,
        exit_code: 0,
        execution_time: Math.random() * 100 + 50, // Simulated execution time
        development_mode: true,
        development_notice: '🚧 This is a simulated response in development phase / ეს არის სიმულირებული პასუხი განვითარების ფაზაში',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ბრძანების შესრულების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Command execution error`,
        command,
        development_mode: true
      };
    }
  }

  private async listProcesses(args: any): Promise<any> {
    const { filter, limit = 10 } = args;
    
    try {
      // Simulate process list (in real implementation, use system tools)
      const simulatedProcesses = [
        {
          pid: process.pid,
          name: 'node',
          command: 'node marathon-mcp-tool',
          cpu: Math.random() * 10,
          memory: Math.random() * 100,
          status: 'running'
        },
        {
          pid: 1234,
          name: 'code',
          command: 'Visual Studio Code',
          cpu: Math.random() * 5,
          memory: Math.random() * 200,
          status: 'running'
        },
        {
          pid: 5678,
          name: 'git',
          command: 'git status',
          cpu: Math.random() * 2,
          memory: Math.random() * 50,
          status: 'running'
        }
      ];
      
      let processes = simulatedProcesses;
      
      if (filter) {
        processes = processes.filter(p => 
          p.name.toLowerCase().includes(filter.toLowerCase()) ||
          p.command.toLowerCase().includes(filter.toLowerCase())
        );
      }
      
      processes = processes.slice(0, limit);
      
      return {
        status: 'success',
        message: `📊 პროცესების სია (სიმულაცია): ${processes.length} პროცესი / Process list (simulation): ${processes.length} processes`,
        processes,
        total_found: processes.length,
        filter_applied: filter,
        development_mode: true,
        development_notice: '🚧 This is a simulated response in development phase / ეს არის სიმულირებული პასუხი განვითარების ფაზაში',
        real_implementation: 'Coming in stable release / მოვა სტაბილურ გამოშვებაში',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ პროცესების სიის ჩამოტვირთვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Process listing error`,
        development_mode: true
      };
    }
  }

  private async getSystemConfig(args: any): Promise<any> {
    const { detailed = false } = args;
    
    try {
      const basicConfig = {
        platform: process.platform,
        architecture: process.arch,
        node_version: process.version,
        marathon_version: '1.0.0',
        development_mode: true,
        uptime: process.uptime(),
        memory_usage: process.memoryUsage(),
        cwd: process.cwd()
      };
      
      let systemConfig: any = basicConfig;
      
      if (detailed) {
        systemConfig = {
          ...basicConfig,
          environment: {
            user: process.env.USER || process.env.USERNAME,
            home: process.env.HOME || process.env.USERPROFILE,
            path: process.env.PATH?.split(':').slice(0, 5), // Show first 5 PATH entries
            shell: process.env.SHELL || process.env.COMSPEC,
            lang: process.env.LANG || process.env.LANGUAGE
          },
          system: {
            total_memory: 'N/A (simulated)',
            available_memory: 'N/A (simulated)',
            cpu_count: 'N/A (simulated)',
            load_average: 'N/A (simulated)'
          },
          marathon_config: {
            config_path: this.config.get('config_path') || 'Default location',
            modules_enabled: this.config.get('modules') || {},
            language: this.config.get('language') || 'georgian',
            theme: this.config.get('theme') || 'batumi_sunset'
          }
        };
      }
      
      return {
        status: 'success',
        message: `🖥️ სისტემის კონფიგურაცია ${detailed ? '(დეტალური)' : '(ძირითადი)'} / System configuration ${detailed ? '(detailed)' : '(basic)'}`,
        system_config: systemConfig,
        detailed,
        development_mode: true,
        development_notice: '🚧 Some system information is simulated in development phase / ზოგიერთი სისტემური ინფორმაცია სიმულირებულია განვითარების ფაზაში',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ სისტემის კონფიგურაციის მიღების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / System configuration error`,
        development_mode: true
      };
    }
  }
}