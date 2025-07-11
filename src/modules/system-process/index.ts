/**
 * ⚙️ System & Process Management Module
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

import { spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';
import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

const execPromise = promisify(exec);

interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  command: string;
}

interface SessionInfo {
  id: string;
  pid: number;
  command: string;
  status: 'running' | 'finished' | 'error';
  startTime: string;
  output?: string;
}

export class SystemProcessModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'system-process';
  private activeSessions: Map<string, SessionInfo> = new Map();
  private activeProcesses: Map<number, ChildProcess> = new Map();

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
        description: `${georgian['marathon_execute_command']} - Execute system commands with timeout`,
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'Command to execute'
            },
            timeout: {
              type: 'number',
              description: 'Timeout in milliseconds',
              default: 30000
            },
            working_directory: {
              type: 'string',
              description: 'Working directory for command execution'
            },
            environment: {
              type: 'object',
              description: 'Environment variables'
            },
            background: {
              type: 'boolean',
              description: 'Run command in background',
              default: false
            }
          },
          required: ['command']
        }
      },
      {
        name: 'marathon_read_output',
        description: `${georgian['marathon_read_output']} - Read output from running process`,
        inputSchema: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
              description: 'Session ID from background process'
            },
            timeout: {
              type: 'number',
              description: 'Timeout to wait for new output',
              default: 5000
            }
          },
          required: ['session_id']
        }
      },
      {
        name: 'marathon_force_terminate',
        description: `${georgian['marathon_force_terminate']} - Force terminate running process`,
        inputSchema: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
              description: 'Session ID to terminate'
            },
            signal: {
              type: 'string',
              description: 'Signal to send',
              enum: ['SIGTERM', 'SIGKILL', 'SIGINT'],
              default: 'SIGTERM'
            }
          },
          required: ['session_id']
        }
      },
      
      // Process Management
      {
        name: 'marathon_list_processes',
        description: `${georgian['marathon_list_processes']} - List running system processes`,
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'object',
              properties: {
                name_pattern: { type: 'string', description: 'Process name pattern' },
                min_cpu: { type: 'number', description: 'Minimum CPU usage %' },
                min_memory: { type: 'number', description: 'Minimum memory usage MB' },
                limit: { type: 'number', default: 20, description: 'Max results' }
              }
            },
            sort_by: {
              type: 'string',
              enum: ['cpu', 'memory', 'name', 'pid'],
              default: 'cpu'
            }
          }
        }
      },
      {
        name: 'marathon_kill_process',
        description: `${georgian['marathon_kill_process']} - Terminate system process by PID`,
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
              enum: ['SIGTERM', 'SIGKILL', 'SIGINT'],
              default: 'SIGTERM'
            },
            force: {
              type: 'boolean',
              description: 'Force kill with SIGKILL if SIGTERM fails',
              default: false
            }
          },
          required: ['pid']
        }
      },
      {
        name: 'marathon_list_sessions',
        description: `${georgian['marathon_list_sessions']} - List active Marathon sessions`,
        inputSchema: {
          type: 'object',
          properties: {
            include_finished: {
              type: 'boolean',
              description: 'Include finished sessions',
              default: false
            }
          }
        }
      },
      
      // System Configuration
      {
        name: 'marathon_get_system_config',
        description: `${georgian['marathon_get_system_config']} - Get system configuration`,
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              description: 'Configuration section',
              enum: ['security', 'performance', 'logging', 'all'],
              default: 'all'
            }
          }
        }
      },
      {
        name: 'marathon_set_system_config',
        description: `${georgian['marathon_set_system_config']} - Update system configuration`,
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              description: 'Configuration section',
              enum: ['security', 'performance', 'logging']
            },
            key: {
              type: 'string',
              description: 'Configuration key'
            },
            value: {
              description: 'Configuration value'
            }
          },
          required: ['section', 'key', 'value']
        }
      }
    ];
  }

  public async handleTool(name: string, args: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      await this.logger.logFunctionCall(name, args, this.moduleName);
      
      if (!this.config.isModuleEnabled('system_process')) {
        throw new Error('სისტემა და პროცესების მოდული გამორთულია');
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
    const { 
      command, 
      timeout = 30000, 
      working_directory, 
      environment = {}, 
      background = false 
    } = args;
    
    try {
      // Security check for dangerous commands
      const settings = this.config.getModuleSettings('system_process');
      const blockedCommands = settings.blocked_commands || ['rm -rf', 'sudo rm', 'format', 'del /s'];
      
      if (settings.safe_commands_only && blockedCommands.some(blocked => command.includes(blocked))) {
        return {
          status: 'error',
          message: `❌ საშიში ბრძანება დაბლოკილია: ${command}`,
          blocked_command: command,
          security_level: 'safe_commands_only'
        };
      }
      
      if (background) {
        return await this.executeBackgroundCommand(command, working_directory, environment);
      }
      
      const options: any = {
        timeout,
        encoding: 'utf8'
      };
      
      if (working_directory) {
        options.cwd = working_directory;
      }
      
      if (Object.keys(environment).length > 0) {
        options.env = { ...process.env, ...environment };
      }
      
      const { stdout, stderr } = await execPromise(command, options);
      
      return {
        status: 'success',
        message: `✅ ბრძანება შესრულდა: ${command}`,
        command,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exit_code: 0,
        execution_time: Date.now() - Date.now(),
        working_directory,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `❌ ბრძანების შეცდომა: ${error.message}`,
        command,
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        exit_code: error.code || -1,
        signal: error.signal,
        timeout_exceeded: error.killed || false
      };
    }
  }

  private async executeBackgroundCommand(command: string, cwd?: string, env?: any): Promise<any> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const childProcess = spawn('sh', ['-c', command], {
        cwd,
        env: env ? { ...process.env, ...env } : process.env,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      const session: SessionInfo = {
        id: sessionId,
        pid: childProcess.pid || -1,
        command,
        status: 'running',
        startTime: new Date().toISOString(),
        output: ''
      };
      
      this.activeSessions.set(sessionId, session);
      this.activeProcesses.set(childProcess.pid || -1, childProcess);
      
      let output = '';
      
      childProcess.stdout?.on('data', (data) => {
        output += data.toString();
        session.output = output;
      });
      
      childProcess.stderr?.on('data', (data) => {
        output += `STDERR: ${data.toString()}`;
        session.output = output;
      });
      
      childProcess.on('close', (code) => {
        session.status = code === 0 ? 'finished' : 'error';
        this.activeProcesses.delete(childProcess.pid || -1);
      });
      
      return {
        status: 'success',
        message: `✅ ფონური პროცესი დაიწყო: ${command}`,
        session_id: sessionId,
        pid: childProcess.pid,
        command,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფონური პროცესის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        command,
        session_id: sessionId
      };
    }
  }

  private async readOutput(args: any): Promise<any> {
    const { session_id, timeout = 5000 } = args;
    
    try {
      const session = this.activeSessions.get(session_id);
      
      if (!session) {
        return {
          status: 'error',
          message: `❌ სესია ვერ მოიძებნა: ${session_id}`,
          session_id
        };
      }
      
      // Wait for new output if process is still running
      if (session.status === 'running') {
        await new Promise(resolve => setTimeout(resolve, Math.min(timeout, 1000)));
      }
      
      return {
        status: 'success',
        message: `📖 სესიის შედეგი: ${session_id}`,
        session_id,
        command: session.command,
        output: session.output || '',
        process_status: session.status,
        pid: session.pid,
        start_time: session.startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ შედეგის წაკითხვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        session_id
      };
    }
  }

  private async forceTerminate(args: any): Promise<any> {
    const { session_id, signal = 'SIGTERM' } = args;
    
    try {
      const session = this.activeSessions.get(session_id);
      
      if (!session) {
        return {
          status: 'error',
          message: `❌ სესია ვერ მოიძებნა: ${session_id}`,
          session_id
        };
      }
      
      const childProcess = this.activeProcesses.get(session.pid);
      
      if (!childProcess) {
        return {
          status: 'warning',
          message: `⚠️ პროცესი უკვე დამთავრებულია: ${session_id}`,
          session_id,
          process_status: session.status
        };
      }
      
      childProcess.kill(signal);
      session.status = 'error';
      
      return {
        status: 'success',
        message: `✅ პროცესი შეწყვეტილია: ${session_id}`,
        session_id,
        pid: session.pid,
        signal,
        command: session.command,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ პროცესის შეწყვეტის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        session_id
      };
    }
  }

  // Process Management
  private async listProcesses(args: any): Promise<any> {
    const { filter = {}, sort_by = 'cpu' } = args;
    
    try {
      let command: string;
      
      if (process.platform === 'win32') {
        command = 'tasklist /fo csv';
      } else {
        command = 'ps -eo pid,ppid,pcpu,pmem,comm,command --sort=-pcpu';
      }
      
      const { stdout } = await execPromise(command);
      const processes: ProcessInfo[] = [];
      
      if (process.platform === 'win32') {
        // Parse Windows tasklist output
        const lines = stdout.trim().split('\n').slice(1);
        
        for (const line of lines) {
          const parts = line.split(',').map(p => p.replace(/"/g, ''));
          if (parts.length >= 5) {
            processes.push({
              pid: parseInt(parts[1]) || 0,
              name: parts[0] || '',
              cpu: 0, // Windows tasklist doesn't provide CPU %
              memory: parseInt(parts[4]?.replace(/[^0-9]/g, '')) || 0,
              command: parts[0] || ''
            });
          }
        }
      } else {
        // Parse Unix ps output
        const lines = stdout.trim().split('\n').slice(1);
        
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 6) {
            processes.push({
              pid: parseInt(parts[0]) || 0,
              name: parts[4] || '',
              cpu: parseFloat(parts[2]) || 0,
              memory: parseFloat(parts[3]) || 0,
              command: parts.slice(5).join(' ') || parts[4] || ''
            });
          }
        }
      }
      
      let filteredProcesses = processes;
      
      // Apply filters
      if (filter.name_pattern) {
        filteredProcesses = filteredProcesses.filter(p => 
          p.name.toLowerCase().includes(filter.name_pattern.toLowerCase()) ||
          p.command.toLowerCase().includes(filter.name_pattern.toLowerCase())
        );
      }
      
      if (filter.min_cpu) {
        filteredProcesses = filteredProcesses.filter(p => p.cpu >= filter.min_cpu);
      }
      
      if (filter.min_memory) {
        filteredProcesses = filteredProcesses.filter(p => p.memory >= filter.min_memory);
      }
      
      // Sort processes
      filteredProcesses.sort((a, b) => {
        switch (sort_by) {
          case 'cpu': return b.cpu - a.cpu;
          case 'memory': return b.memory - a.memory;
          case 'name': return a.name.localeCompare(b.name);
          case 'pid': return a.pid - b.pid;
          default: return b.cpu - a.cpu;
        }
      });
      
      if (filter.limit) {
        filteredProcesses = filteredProcesses.slice(0, filter.limit);
      }
      
      return {
        status: 'success',
        message: `📊 პროცესების სია: ${filteredProcesses.length} პროცესი`,
        total_processes: processes.length,
        filtered_processes: filteredProcesses.length,
        processes: filteredProcesses,
        filter_applied: filter,
        sort_by,
        platform: process.platform,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ პროცესების სიის მიღების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`
      };
    }
  }

  private async killProcess(args: any): Promise<any> {
    const { pid, signal = 'SIGTERM', force = false } = args;
    
    try {
      if (process.platform === 'win32') {
        const command = force ? `taskkill /F /PID ${pid}` : `taskkill /PID ${pid}`;
        await execPromise(command);
      } else {
        process.kill(pid, signal);
        
        if (force && signal !== 'SIGKILL') {
          // Wait a bit then force kill if needed
          setTimeout(() => {
            try {
              process.kill(pid, 'SIGKILL');
            } catch {
              // Process may already be dead
            }
          }, 3000);
        }
      }
      
      return {
        status: 'success',
        message: `✅ პროცესი შეწყვეტილია: PID ${pid}`,
        pid,
        signal,
        force,
        platform: process.platform,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `❌ პროცესის შეწყვეტის შეცდომა: ${error.message}`,
        pid,
        error_code: error.code,
        error_details: error.message
      };
    }
  }

  private async listSessions(args: any): Promise<any> {
    const { include_finished = false } = args;
    
    try {
      let sessions = Array.from(this.activeSessions.values());
      
      if (!include_finished) {
        sessions = sessions.filter(s => s.status === 'running');
      }
      
      return {
        status: 'success',
        message: `📋 სესიების სია: ${sessions.length} სესია`,
        total_sessions: this.activeSessions.size,
        active_sessions: sessions.filter(s => s.status === 'running').length,
        sessions: sessions.map(session => ({
          id: session.id,
          pid: session.pid,
          command: session.command.substring(0, 50) + (session.command.length > 50 ? '...' : ''),
          status: session.status,
          start_time: session.startTime,
          output_size: session.output?.length || 0
        })),
        include_finished,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ სესიების სიის მიღების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`
      };
    }
  }

  // System Configuration
  private async getSystemConfig(args: any): Promise<any> {
    const { section = 'all' } = args;
    
    try {
      const systemConfig = {
        security: {
          safe_commands_only: this.config.getModuleSettings('system_process').safe_commands_only || true,
          blocked_commands: this.config.getModuleSettings('system_process').blocked_commands || [],
          max_concurrent_processes: this.config.getModuleSettings('system_process').max_concurrent_processes || 10,
          timeout_seconds: this.config.getModuleSettings('system_process').timeout_seconds || 30
        },
        performance: {
          memory_limit_mb: process.memoryUsage().heapUsed / 1024 / 1024,
          cpu_usage: process.cpuUsage(),
          uptime_seconds: process.uptime(),
          node_version: process.version,
          platform: process.platform
        },
        logging: {
          log_level: this.config.get('logging.level') || 'info',
          log_file_size: this.config.get('logging.max_file_size') || '10MB',
          log_retention_days: this.config.get('logging.retention_days') || 30
        }
      };
      
      if (section === 'all') {
        return {
          status: 'success',
          message: '⚙️ სრული სისტემის კონფიგურაცია',
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
          available_sections: ['security', 'performance', 'logging', 'all']
        };
      }
      
      return {
        status: 'success',
        message: `⚙️ სისტემის კონფიგურაცია: ${section}`,
        config: sectionConfig,
        section,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კონფიგურაციის მიღების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        section
      };
    }
  }

  private async setSystemConfig(args: any): Promise<any> {
    const { section, key, value } = args;
    
    try {
      const configPath = `modules.system_process.settings.${key}`;
      const oldValue = this.config.get(configPath);
      
      // Validate configuration changes
      if (section === 'security') {
        if (key === 'safe_commands_only' && typeof value !== 'boolean') {
          return {
            status: 'error',
            message: '❌ safe_commands_only უნდა იყოს boolean მნიშვნელობა',
            key,
            provided_value: value,
            expected_type: 'boolean'
          };
        }
        
        if (key === 'blocked_commands' && !Array.isArray(value)) {
          return {
            status: 'error',
            message: '❌ blocked_commands უნდა იყოს array',
            key,
            provided_value: value,
            expected_type: 'array'
          };
        }
      }
      
      // Set the configuration
      this.config.set(configPath, value);
      await this.config.save();
      
      return {
        status: 'success',
        message: `✅ კონფიგურაცია განახლდა: ${section}.${key}`,
        section,
        key,
        old_value: oldValue,
        new_value: value,
        config_path: configPath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კონფიგურაციის განახლების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        section,
        key,
        attempted_value: value
      };
    }
  }
}