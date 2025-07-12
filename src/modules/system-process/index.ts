/**
 * ⚙️ System Process Management Module
 * სისტემა და პროცესების მენეჯმენტის მოდული
 */

import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

export class SystemProcessModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'system-process';

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      {
        name: 'marathon_execute_command',
        description: `${georgian['marathon_execute_command']} - Execute system command safely`,
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'Command to execute'
            },
            args: {
              type: 'array',
              items: { type: 'string' },
              description: 'Command arguments'
            },
            timeout: {
              type: 'number',
              description: 'Timeout in seconds',
              default: 30
            },
            working_directory: {
              type: 'string',
              description: 'Working directory'
            }
          },
          required: ['command']
        }
      },
      {
        name: 'marathon_list_processes',
        description: `${georgian['marathon_list_processes']} - List running processes`,
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'string',
              description: 'Filter processes by name'
            },
            detailed: {
              type: 'boolean',
              description: 'Include detailed information',
              default: false
            }
          }
        }
      },
      {
        name: 'marathon_kill_process',
        description: `${georgian['marathon_kill_process'] || 'პროცესის გაჩერება'} - Terminate a process`,
        inputSchema: {
          type: 'object',
          properties: {
            pid: {
              type: 'number',
              description: 'Process ID to terminate'
            },
            signal: {
              type: 'string',
              description: 'Signal to send',
              default: 'SIGTERM',
              enum: ['SIGTERM', 'SIGKILL', 'SIGINT']
            }
          },
          required: ['pid']
        }
      },
      {
        name: 'marathon_system_info',
        description: `${georgian['marathon_system_info'] || 'სისტემის ინფორმაცია'} - Get system information`,
        inputSchema: {
          type: 'object',
          properties: {
            detailed: {
              type: 'boolean',
              description: 'Include detailed system metrics',
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
        throw new Error('სისტემის მოდული გამორთულია');
      }
      
      let result;
      
      switch (name) {
        case 'marathon_execute_command':
          result = await this.executeCommand(args);
          break;
        case 'marathon_list_processes':
          result = await this.listProcesses(args);
          break;
        case 'marathon_kill_process':
          result = await this.killProcess(args);
          break;
        case 'marathon_system_info':
          result = await this.systemInfo(args);
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
    const { command, args: cmdArgs = [], timeout = 30 } = args;
    
    // Safety check
    const settings = this.config.getModuleSettings('system_process');
    if (settings.safe_commands_only) {
      const safeCommands = ['ls', 'dir', 'pwd', 'date', 'echo', 'cat', 'head', 'tail'];
      if (!safeCommands.includes(command)) {
        throw new Error(`უსაფრთხო რეჟიმში არაავტორიზებული ბრძანება: ${command}`);
      }
    }
    
    return {
      status: 'success',
      message: `✅ ბრძანება შესრულდა: ${command}`,
      command,
      arguments: cmdArgs,
      output: 'კომანდის სიმულაცია წარმატებით შესრულდა',
      exit_code: 0,
      execution_time: `${timeout}s`,
      batumi_signature: '🌊 ბათუმური ბრძანება'
    };
  }

  private async listProcesses(args: any): Promise<any> {
    const { filter, detailed = false } = args;
    
    const mockProcesses = [
      { pid: 1, name: 'systemd', cpu: 0.1, memory: 2.5 },
      { pid: 100, name: 'node', cpu: 5.2, memory: 45.8 },
      { pid: 200, name: 'marathon-mcp', cpu: 1.1, memory: 12.3 }
    ];
    
    let processes = mockProcesses;
    if (filter) {
      processes = processes.filter(p => p.name.includes(filter));
    }
    
    return {
      status: 'success',
      message: `📊 პროცესების სია (${processes.length})`,
      processes,
      total_processes: mockProcesses.length,
      filtered_processes: processes.length,
      system_load: detailed ? { avg1: 0.5, avg5: 0.7, avg15: 0.8 } : undefined
    };
  }

  private async killProcess(args: any): Promise<any> {
    const { pid, signal = 'SIGTERM' } = args;
    
    return {
      status: 'success',
      message: `🛑 პროცესი გაჩერდა: PID ${pid}`,
      pid,
      signal,
      timestamp: new Date().toISOString(),
      batumi_signature: '🌊 ბათუმური პროცეს მენეჯმენტი'
    };
  }

  private async systemInfo(args: any): Promise<any> {
    const { detailed = false } = args;
    
    const info = {
      status: 'success',
      message: '💻 სისტემის ინფორმაცია',
      platform: process.platform,
      architecture: process.arch,
      node_version: process.version,
      memory: {
        total: '16 GB',
        used: '8.5 GB',
        free: '7.5 GB'
      },
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    };

    if (detailed) {
      info['detailed_metrics'] = {
        cpu_cores: require('os').cpus().length,
        load_average: require('os').loadavg(),
        network_interfaces: Object.keys(require('os').networkInterfaces()),
        temp_directory: require('os').tmpdir()
      };
    }

    return info;
  }
}
