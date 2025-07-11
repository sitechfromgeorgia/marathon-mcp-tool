/**
 * 📁 File System Management Module v1.0.0
 * ფაილების მენეჯმენტის მოდული
 * 
 * 🚧 Development Phase - Basic file operations
 * 🚧 განვითარების ფაზა - ძირითადი ფაილური ოპერაციები
 * 
 * Read Operations:
 * - marathon_read_file - ფაილის წაკითხვა / Read file
 * - marathon_read_multiple_files - მრავალი ფაილის წაკითხვა / Read multiple files
 * - marathon_get_file_info - ფაილის ინფორმაცია / File information
 * 
 * Write Operations:
 * - marathon_write_file - ფაილში ჩაწერა / Write to file
 * - marathon_edit_file - ფაილის რედაქტირება / Edit file
 * - marathon_edit_block - ბლოკური რედაქტირება / Block editing
 * 
 * Directory Management:
 * - marathon_create_directory - დირექტორიის შექმნა / Create directory
 * - marathon_list_directory - დირექტორიის სია / List directory
 * - marathon_directory_tree - დირექტორიის ხე / Directory tree
 * - marathon_move_file - ფაილის გადატანა / Move file
 * 
 * Search Operations:
 * - marathon_search_files - ფაილების ძიება / Search files
 * - marathon_search_code - კოდის ძიება / Search code
 */

import { promises as fs } from 'fs';
import { join, dirname, basename, extname, resolve, relative } from 'path';
import { homedir } from 'os';
import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

