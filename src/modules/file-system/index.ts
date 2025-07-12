/**
 * 📁 File System Management Module
 * ფაილების მენეჯმენტის მოდული
 * 
 * Read Operations:
 * - marathon_read_file - ფაილის წაკითხვა
 * - marathon_read_multiple_files - მრავალი ფაილის წაკითხვა
 * - marathon_get_file_info - ფაილის ინფორმაცია
 * 
 * Write Operations:
 * - marathon_write_file - ფაილში ჩაწერა
 * - marathon_edit_file - ფაილის რედაქტირება
 * - marathon_edit_block - ბლოკური რედაქტირება
 * 
 * Directory Management:
 * - marathon_create_directory - დირექტორიის შექმნა
 * - marathon_list_directory - დირექტორიის სია
 * - marathon_directory_tree - დირექტორიის ხე
 * - marathon_move_file - ფაილის გადატანა
 * 
 * Search Operations:
 * - marathon_search_files - ფაილების ძიება
 * - marathon_search_code - კოდის ძიება
 * - marathon_allowed_directories - ნებადართული დირექტორიები
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
              description: 'File path to read'
            },
            encoding: {
              type: 'string',
              description: 'File encoding',
              default: 'utf-8',
              enum: ['utf-8', 'ascii', 'binary', 'base64']
            },
            lines: {
              type: 'object',
              description: 'Line range to read',
              properties: {
                start: { type: 'number', description: 'Start line (1-based)' },
                end: { type: 'number', description: 'End line (1-based)' }
              }
            }
          },
          required: ['path']
        }
      },
      {
        name: 'marathon_read_multiple_files',
        description: `${georgian['marathon_read_multiple_files']} - Read multiple files at once`,
        inputSchema: {
          type: 'object',
          properties: {
            paths: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of file paths to read'
            },
            encoding: {
              type: 'string',
              description: 'File encoding',
              default: 'utf-8'
            }
          },
          required: ['paths']
        }
      },
      {
        name: 'marathon_get_file_info',
        description: `${georgian['marathon_get_file_info']} - Get file metadata and information`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'File or directory path'
            },
            detailed: {
              type: 'boolean',
              description: 'Include detailed information',
              default: false
            }
          },
          required: ['path']
        }
      },
      
      // Write Operations
      {
        name: 'marathon_write_file',
        description: `${georgian['marathon_write_file']} - Write content to file`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'File path to write'
            },
            content: {
              type: 'string',
              description: 'Content to write'
            },
            encoding: {
              type: 'string',
              description: 'File encoding',
              default: 'utf-8'
            },
            backup: {
              type: 'boolean',
              description: 'Create backup before writing',
              default: true
            },
            mode: {
              type: 'string',
              description: 'Write mode',
              enum: ['write', 'append'],
              default: 'write'
            }
          },
          required: ['path', 'content']
        }
      },
      {
        name: 'marathon_edit_file',
        description: `${georgian['marathon_edit_file']} - Edit file with find/replace operations`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'File path to edit'
            },
            operations: {
              type: 'array',
              description: 'Edit operations',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['replace', 'insert', 'delete'] },
                  find: { type: 'string', description: 'Text to find (for replace)' },
                  replace: { type: 'string', description: 'Replacement text' },
                  line: { type: 'number', description: 'Line number (for insert/delete)' },
                  content: { type: 'string', description: 'Content to insert' }
                }
              }
            },
            backup: {
              type: 'boolean',
              description: 'Create backup before editing',
              default: true
            }
          },
          required: ['path', 'operations']
        }
      },
      {
        name: 'marathon_edit_block',
        description: `${georgian['marathon_edit_block']} - Edit specific block of text in file`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'File path to edit'
            },
            old_text: {
              type: 'string',
              description: 'Old text block to replace'
            },
            new_text: {
              type: 'string',
              description: 'New text block'
            },
            backup: {
              type: 'boolean',
              description: 'Create backup before editing',
              default: true
            }
          },
          required: ['path', 'old_text', 'new_text']
        }
      },
      
      // Directory Management
      {
        name: 'marathon_create_directory',
        description: `${georgian['marathon_create_directory']} - Create directory structure`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Directory path to create'
            },
            recursive: {
              type: 'boolean',
              description: 'Create parent directories if needed',
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
              description: 'Directory path to list'
            },
            detailed: {
              type: 'boolean',
              description: 'Include detailed file information',
              default: false
            },
            filter: {
              type: 'object',
              description: 'Filter options',
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
        name: 'marathon_directory_tree',
        description: `${georgian['marathon_directory_tree']} - Get directory tree structure`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Root directory path'
            },
            max_depth: {
              type: 'number',
              description: 'Maximum depth to traverse',
              default: 5
            },
            include_files: {
              type: 'boolean',
              description: 'Include files in tree',
              default: true
            }
          },
          required: ['path']
        }
      },
      {
        name: 'marathon_move_file',
        description: `${georgian['marathon_move_file']} - Move or rename files/directories`,
        inputSchema: {
          type: 'object',
          properties: {
            source: {
              type: 'string',
              description: 'Source path'
            },
            destination: {
              type: 'string',
              description: 'Destination path'
            },
            overwrite: {
              type: 'boolean',
              description: 'Overwrite destination if exists',
              default: false
            }
          },
          required: ['source', 'destination']
        }
      },
      
      // Search Operations
      {
        name: 'marathon_search_files',
        description: `${georgian['marathon_search_files']} - Search for files by name/pattern`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Root path to search from'
            },
            pattern: {
              type: 'string',
              description: 'Search pattern (supports wildcards)'
            },
            options: {
              type: 'object',
              properties: {
                case_sensitive: { type: 'boolean', default: false },
                max_results: { type: 'number', default: 100 },
                include_hidden: { type: 'boolean', default: false },
                file_types: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          required: ['path', 'pattern']
        }
      },
      {
        name: 'marathon_search_code',
        description: `${georgian['marathon_search_code']} - Search for text/code within files`,
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Root path to search from'
            },
            query: {
              type: 'string',
              description: 'Text/code to search for'
            },
            options: {
              type: 'object',
              properties: {
                case_sensitive: { type: 'boolean', default: false },
                regex: { type: 'boolean', default: false },
                max_results: { type: 'number', default: 50 },
                file_extensions: { type: 'array', items: { type: 'string' } },
                context_lines: { type: 'number', default: 2 }
              }
            }
          },
          required: ['path', 'query']
        }
      },
      {
        name: 'marathon_allowed_directories',
        description: `${georgian['marathon_allowed_directories']} - Get list of allowed directories`,
        inputSchema: {
          type: 'object',
          properties: {
            add_directory: {
              type: 'string',
              description: 'Directory to add to allowed list'
            },
            remove_directory: {
              type: 'string',
              description: 'Directory to remove from allowed list'
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
      
      // Security check
      if (!this.config.isModuleEnabled('file_system')) {
        throw new Error('ფაილების მოდული გამორთულია');
      }
      
      let result;
      
      switch (name) {
        case 'marathon_read_file':
          result = await this.readFile(args);
          break;
        case 'marathon_read_multiple_files':
          result = await this.readMultipleFiles(args);
          break;
        case 'marathon_get_file_info':
          result = await this.getFileInfo(args);
          break;
        case 'marathon_write_file':
          result = await this.writeFile(args);
          break;
        case 'marathon_edit_file':
          result = await this.editFile(args);
          break;
        case 'marathon_edit_block':
          result = await this.editBlock(args);
          break;
        case 'marathon_create_directory':
          result = await this.createDirectory(args);
          break;
        case 'marathon_list_directory':
          result = await this.listDirectory(args);
          break;
        case 'marathon_directory_tree':
          result = await this.directoryTree(args);
          break;
        case 'marathon_move_file':
          result = await this.moveFile(args);
          break;
        case 'marathon_search_files':
          result = await this.searchFiles(args);
          break;
        case 'marathon_search_code':
          result = await this.searchCode(args);
          break;
        case 'marathon_allowed_directories':
          result = await this.allowedDirectories(args);
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
        message: `✅ ფაილი წარმატებით წაიკითხა: ${basename(path)}`,
        path: resolvedPath,
        content,
        size: stats.size,
        encoding,
        lines_read: lines ? `${lines.start || 1}-${lines.end || 'end'}` : 'all',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფაილის წაკითხვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path
      };
    }
  }

  private async readMultipleFiles(args: any): Promise<any> {
    const { paths, encoding = 'utf-8' } = args;
    
    const results = await Promise.allSettled(
      paths.map(async (path: string) => {
        const resolvedPath = resolve(path);
        this.validatePath(resolvedPath);
        
        const content = await fs.readFile(resolvedPath, encoding);
        const stats = await fs.stat(resolvedPath);
        
        return {
          path: resolvedPath,
          content,
          size: stats.size,
          success: true
        };
      })
    );
    
    const successful = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);
    
    const failed = results
      .filter(result => result.status === 'rejected')
      .map((result, index) => ({
        path: paths[index],
        error: (result as PromiseRejectedResult).reason.message,
        success: false
      }));
    
    return {
      status: 'success',
      message: `📁 ${successful.length}/${paths.length} ფაილი წარმატებით წაიკითხა`,
      files: successful,
      failed_files: failed,
      encoding,
      timestamp: new Date().toISOString()
    };
  }

  private async getFileInfo(args: any): Promise<any> {
    const { path, detailed = false } = args;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      const stats = await fs.stat(resolvedPath);
      
      const info: any = {
        status: 'success',
        path: resolvedPath,
        name: basename(resolvedPath),
        type: stats.isFile() ? 'file' : stats.isDirectory() ? 'directory' : 'other',
        size: stats.size,
        created: stats.birthtime.toISOString(),
        modified: stats.mtime.toISOString(),
        accessed: stats.atime.toISOString()
      };
      
      if (stats.isFile()) {
        info.extension = extname(resolvedPath);
        
        if (detailed) {
          // Try to read first few lines for preview
          try {
            const content = await fs.readFile(resolvedPath, 'utf-8');
            const lines = content.split('\n');
            info.line_count = lines.length;
            info.preview = lines.slice(0, 5).join('\n');
            info.encoding_detected = 'utf-8';
          } catch {
            info.encoding_detected = 'binary';
          }
        }
      }
      
      if (stats.isDirectory() && detailed) {
        const items = await fs.readdir(resolvedPath);
        info.items_count = items.length;
        info.items_preview = items.slice(0, 10);
      }
      
      return info;
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფაილის ინფორმაციის მიღების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path
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
        message: `✅ ფაილი წარმატებით ${mode === 'append' ? 'განახლდა' : 'შეიქმნა'}: ${basename(path)}`,
        path: resolvedPath,
        size: stats.size,
        mode,
        encoding,
        backup_created: backup && mode === 'write',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფაილის ჩაწერის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path
      };
    }
  }

  private async editFile(args: any): Promise<any> {
    const { path, operations, backup = true } = args;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      // Create backup if requested
      if (backup) {
        const backupPath = `${resolvedPath}.backup.${Date.now()}`;
        await fs.copyFile(resolvedPath, backupPath);
      }
      
      let content = await fs.readFile(resolvedPath, 'utf-8');
      let lines = content.split('\n');
      
      const results = [];
      
      for (const op of operations) {
        switch (op.type) {
          case 'replace':
            const oldContent = content;
            content = content.replace(new RegExp(op.find, 'g'), op.replace);
            results.push({
              type: 'replace',
              success: content !== oldContent,
              pattern: op.find,
              replacement: op.replace
            });
            break;
            
          case 'insert':
            if (op.line && op.content) {
              lines.splice(op.line - 1, 0, op.content);
              results.push({
                type: 'insert',
                success: true,
                line: op.line,
                content: op.content
              });
            }
            break;
            
          case 'delete':
            if (op.line) {
              const deleted = lines.splice(op.line - 1, 1);
              results.push({
                type: 'delete',
                success: deleted.length > 0,
                line: op.line,
                deleted_content: deleted[0]
              });
            }
            break;
        }
      }
      
      // Update content from lines if needed
      if (operations.some(op => op.type === 'insert' || op.type === 'delete')) {
        content = lines.join('\n');
      }
      
      await fs.writeFile(resolvedPath, content, 'utf-8');
      
      return {
        status: 'success',
        message: `✅ ფაილი წარმატებით რედაქტირდა: ${basename(path)}`,
        path: resolvedPath,
        operations_completed: results.filter(r => r.success).length,
        operations_failed: results.filter(r => !r.success).length,
        results,
        backup_created: backup,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფაილის რედაქტირების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path
      };
    }
  }

  private async editBlock(args: any): Promise<any> {
    const { path, old_text, new_text, backup = true } = args;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      // Create backup if requested
      if (backup) {
        const backupPath = `${resolvedPath}.backup.${Date.now()}`;
        await fs.copyFile(resolvedPath, backupPath);
      }
      
      let content = await fs.readFile(resolvedPath, 'utf-8');
      const originalContent = content;
      
      content = content.replace(old_text, new_text);
      
      if (content === originalContent) {
        return {
          status: 'warning',
          message: `⚠️ ძველი ტექსტი ვერ მოიძებნა ფაილში: ${basename(path)}`,
          path: resolvedPath,
          old_text_preview: old_text.substring(0, 100) + (old_text.length > 100 ? '...' : ''),
          changes_made: false
        };
      }
      
      await fs.writeFile(resolvedPath, content, 'utf-8');
      
      return {
        status: 'success',
        message: `✅ ტექსტური ბლოკი წარმატებით შეიცვალა: ${basename(path)}`,
        path: resolvedPath,
        old_text_length: old_text.length,
        new_text_length: new_text.length,
        changes_made: true,
        backup_created: backup,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ბლოკის რედაქტირების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path
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
        message: `✅ დირექტორია წარმატებით შეიქმნა: ${basename(path)}`,
        path: resolvedPath,
        recursive,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ დირექტორიის შექმნის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path
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
        message: `📁 დირექტორია წარმატებით ჩაიტვირთა: ${basename(path)}`,
        path: resolvedPath,
        items: filteredItems,
        total_items: filteredItems.length,
        detailed,
        filters_applied: filter,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ დირექტორიის ჩატვირთვის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path
      };
    }
  }

  private async directoryTree(args: any): Promise<any> {
    const { path, max_depth = 5, include_files = true } = args;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      const buildTree = async (currentPath: string, depth: number): Promise<any> => {
        if (depth > max_depth) return null;
        
        const stats = await fs.stat(currentPath);
        const name = basename(currentPath);
        
        const node: any = {
          name,
          path: currentPath,
          type: stats.isDirectory() ? 'directory' : 'file',
          size: stats.size
        };
        
        if (stats.isDirectory()) {
          const items = await fs.readdir(currentPath);
          node.children = [];
          
          for (const item of items) {
            if (!include_files && !stats.isDirectory()) continue;
            if (item.startsWith('.')) continue; // Skip hidden files
            
            const itemPath = join(currentPath, item);
            const childNode = await buildTree(itemPath, depth + 1);
            if (childNode) {
              node.children.push(childNode);
            }
          }
        }
        
        return node;
      };
      
      const tree = await buildTree(resolvedPath, 0);
      
      return {
        status: 'success',
        message: `🌳 დირექტორიის ხე წარმატებით აშენდა: ${basename(path)}`,
        path: resolvedPath,
        tree,
        max_depth,
        include_files,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ დირექტორიის ხის აშენების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path
      };
    }
  }

  private async moveFile(args: any): Promise<any> {
    const { source, destination, overwrite = false } = args;
    
    try {
      const resolvedSource = resolve(source);
      const resolvedDestination = resolve(destination);
      
      this.validatePath(resolvedSource);
      this.validatePath(resolvedDestination);
      
      // Check if destination exists
      try {
        await fs.access(resolvedDestination);
        if (!overwrite) {
          return {
            status: 'error',
            message: `❌ დანიშნულების ფაილი უკვე არსებობს: ${basename(destination)}`,
            source: resolvedSource,
            destination: resolvedDestination,
            overwrite_required: true
          };
        }
      } catch {
        // Destination doesn't exist, which is fine
      }
      
      // Ensure destination directory exists
      await fs.mkdir(dirname(resolvedDestination), { recursive: true });
      
      await fs.rename(resolvedSource, resolvedDestination);
      
      return {
        status: 'success',
        message: `✅ ფაილი წარმატებით გადატანილია: ${basename(source)} → ${basename(destination)}`,
        source: resolvedSource,
        destination: resolvedDestination,
        overwrite,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფაილის გადატანის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        source,
        destination
      };
    }
  }

  private async searchFiles(args: any): Promise<any> {
    const { path, pattern, options = {} } = args;
    const {
      case_sensitive = false,
      max_results = 100,
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
        message: `🔍 ძიება დასრულდა: ${results.length} შედეგი მოიძებნა`,
        search_path: resolvedPath,
        pattern,
        results,
        total_found: results.length,
        options,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ფაილების ძიების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path,
        pattern
      };
    }
  }

  private async searchCode(args: any): Promise<any> {
    const { path, query, options = {} } = args;
    const {
      case_sensitive = false,
      regex = false,
      max_results = 50,
      file_extensions = [],
      context_lines = 2
    } = options;
    
    try {
      const resolvedPath = resolve(path);
      this.validatePath(resolvedPath);
      
      const results: any[] = [];
      
      const searchInFile = async (filePath: string): Promise<void> => {
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const lines = content.split('\n');
          
          for (let i = 0; i < lines.length; i++) {
            if (results.length >= max_results) break;
            
            const line = lines[i];
            let match = false;
            
            if (regex) {
              const pattern = new RegExp(query, case_sensitive ? 'g' : 'gi');
              match = pattern.test(line);
            } else {
              const searchLine = case_sensitive ? line : line.toLowerCase();
              const searchQuery = case_sensitive ? query : query.toLowerCase();
              match = searchLine.includes(searchQuery);
            }
            
            if (match) {
              const start = Math.max(0, i - context_lines);
              const end = Math.min(lines.length, i + context_lines + 1);
              
              results.push({
                file: filePath,
                relative_file: relative(resolvedPath, filePath),
                line_number: i + 1,
                line_content: line.trim(),
                context_before: lines.slice(start, i),
                context_after: lines.slice(i + 1, end),
                match_position: line.indexOf(query)
              });
            }
          }
        } catch {
          // Skip files that can't be read as text
        }
      };
      
      const searchRecursive = async (currentPath: string): Promise<void> => {
        if (results.length >= max_results) return;
        
        const items = await fs.readdir(currentPath);
        
        for (const item of items) {
          if (results.length >= max_results) break;
          if (item.startsWith('.')) continue;
          
          const itemPath = join(currentPath, item);
          const stats = await fs.stat(itemPath);
          
          if (stats.isFile()) {
            const ext = extname(item).substring(1);
            if (file_extensions.length === 0 || file_extensions.includes(ext)) {
              await searchInFile(itemPath);
            }
          } else if (stats.isDirectory()) {
            await searchRecursive(itemPath);
          }
        }
      };
      
      await searchRecursive(resolvedPath);
      
      return {
        status: 'success',
        message: `🔍 კოდის ძიება დასრულდა: ${results.length} შედეგი მოიძებნა`,
        search_path: resolvedPath,
        query,
        results,
        total_matches: results.length,
        options,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ კოდის ძიების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`,
        path,
        query
      };
    }
  }

  private async allowedDirectories(args: any): Promise<any> {
    const { add_directory, remove_directory } = args;
    
    try {
      const settings = this.config.getModuleSettings('file_system');
      let allowedDirs = settings.allowed_directories || [
        homedir(),
        join(homedir(), 'Documents'),
        join(homedir(), 'Desktop'),
        '/tmp'
      ];
      
      if (add_directory) {
        const resolvedPath = resolve(add_directory);
        if (!allowedDirs.includes(resolvedPath)) {
          allowedDirs.push(resolvedPath);
          this.config.set('modules.file_system.settings.allowed_directories', allowedDirs);
          await this.config.save();
        }
      }
      
      if (remove_directory) {
        const resolvedPath = resolve(remove_directory);
        allowedDirs = allowedDirs.filter(dir => dir !== resolvedPath);
        this.config.set('modules.file_system.settings.allowed_directories', allowedDirs);
        await this.config.save();
      }
      
      return {
        status: 'success',
        message: '📂 ნებადართული დირექტორიების სია',
        allowed_directories: allowedDirs,
        total_count: allowedDirs.length,
        action_performed: add_directory ? 'added' : remove_directory ? 'removed' : 'list',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ნებადართული დირექტორიების მენეჯმენტის შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'}`
      };
    }
  }

  private validatePath(path: string): void {
    const settings = this.config.getModuleSettings('file_system');
    const allowedDirs = settings.allowed_directories || [homedir()];
    
    if (settings.safe_mode && !allowedDirs.some(dir => path.startsWith(dir))) {
      throw new Error(`მიუწვდომელი გზა უსაფრთხო რეჟიმში: ${path}`);
    }
  }
}
