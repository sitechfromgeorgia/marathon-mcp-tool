/**
 * 🏃‍♂️ Marathon MCP Tool Logger System v1.0.0
 * 🇬🇪 ქართული ლოგირების სისტემა / Georgian Logging System
 * 
 * 🚧 Development Phase - Enhanced logging for debugging
 * 🚧 განვითარების ფაზა - გაძლიერებული ლოგირება დებაგისთვის
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  module?: string;
  function?: string;
}

export class MarathonLogger {
  private logPath: string;
  private logBuffer: LogEntry[] = [];
  private readonly maxBufferSize = 100;
  private readonly maxLogFileSize = 10 * 1024 * 1024; // 10MB
  private developmentMode: boolean = true;

  constructor() {
    this.logPath = join(homedir(), '.marathon-mcp', 'logs');
    this.ensureLogDirectory();
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.logPath, { recursive: true });
    } catch (error) {
      console.warn('⚠️ ლოგების დირექტორიის შექმნის შეცდომა: / Log directory creation error:', error);
    }
  }

  private formatTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace('T', ' ').slice(0, 19);
  }

  private getGeorgianLogLevel(level: LogLevel): string {
    const levels = {
      debug: '🔍 დებაგი / Debug',
      info: 'ℹ️ ინფო / Info',
      warn: '⚠️ გაფრთხილება / Warning',
      error: '❌ შეცდომა / Error'
    };
    return levels[level] || level;
  }

  private async log(level: LogLevel, message: string, data?: any, module?: string, functionName?: string): Promise<void> {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data,
      module,
      function: functionName
    };

    // Add to buffer
    this.logBuffer.push(entry);

    // Console output with development enhancement
    const georgianLevel = this.getGeorgianLogLevel(level);
    const modulePrefix = module ? `[${module}] ` : '';
    const functionPrefix = functionName ? `${functionName}: ` : '';
    const devPrefix = this.developmentMode ? '🚧 [DEV] ' : '';
    
    console.log(`${devPrefix}${georgianLevel} ${entry.timestamp} ${modulePrefix}${functionPrefix}${message}`);
    
    if (data && this.developmentMode) {
      console.log('📊 დამატებითი ინფორმაცია / Additional info:', data);
    }

    // Flush buffer if needed
    if (this.logBuffer.length >= this.maxBufferSize) {
      await this.flushBuffer();
    }
  }

  public async debug(message: string, data?: any, module?: string, functionName?: string): Promise<void> {
    // Always show debug in development mode
    if (this.developmentMode) {
      await this.log('debug', message, data, module, functionName);
    }
  }

  public async info(message: string, data?: any, module?: string, functionName?: string): Promise<void> {
    await this.log('info', message, data, module, functionName);
  }

  public async warn(message: string, data?: any, module?: string, functionName?: string): Promise<void> {
    await this.log('warn', message, data, module, functionName);
  }

  public async error(message: string, data?: any, module?: string, functionName?: string): Promise<void> {
    await this.log('error', message, data, module, functionName);
  }

  public async logFunctionCall(functionName: string, args: any, module: string): Promise<void> {
    const devMessage = this.developmentMode 
      ? `ფუნქცია გამოიძახა (განვითარება): ${functionName} / Function called (development): ${functionName}`
      : `ფუნქცია გამოიძახა: ${functionName} / Function called: ${functionName}`;
    
    await this.info(
      devMessage,
      { arguments: args, development_mode: this.developmentMode },
      module,
      functionName
    );
  }

  public async logFunctionResult(functionName: string, result: any, duration: number, module: string): Promise<void> {
    const devMessage = this.developmentMode
      ? `ფუნქცია შესრულდა (განვითარება): ${functionName} (${duration}ms) / Function completed (development): ${functionName} (${duration}ms)`
      : `ფუნქცია შესრულდა: ${functionName} (${duration}ms) / Function completed: ${functionName} (${duration}ms)`;
    
    await this.info(
      devMessage,
      { 
        result_type: typeof result, 
        success: true, 
        duration_ms: duration,
        development_mode: this.developmentMode
      },
      module,
      functionName
    );
  }

  public async logFunctionError(functionName: string, error: any, duration: number, module: string): Promise<void> {
    const devMessage = this.developmentMode
      ? `ფუნქციის შეცდომა (განვითარება): ${functionName} (${duration}ms) / Function error (development): ${functionName} (${duration}ms)`
      : `ფუნქციის შეცდომა: ${functionName} (${duration}ms) / Function error: ${functionName} (${duration}ms)`;
    
    await this.error(
      devMessage,
      { 
        error: error instanceof Error ? error.message : error, 
        success: false, 
        duration_ms: duration,
        development_mode: this.developmentMode,
        stack: this.developmentMode && error instanceof Error ? error.stack : undefined
      },
      module,
      functionName
    );
  }

  private async flushBuffer(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    try {
      const logFile = join(this.logPath, `marathon-v1.0.0-${new Date().toISOString().split('T')[0]}.log`);
      
      // Check file size and rotate if needed
      await this.rotateLogsIfNeeded(logFile);
      
      const logLines = this.logBuffer.map(entry => {
        const dataStr = entry.data ? ` | ${JSON.stringify(entry.data)}` : '';
        const moduleStr = entry.module ? ` [${entry.module}]` : '';
        const functionStr = entry.function ? ` ${entry.function}` : '';
        const devStr = this.developmentMode ? ' [DEV]' : '';
        
        return `${entry.timestamp}${devStr} ${entry.level.toUpperCase()}${moduleStr}${functionStr}: ${entry.message}${dataStr}`;
      }).join('\n') + '\n';

      await fs.appendFile(logFile, logLines, 'utf-8');
      this.logBuffer = [];
    } catch (error) {
      console.warn('⚠️ ლოგების ჩაწერის შეცდომა: / Log write error:', error);
    }
  }

  private async rotateLogsIfNeeded(logFile: string): Promise<void> {
    try {
      const stats = await fs.stat(logFile);
      if (stats.size > this.maxLogFileSize) {
        const rotatedFile = logFile.replace('.log', `-${Date.now()}.log`);
        await fs.rename(logFile, rotatedFile);
      }
    } catch (error) {
      // File doesn't exist yet, no rotation needed
    }
  }

  public async getRecentLogs(limit: number = 50): Promise<LogEntry[]> {
    const recentEntries = [...this.logBuffer];
    
    if (recentEntries.length < limit) {
      // Try to read from today's log file
      try {
        const todayLogFile = join(this.logPath, `marathon-v1.0.0-${new Date().toISOString().split('T')[0]}.log`);
        const logContent = await fs.readFile(todayLogFile, 'utf-8');
        
        const lines = logContent.trim().split('\n');
        const fileEntries = lines.slice(-limit).map(line => {
          const [timestamp, rest] = line.split(' ', 2);
          const [level, message] = rest.split(': ', 2);
          
          return {
            timestamp,
            level: level.toLowerCase().replace('[dev]', '').trim() as LogLevel,
            message: message || '',
          };
        });
        
        recentEntries.unshift(...fileEntries);
      } catch (error) {
        // Log file doesn't exist or can't be read
      }
    }
    
    return recentEntries.slice(-limit);
  }

  public async getStats(): Promise<Record<string, any>> {
    const recentLogs = await this.getRecentLogs(100);
    
    const stats = {
      total_logs: recentLogs.length,
      by_level: {} as Record<LogLevel, number>,
      by_module: {} as Record<string, number>,
      recent_errors: recentLogs
        .filter(log => log.level === 'error')
        .slice(-5)
        .map(log => ({ timestamp: log.timestamp, message: log.message })),
      buffer_size: this.logBuffer.length,
      log_directory: this.logPath,
      development_mode: this.developmentMode,
      version: '1.0.0'
    };

    // Count by level
    for (const log of recentLogs) {
      stats.by_level[log.level] = (stats.by_level[log.level] || 0) + 1;
    }

    // Count by module
    for (const log of recentLogs) {
      if (log.module) {
        stats.by_module[log.module] = (stats.by_module[log.module] || 0) + 1;
      }
    }

    return stats;
  }

  public setDevelopmentMode(enabled: boolean): void {
    this.developmentMode = enabled;
    this.info(`განვითარების რეჟიმი ${enabled ? 'ჩართულია' : 'გამორთულია'} / Development mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  public async cleanup(): Promise<void> {
    // Flush remaining buffer
    await this.flushBuffer();
    
    // Clean up old log files (keep last 30 days)
    try {
      const files = await fs.readdir(this.logPath);
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      
      for (const file of files) {
        if (file.startsWith('marathon-v1.0.0-') && file.endsWith('.log')) {
          const filePath = join(this.logPath, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime.getTime() < thirtyDaysAgo) {
            await fs.unlink(filePath);
            this.info(`ძველი ლოგ ფაილი წაიშალა: ${file} / Old log file deleted: ${file}`);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ ძველი ლოგების წაშლის შეცდომა: / Old logs cleanup error:', error);
    }
  }
}