export class FileSystemModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'file-system';

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      // Read Operations
      {
        name: 'marathon_read_file',
        description: `${georgian['marathon_read_file']} - Read file contents with encoding support`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'File path to read / წასაკითხი ფაილის გზა'
            },
            encoding: {
              type: 'string',
              description: 'File encoding / ფაილის კოდირება',
              default: 'utf-8',
              enum: ['utf-8', 'ascii', 'binary', 'base64']
            },
            lines: {
              type: 'object',
              description: 'Line range to read / წასაკითხი ხაზების დიაპაზონი',
              properties: {
                start: { type: 'number', description: 'Start line (1-based) / საწყისი ხაზი' },
                end: { type: 'number', description: 'End line (1-based) / ბოლო ხაზი' }
              }
            }
          },
          required: ['path']
        }
      },
      {
        name: 'marathon_write_file',
        description: `${georgian['marathon_write_file']} - Write content to file`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'File path to write / ჩასაწერი ფაილის გზა'
            },
            content: {
              type: 'string',
              description: 'Content to write / ჩასაწერი კონტენტი'
            },
            encoding: {
              type: 'string',
              description: 'File encoding / ფაილის კოდირება',
              default: 'utf-8'
            },
            backup: {
              type: 'boolean',
              description: 'Create backup before writing / ჩაწერამდე backup-ის შექმნა',
              default: true
            },
            mode: {
              type: 'string',
              description: 'Write mode / ჩაწერის რეჟიმი',
              enum: ['write', 'append'],
              default: 'write'
            }
          },
          required: ['path', 'content']
        }
      },
      {
        name: 'marathon_create_directory',
        description: `${georgian['marathon_create_directory']} - Create directory structure`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Directory path to create / შესაქმნელი დირექტორიის გზა'
            },
            recursive: {
              type: 'boolean',
              description: 'Create parent directories if needed / მშობელი დირექტორიების შექმნა',
              default: true
            }
          },
          required: ['path']
        }
      },
      {
        name: 'marathon_list_directory',
        description: `${georgian['marathon_list_directory']} - List directory contents`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Directory path to list / ჩამოსათვალი დირექტორიის გზა'
            },
            detailed: {
              type: 'boolean',
              description: 'Include detailed file information / დეტალური ინფორმაცია',
              default: false
            },
            filter: {
              type: 'object',
              description: 'Filter options / ფილტრაციის ოფცია',
              properties: {
                extensions: { type: 'array', items: { type: 'string' } },
                hidden: { type: 'boolean', default: false },
                type: { type: 'string', enum: ['file', 'directory', 'all'], default: 'all' }
              }
            }
          },
          required: ['path']
        }
      },
      {
        name: 'marathon_search_files',
        description: `${georgian['marathon_search_files']} - Search for files by name/pattern`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Root path to search from / ძიების საწყისი გზა'
            },
            pattern: {
              type: 'string',
              description: 'Search pattern (supports wildcards) / ძიების შაბლონი'
            },
            options: {
              type: 'object',
              properties: {
                case_sensitive: { type: 'boolean', default: false },
                max_results: { type: 'number', default: 50 }, // Reduced for development
                include_hidden: { type: 'boolean', default: false },
                file_types: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          required: ['path', 'pattern']
        }
      }
    ];
  }

  public async handleTool(name: string, args: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      await this.logger.logFunctionCall(name, args, this.moduleName);
      
      // Security check
      if (!this.config.isModuleEnabled('file_system')) {
        throw new Error('ფაილების მოდული გამორთულია / File system module is disabled');
      }
      
      let result;
      
      switch (name) {
        case 'marathon_read_file':
          result = await this.readFile(args);
          break;
        case 'marathon_write_file':
          result = await this.writeFile(args);
          break;
        case 'marathon_create_directory':
          result = await this.createDirectory(args);
          break;
        case 'marathon_list_directory':
          result = await this.listDirectory(args);
          break;
        case 'marathon_search_files':
          result = await this.searchFiles(args);
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

  private async readFile(args: any): Promise<any> {
    const { path, encoding = 'utf-8', lines } = args;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      let content = await fs.readFile(resolvedPath, encoding);
      
      if (lines) {
        const allLines = content.split('\n');
        const start = Math.max(0, (lines.start || 1) - 1);
        const end = Math.min(allLines.length, lines.end || allLines.length);
        content = allLines.slice(start, end).join('\n');
      }
      
      const stats = await fs.stat(resolvedPath);
      
      return {
        status: 'success',
        message: `✅ ფაილი წარმატებით წაიკითხა: ${basename(path)} / File read successfully: ${basename(path)}`,
        path: resolvedPath,
        content,
        size: stats.size,
        encoding,
        lines_read: lines ? `${lines.start || 1}-${lines.end || 'end'}` : 'all',
        development_mode: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფაილის წაკითხვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / File read error`,
        path,
        development_mode: true
      };
    }
  }

  private async writeFile(args: any): Promise<any> {
    const { path, content, encoding = 'utf-8', backup = true, mode = 'write' } = args;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      // Create backup if requested and file exists
      if (backup && mode === 'write') {
        try {
          await fs.access(resolvedPath);
          const backupPath = `${resolvedPath}.backup.${Date.now()}`;
          await fs.copyFile(resolvedPath, backupPath);
        } catch {
          // File doesn't exist, no backup needed
        }
      }
      
      // Ensure directory exists
      await fs.mkdir(dirname(resolvedPath), { recursive: true });
      
      if (mode === 'append') {
        await fs.appendFile(resolvedPath, content, encoding);
      } else {
        await fs.writeFile(resolvedPath, content, encoding);
      }
      
      const stats = await fs.stat(resolvedPath);
      
      return {
        status: 'success',
        message: `✅ ფაილი წარმატებით ${mode === 'append' ? 'განახლდა' : 'შეიქმნა'}: ${basename(path)} / File ${mode === 'append' ? 'updated' : 'created'} successfully`,
        path: resolvedPath,
        size: stats.size,
        mode,
        encoding,
        backup_created: backup && mode === 'write',
        development_mode: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფაილის ჩაწერის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / File write error`,
        path,
        development_mode: true
      };
    }
  }

  private async createDirectory(args: any): Promise<any> {
    const { path, recursive = true } = args;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      await fs.mkdir(resolvedPath, { recursive });
      
      return {
        status: 'success',
        message: `✅ დირექტორია წარმატებით შეიქმნა: ${basename(path)} / Directory created successfully: ${basename(path)}`,
        path: resolvedPath,
        recursive,
        development_mode: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ დირექტორიის შექმნის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Directory creation error`,
        path,
        development_mode: true
      };
    }
  }

  private async listDirectory(args: any): Promise<any> {
    const { path, detailed = false, filter = {} } = args;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      const items = await fs.readdir(resolvedPath);
      
      const results = await Promise.allSettled(
        items.map(async (item) => {
          const itemPath = join(resolvedPath, item);
          const stats = await fs.stat(itemPath);
          
          const itemInfo: any = {
            name: item,
            path: itemPath,
            type: stats.isFile() ? 'file' : stats.isDirectory() ? 'directory' : 'other',
            size: stats.size,
            modified: stats.mtime.toISOString()
          };
          
          if (detailed) {
            itemInfo.created = stats.birthtime.toISOString();
            itemInfo.accessed = stats.atime.toISOString();
            
            if (stats.isFile()) {
              itemInfo.extension = extname(item);
            }
          }
          
          return itemInfo;
        })
      );
      
      let filteredItems = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value);
      
      // Apply filters
      if (filter.type && filter.type !== 'all') {
        filteredItems = filteredItems.filter(item => item.type === filter.type);
      }
      
      if (filter.extensions) {
        filteredItems = filteredItems.filter(item => 
          item.type === 'directory' || 
          filter.extensions.includes(item.extension?.substring(1))
        );
      }
      
      if (!filter.hidden) {
        filteredItems = filteredItems.filter(item => !item.name.startsWith('.'));
      }
      
      return {
        status: 'success',
        message: `📁 დირექტორია წარმატებით ჩაიტვირთა: ${basename(path)} / Directory loaded successfully: ${basename(path)}`,
        path: resolvedPath,
        items: filteredItems,
        total_items: filteredItems.length,
        detailed,
        filters_applied: filter,
        development_mode: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ დირექტორიის ჩატვირთვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Directory listing error`,
        path,
        development_mode: true
      };
    }
  }

  private async searchFiles(args: any): Promise<any> {
    const { path, pattern, options = {} } = args;
    const {
      case_sensitive = false,
      max_results = 50, // Reduced for development
      include_hidden = false,
      file_types = []
    } = options;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      const results: any[] = [];
      
      const searchPattern = case_sensitive ? pattern : pattern.toLowerCase();
      
      const searchRecursive = async (currentPath: string): Promise<void> => {
        if (results.length >= max_results) return;
        
        const items = await fs.readdir(currentPath);
        
        for (const item of items) {
          if (results.length >= max_results) break;
          
          if (!include_hidden && item.startsWith('.')) continue;
          
          const itemPath = join(currentPath, item);
          const stats = await fs.stat(itemPath);
          
          const itemName = case_sensitive ? item : item.toLowerCase();
          
          // Simple pattern matching (supports * wildcard)
          const regexPattern = searchPattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
          
          const regex = new RegExp(regexPattern);
          
          if (regex.test(itemName)) {
            if (file_types.length === 0 || file_types.includes(extname(item).substring(1))) {
              results.push({
                name: item,
                path: itemPath,
                type: stats.isDirectory() ? 'directory' : 'file',
                size: stats.size,
                modified: stats.mtime.toISOString(),
                relative_path: relative(resolvedPath, itemPath)
              });
            }
          }
          
          if (stats.isDirectory()) {
            await searchRecursive(itemPath);
          }
        }
      };
      
      await searchRecursive(resolvedPath);
      
      return {
        status: 'success',
        message: `🔍 ძიება დასრულდა: ${results.length} შედეგი მოიძებნა / Search completed: ${results.length} results found`,
        search_path: resolvedPath,
        pattern,
        results,
        total_found: results.length,
        options,
        development_mode: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფაილების ძიების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / File search error`,
        path,
        pattern,
        development_mode: true
      };
    }
  }

  private validatePath(path: string): void {
    const settings = this.config.getModuleSettings('file_system');
    const allowedDirs = settings.allowed_directories || [
      homedir(),
      join(homedir(), 'Documents'),
      join(homedir(), 'Desktop'),
      join(homedir(), 'Downloads')
    ];
    
    if (settings.safe_mode && !allowedDirs.some(dir => path.startsWith(dir))) {
      throw new Error(`მიუწვდომელი გზა უსაფრთხო რეჟიმში: ${path} / Inaccessible path in safe mode: ${path}`);
    }
  }
}