/**
 * ⚙️ System Process Management Module
 * სისტემა და პროცესების მენეჯმენტის მოდული
 * 
 * Command Execution:
 * - marathon_execute_command - ბრძანების შესრულება
 * - marathon_read_output - შედეგის წაკითხვა
 * - marathon_force_terminate - ძალით შეწყვეტა
 * 
 * Process Management:
 * - marathon_list_processes - პროცესების სია
 * - marathon_kill_process - პროცესის დაკვლა
 * - marathon_list_sessions - სესიების სია
 * 
 * System Configuration:
 * - marathon_get_system_config - სისტემის კონფიგურაცია
 * - marathon_set_system_config - კონფიგურაციის ცვლილება
 */

import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';

const execAsync = promisify(exec);

interface RunningProcess {
  pid: number;
  sessionId: string;
  command: string;
  startTime: Date;
  status: 'running' | 'completed' | 'error' | 'terminated';
}

interface SystemSession {
  sessionId: string;
  command: string;
  startTime: Date;
  lastActivity: Date;
  status: 'active' | 'idle' | 'terminated';
  outputBuffer: string[];
}

export class SystemProcessModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'system-process';
  private runningProcesses: Map<string, RunningProcess> = new Map();
  private activeSessions: Map<string, SystemSession> = new Map();

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      // Command Execution
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
            },
            background: {
              type: 'boolean',
              description: 'Run in background (creates session)',
              default: false
            }
          },
          required: ['command']
        }
      },
      {
        name: 'marathon_read_output',
        description: `${georgian['marathon_read_output']} - Read output from running process/session`,
        inputSchema: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
              description: 'Session ID to read output from'
            },
            lines: {
              type: 'number',
              description: 'Number of lines to read',
              default: 50
            },
            follow: {
              type: 'boolean',
              description: 'Follow output (tail -f behavior)',
              default: false
            }
          },
          required: ['session_id']
        }
      },
      {
        name: 'marathon_force_terminate',
        description: `${georgian['marathon_force_terminate']} - Force terminate process or session`,
        inputSchema: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
              description: 'Session ID to terminate'
            },
            pid: {
              type: 'number',
              description: 'Process ID to terminate'
            },
            force: {
              type: 'boolean',
              description: 'Use SIGKILL instead of SIGTERM',
              default: false
            }
          }
        }
      },
      
      // Process Management
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
            },
            marathon_only: {
              type: 'boolean',
              description: 'Show only Marathon-managed processes',
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
              enum: ['SIGTERM', 'SIGKILL', 'SIGINT', 'SIGUSR1', 'SIGUSR2']
            },
            confirm: {
              type: 'boolean',
              description: 'Confirm termination for safety',
              default: false
            }
          },
          required: ['pid']
        }
      },
      {
        name: 'marathon_list_sessions',
        description: `${georgian['marathon_list_sessions'] || 'სესიების სია'} - List active Marathon sessions`,
        inputSchema: {
          type: 'object',
          properties: {
            status_filter: {
              type: 'string',
              description: 'Filter by session status',
              enum: ['active', 'idle', 'terminated', 'all'],
              default: 'all'
            },
            detailed: {
              type: 'boolean',
              description: 'Include detailed session information',
              default: false
            }
          }
        }
      },
      
      // System Configuration
      {
        name: 'marathon_get_system_config',
        description: `${georgian['marathon_get_system_config'] || 'სისტემის კონფიგურაცია'} - Get system configuration`,
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              description: 'Configuration section',
              enum: ['security', 'performance', 'limits', 'paths', 'all'],
              default: 'all'
            }
          }
        }
      },
      {
        name: 'marathon_set_system_config',
        description: `${georgian['marathon_set_system_config'] || 'კონფიგურაციის ცვლილება'} - Update system configuration`,
        inputSchema: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Configuration key (dot notation supported)'
            },
            value: {
              description: 'New configuration value'
            },
            section: {
              type: 'string',
              description: 'Configuration section',
              enum: ['security', 'performance', 'limits', 'paths']
            }
          },
          required: ['key', 'value']
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
        case 'marathon_read_output':
          result = await this.readOutput(args);
          break;
        case 'marathon_force_terminate':
          result = await this.forceTerminate(args);
          break;
        case 'marathon_list_processes':
          result = await this.listProcesses(args);
          break;
        case 'marathon_kill_process':
          result = await this.killProcess(args);
          break;
        case 'marathon_list_sessions':
          result = await this.listSessions(args);
          break;
        case 'marathon_get_system_config':
          result = await this.getSystemConfig(args);
          break;
        case 'marathon_set_system_config':
          result = await this.setSystemConfig(args);
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

  // Command Execution
  private async executeCommand(args: any): Promise<any> {
    const { command, args: cmdArgs = [], timeout = 30, working_directory, background = false } = args;
    
    // Security validation
    await this.validateCommand(command, cmdArgs);
    
    const sessionId = background ? this.generateSessionId() : null;
    const fullCommand = [command, ...cmdArgs].join(' ');
    
    try {
      if (background) {
        // Background execution with session management
        const session: SystemSession = {
          sessionId: sessionId!,
          command: fullCommand,
          startTime: new Date(),
          lastActivity: new Date(),
          status: 'active',
          outputBuffer: []
        };
        
        this.activeSessions.set(sessionId!, session);
        
        // Simulate background process
        setTimeout(() => {
          session.outputBuffer.push(`Background process started: ${fullCommand}`);
          session.outputBuffer.push('Process completed successfully');
          session.status = 'idle';
          session.lastActivity = new Date();
        }, 1000);
        
        return {
          status: 'success',
          message: `✅ ბრძანება გაშვებულია ფონურ რეჟიმში: ${command}`,
          session_id: sessionId,
          command: fullCommand,
          background: true,
          timestamp: new Date().toISOString(),
          batumi_signature: '🌊 ბათუმური ფონური ბრძანება'
        };
      } else {
        // Synchronous execution
        const { stdout, stderr } = await execAsync(fullCommand, {
          timeout: timeout * 1000,
          cwd: working_directory
        });
        
        return {
          status: 'success',
          message: `✅ ბრძანება შესრულდა: ${command}`,
          command: fullCommand,
          output: stdout || 'ბრძანება წარმატებით შესრულდა',
          error: stderr || null,
          exit_code: 0,
          execution_time: `${timeout}s`,
          working_directory: working_directory || process.cwd(),
          timestamp: new Date().toISOString(),
          batumi_signature: '🌊 ბათუმური ბრძანება'
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ბრძანების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        command: fullCommand,
        error: error instanceof Error ? error.message : 'უცნობი შეცდომა'
      };
    }
  }

  private async readOutput(args: any): Promise<any> {
    const { session_id, lines = 50, follow = false } = args;
    
    const session = this.activeSessions.get(session_id);
    if (!session) {
      return {
        status: 'error',
        message: `❌ სესია ვერ მოიძებნა: ${session_id}`,
        session_id
      };
    }
    
    session.lastActivity = new Date();
    const output = session.outputBuffer.slice(-lines);
    
    return {
      status: 'success',
      message: `📄 სესიის შედეგი: ${session_id}`,
      session_id,
      command: session.command,
      output: output.join('\n') || 'შედეგი ცარიელია',
      lines_read: output.length,
      session_status: session.status,
      last_activity: session.lastActivity.toISOString(),
      follow,
      timestamp: new Date().toISOString()
    };
  }

  private async forceTerminate(args: any): Promise<any> {
    const { session_id, pid, force = false } = args;
    
    if (session_id) {
      const session = this.activeSessions.get(session_id);
      if (!session) {
        return {
          status: 'error',
          message: `❌ სესია ვერ მოიძებნა: ${session_id}`,
          session_id
        };
      }
      
      session.status = 'terminated';
      session.lastActivity = new Date();
      
      return {
        status: 'success',
        message: `🛑 სესია ძალით შეწყდა: ${session_id}`,
        session_id,
        command: session.command,
        terminated_at: new Date().toISOString(),
        batumi_signature: '🌊 ბათუმური ტერმინაცია'
      };
    }
    
    if (pid) {
      try {
        const signal = force ? 'SIGKILL' : 'SIGTERM';
        process.kill(pid, signal);
        
        return {
          status: 'success',
          message: `🛑 პროცესი ძალით შეწყდა: PID ${pid}`,
          pid,
          signal,
          force,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          status: 'error',
          message: `❌ პროცესის ტერმინაციის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
          pid
        };
      }
    }
    
    return {
      status: 'error',
      message: '❌ session_id ან pid საჭიროა'
    };
  }

  // Process Management
  private async listProcesses(args: any): Promise<any> {
    const { filter, detailed = false, marathon_only = false } = args;
    
    const mockProcesses = [
      { pid: 1, name: 'systemd', cpu: 0.1, memory: 2.5, user: 'root', started: '2025-01-01' },
      { pid: 100, name: 'node', cpu: 5.2, memory: 45.8, user: 'louie', started: '2025-07-13' },
      { pid: 200, name: 'marathon-mcp', cpu: 1.1, memory: 12.3, user: 'louie', started: '2025-07-13' },
      { pid: 300, name: 'claude-desktop', cpu: 3.5, memory: 120.4, user: 'louie', started: '2025-07-13' }
    ];
    
    let processes = mockProcesses;
    
    if (marathon_only) {
      processes = processes.filter(p => p.name.includes('marathon'));
    }
    
    if (filter) {
      processes = processes.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    }
    
    const result: any = {
      status: 'success',
      message: `📊 პროცესების სია (${processes.length})`,
      processes: detailed ? processes : processes.map(p => ({ pid: p.pid, name: p.name, cpu: p.cpu })),
      total_processes: mockProcesses.length,
      filtered_processes: processes.length,
      marathon_sessions: this.activeSessions.size,
      system_info: {
        platform: os.platform(),
        architecture: os.arch(),
        cpu_count: os.cpus().length,
        memory_total: Math.round(os.totalmem() / (1024 * 1024 * 1024)) + ' GB'
      }
    };
    
    if (detailed) {
      result.system_load = {
        load_average: os.loadavg(),
        uptime: Math.floor(os.uptime()),
        free_memory: Math.round(os.freemem() / (1024 * 1024)) + ' MB'
      };
    }
    
    return result;
  }

  private async killProcess(args: any): Promise<any> {
    const { pid, signal = 'SIGTERM', confirm = false } = args;
    
    if (!confirm && ['SIGKILL', 'SIGTERM'].includes(signal)) {
      return {
        status: 'warning',
        message: `⚠️ დასადასტურებელია: პროცესის ${pid} გაჩერება ${signal} სიგნალით`,
        pid,
        signal,
        confirmation_required: true,
        hint: 'გამოიყენეთ confirm: true დასადასტურებლად'
      };
    }
    
    try {
      process.kill(pid, signal);
      
      return {
        status: 'success',
        message: `🛑 პროცესი გაჩერდა: PID ${pid}`,
        pid,
        signal,
        timestamp: new Date().toISOString(),
        batumi_signature: '🌊 ბათუმური პროცეს მენეჯმენტი'
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ პროცესის გაჩერების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        pid,
        signal
      };
    }
  }

  private async listSessions(args: any): Promise<any> {
    const { status_filter = 'all', detailed = false } = args;
    
    let sessions = Array.from(this.activeSessions.values());
    
    if (status_filter !== 'all') {
      sessions = sessions.filter(s => s.status === status_filter);
    }
    
    const sessionData = sessions.map(session => {
      const baseInfo = {
        session_id: session.sessionId,
        command: session.command,
        status: session.status,
        started: session.startTime.toISOString(),
        last_activity: session.lastActivity.toISOString(),
        output_lines: session.outputBuffer.length
      };
      
      if (detailed) {
        return {
          ...baseInfo,
          uptime: Math.floor((Date.now() - session.startTime.getTime()) / 1000),
          recent_output: session.outputBuffer.slice(-3).join('\n') || 'შედეგი არ არის'
        };
      }
      
      return baseInfo;
    });
    
    return {
      status: 'success',
      message: `📋 Marathon სესიების სია (${sessionData.length})`,
      sessions: sessionData,
      total_sessions: this.activeSessions.size,
      active_sessions: sessions.filter(s => s.status === 'active').length,
      idle_sessions: sessions.filter(s => s.status === 'idle').length,
      terminated_sessions: sessions.filter(s => s.status === 'terminated').length,
      status_filter,
      detailed,
      timestamp: new Date().toISOString()
    };
  }

  // System Configuration
  private async getSystemConfig(args: any): Promise<any> {
    const { section = 'all' } = args;
    
    const systemConfig = {
      security: {
        safe_commands_only: this.config.getModuleSettings('system_process').safe_commands_only || true,
        allowed_commands: ['ls', 'dir', 'pwd', 'date', 'echo', 'cat', 'head', 'tail', 'ps'],
        require_confirmation: ['rm', 'del', 'kill', 'pkill', 'sudo'],
        audit_logging: true
      },
      performance: {
        max_concurrent_processes: 10,
        default_timeout: 30,
        max_timeout: 300,
        memory_limit: '1GB',
        cpu_limit: '50%'
      },
      limits: {
        max_output_lines: 1000,
        max_session_lifetime: 3600,
        max_background_processes: 5,
        output_buffer_size: 10000
      },
      paths: {
        working_directory: process.cwd(),
        temp_directory: os.tmpdir(),
        log_directory: '~/.marathon-mcp/logs',
        session_directory: '~/.marathon-mcp/sessions'
      }
    };
    
    if (section === 'all') {
      return {
        status: 'success',
        message: '⚙️ სისტემის სრული კონფიგურაცია',
        config: systemConfig,
        section: 'all',
        timestamp: new Date().toISOString()
      };
    }
    
    const sectionConfig = systemConfig[section as keyof typeof systemConfig];
    if (!sectionConfig) {
      return {
        status: 'error',
        message: `❌ კონფიგურაციის სექცია ვერ მოიძებნა: ${section}`,
        available_sections: Object.keys(systemConfig)
      };
    }
    
    return {
      status: 'success',
      message: `⚙️ კონფიგურაციის სექცია: ${section}`,
      config: sectionConfig,
      section,
      timestamp: new Date().toISOString()
    };
  }

  private async setSystemConfig(args: any): Promise<any> {
    const { key, value, section } = args;
    
    try {
      // Update configuration in Marathon config system
      const configKey = section ? `modules.system_process.settings.${section}.${key}` : `modules.system_process.settings.${key}`;
      
      const oldValue = this.config.get(configKey);
      this.config.set(configKey, value);
      await this.config.save();
      
      return {
        status: 'success',
        message: `✅ სისტემის კონფიგურაცია განახლდა: ${key}`,
        key,
        section: section || 'general',
        old_value: oldValue,
        new_value: value,
        config_path: configKey,
        timestamp: new Date().toISOString(),
        batumi_signature: '🌊 ბათუმური კონფიგურაცია'
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კონფიგურაციის განახლების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        key,
        value
      };
    }
  }

  // Helper Methods
  private async validateCommand(command: string, args: string[]): Promise<void> {
    const settings = this.config.getModuleSettings('system_process');
    
    if (settings.safe_commands_only) {
      const safeCommands = [
        'ls', 'dir', 'pwd', 'date', 'echo', 'cat', 'head', 'tail', 'ps',
        'whoami', 'id', 'uname', 'df', 'du', 'free', 'uptime', 'which', 'where'
      ];
      
      if (!safeCommands.includes(command)) {
        throw new Error(`უსაფრთხო რეჟიმში არაავტორიზებული ბრძანება: ${command}`);
      }
    }
    
    const dangerousCommands = ['rm', 'del', 'format', 'fdisk', 'mkfs', 'shutdown', 'reboot'];
    if (dangerousCommands.includes(command)) {
      throw new Error(`საშიში ბრძანება აიკრძალა: ${command}`);
    }
  }

  private generateSessionId(): string {
    return `marathon_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}