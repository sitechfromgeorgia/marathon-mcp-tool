/**
 * 🏃‍♂️ Marathon MCP Tool - File System Module
 * 🇬🇪 ფაილური სისტემის მოდული
 * 📦 სრული ფუნქციონალით - Universal Edition
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

export class FileSystemModule {
  constructor(
    private config: MarathonConfig,
    private logger: MarathonLogger
  ) {}

  async getTools() {
    return [
      // 📖 File Reading Operations
      {
        name: 'marathon_read_file',
        description: '📖 ფაილის წაკითხვა',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'ფაილის ბილიკი' }
          },
          required: ['path']
        }
      },
      {
        name: 'marathon_read_multiple_files',
        description: '📚 რამდენიმე ფაილის წაკითხვა',
        inputSchema: {
          type: 'object',
          properties: {
            paths: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'ფაილების ბილიკების სია' 
            }
          },
          required: ['paths']
        }
      },

      // 📝 File Writing Operations
      {
        name: 'marathon_write_file',
        description: '📝 ფაილში ჩაწერა',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'ფაილის ბილიკი' },
            content: { type: 'string', description: 'ჩაწერის შიგთავსი' },
            mode: { 
              type: 'string', 
              enum: ['overwrite', 'append'],
              description: 'ჩაწერის რეჟიმი',
              default: 'overwrite'
            }
          },
          required: ['path', 'content']
        }
      },

      // ✏️ File Editing Operations
      {
        name: 'marathon_edit_file',
        description: '✏️ ფაილის რედაქტირება',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'ფაილის ბილიკი' },
            search: { type: 'string', description: 'საძიებო ტექსტი' },
            replace: { type: 'string', description: 'ჩამნაცვლებელი ტექსტი' }
          },
          required: ['path', 'search', 'replace']
        }
      },
      {
        name: 'marathon_edit_block',
        description: '🔧 ფაილის ბლოკური რედაქტირება',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'ფაილის ბილიკი' },
            lineStart: { type: 'number', description: 'საწყისი ხაზი' },
            lineEnd: { type: 'number', description: 'დასასრული ხაზი' },
            content: { type: 'string', description: 'ახალი შიგთავსი' }
          },
          required: ['path', 'lineStart', 'lineEnd', 'content']
        }
      },

      // 📁 Directory Operations
      {
        name: 'marathon_list_directory',
        description: '📁 დირექტორიის შიგთავსის სია',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'დირექტორიის ბილიკი' }
          },
          required: ['path']
        }
      },
      {
        name: 'marathon_directory_tree',
        description: '🌳 დირექტორიის ხის სტრუქტურა',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'დირექტორიის ბილიკი' },
            maxDepth: { type: 'number', description: 'მაქსიმალური სიღრმე', default: 3 }
          },
          required: ['path']
        }
      },
      {
        name: 'marathon_create_directory',
        description: '📁 ახალი დირექტორიის შექმნა',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'დირექტორიის ბილიკი' },
            recursive: { type: 'boolean', description: 'რეკურსიული შექმნა', default: true }
          },
          required: ['path']
        }
      },

      // 🔄 File Management Operations
      {
        name: 'marathon_move_file',
        description: '🔄 ფაილის გადატანა/გადარქმევა',
        inputSchema: {
          type: 'object',
          properties: {
            source: { type: 'string', description: 'საწყისი ბილიკი' },
            destination: { type: 'string', description: 'დანიშნულების ბილიკი' }
          },
          required: ['source', 'destination']
        }
      },
      {
        name: 'marathon_get_file_info',
        description: 'ℹ️ ფაილის დეტალური ინფორმაცია',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'ფაილის ბილიკი' }
          },
          required: ['path']
        }
      },

      // 🔍 Search Operations
      {
        name: 'marathon_search_files',
        description: '🔍 ფაილების ძიება',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'ძიების დირექტორია' },
            pattern: { type: 'string', description: 'ძიების ნიმუში' },
            recursive: { type: 'boolean', description: 'რეკურსიული ძიება', default: true }
          },
          required: ['path', 'pattern']
        }
      },
      {
        name: 'marathon_search_code',
        description: '💻 კოდის ძიება ფაილებში',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'ძიების დირექტორია' },
            searchTerm: { type: 'string', description: 'საძიებო ტერმინი' },
            fileExtensions: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'ფაილის გაფართოებები',
              default: ['.ts', '.js', '.json', '.md']
            }
          },
          required: ['path', 'searchTerm']
        }
      },

      // 🛡️ Security & Utilities
      {
        name: 'marathon_allowed_directories',
        description: '🛡️ ნებადართული დირექტორიების სია',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ];
  }

  async handleTool(name: string, args: any) {
    try {
      switch (name) {
        // File Reading
        case 'marathon_read_file':
          return await this.readFile(args);
        case 'marathon_read_multiple_files':
          return await this.readMultipleFiles(args);

        // File Writing
        case 'marathon_write_file':
          return await this.writeFile(args);

        // File Editing
        case 'marathon_edit_file':
          return await this.editFile(args);
        case 'marathon_edit_block':
          return await this.editBlock(args);

        // Directory Operations
        case 'marathon_list_directory':
          return await this.listDirectory(args);
        case 'marathon_directory_tree':
          return await this.directoryTree(args);
        case 'marathon_create_directory':
          return await this.createDirectory(args);

        // File Management
        case 'marathon_move_file':
          return await this.moveFile(args);
        case 'marathon_get_file_info':
          return await this.getFileInfo(args);

        // Search Operations
        case 'marathon_search_files':
          return await this.searchFiles(args);
        case 'marathon_search_code':
          return await this.searchCode(args);

        // Security
        case 'marathon_allowed_directories':
          return await this.getAllowedDirectories();

        default:
          return null;
      }
    } catch (error) {
      this.logger.error(`FileSystem error for ${name}:`, error);
      return {
        content: [{
          type: 'text',
          text: `❌ შეცდომა ${name} ფუნქციაში: ${error}`
        }]
      };
    }
  }

  // Implementation methods follow...
  // For brevity, showing simplified versions

  private async readFile(args: any) {
    const content = await fs.readFile(args.path, 'utf-8');
    return {
      content: [{
        type: 'text',
        text: `📖 ფაილი: ${args.path}\n\n${content}`
      }]
    };
  }

  private async readMultipleFiles(args: any) {
    const results = [];
    for (const filePath of args.paths) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        results.push(`📖 ${filePath}:\n${content}\n`);
      } catch (error) {
        results.push(`❌ ${filePath}: ${error}\n`);
      }
    }
    
    return {
      content: [{
        type: 'text',
        text: `📚 ${args.paths.length} ფაილის წაკითხვა:\n\n${results.join('\n---\n')}`
      }]
    };
  }

  private async writeFile(args: any) {
    const mode = args.mode || 'overwrite';
    
    if (mode === 'append') {
      await fs.appendFile(args.path, args.content);
    } else {
      await fs.writeFile(args.path, args.content, 'utf-8');
    }
    
    return {
      content: [{
        type: 'text',
        text: `✅ ფაილი ${mode === 'append' ? 'დაემატა' : 'ჩაიწერა'}: ${args.path}`
      }]
    };
  }

  private async editFile(args: any) {
    const content = await fs.readFile(args.path, 'utf-8');
    const newContent = content.replace(new RegExp(args.search, 'g'), args.replace);
    await fs.writeFile(args.path, newContent, 'utf-8');
    
    return {
      content: [{
        type: 'text',
        text: `✏️ ფაილი დარედაქტირდა: ${args.path}\n🔍 ჩანაცვლებული: "${args.search}" → "${args.replace}"`
      }]
    };
  }

  private async editBlock(args: any) {
    const content = await fs.readFile(args.path, 'utf-8');
    const lines = content.split('\n');
    
    const newLines = args.content.split('\n');
    lines.splice(args.lineStart - 1, args.lineEnd - args.lineStart + 1, ...newLines);
    
    await fs.writeFile(args.path, lines.join('\n'), 'utf-8');
    
    return {
      content: [{
        type: 'text',
        text: `🔧 ბლოკი დარედაქტირდა: ${args.path}\n📍 ხაზები ${args.lineStart}-${args.lineEnd}`
      }]
    };
  }

  private async listDirectory(args: any) {
    const items = await fs.readdir(args.path, { withFileTypes: true });
    const listing = items.map(item => 
      `${item.isDirectory() ? '📁' : '📄'} ${item.name}`
    ).join('\n');
    
    return {
      content: [{
        type: 'text',
        text: `📁 დირექტორია: ${args.path}\n\n${listing}`
      }]
    };
  }

  private async directoryTree(args: any): Promise<any> {
    const maxDepth = args.maxDepth || 3;
    
    const buildTree = async (dirPath: string, depth: number): Promise<string> => {
      if (depth >= maxDepth) return '';
      
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      const indent = '  '.repeat(depth);
      let tree = '';
      
      for (const item of items) {
        const icon = item.isDirectory() ? '📁' : '📄';
        tree += `${indent}${icon} ${item.name}\n`;
        
        if (item.isDirectory() && depth < maxDepth - 1) {
          const subTree = await buildTree(path.join(dirPath, item.name), depth + 1);
          tree += subTree;
        }
      }
      
      return tree;
    };

    const tree = await buildTree(args.path, 0);
    
    return {
      content: [{
        type: 'text',
        text: `🌳 დირექტორიის ხე: ${args.path}\n\n${tree}`
      }]
    };
  }

  private async createDirectory(args: any) {
    const recursive = args.recursive !== false;
    await fs.mkdir(args.path, { recursive });
    
    return {
      content: [{
        type: 'text',
        text: `📁 დირექტორია შეიქმნა: ${args.path}`
      }]
    };
  }

  private async moveFile(args: any) {
    await fs.rename(args.source, args.destination);
    
    return {
      content: [{
        type: 'text',
        text: `🔄 ფაილი გადატანილია:\n📤 ${args.source}\n📥 ${args.destination}`
      }]
    };
  }

  private async getFileInfo(args: any) {
    const stats = await fs.stat(args.path);
    const info = {
      size: stats.size,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      created: stats.birthtime,
      modified: stats.mtime,
      accessed: stats.atime
    };
    
    return {
      content: [{
        type: 'text',
        text: `ℹ️ ფაილის ინფორმაცია: ${args.path}\n\n` +
              `📦 ზომა: ${info.size} ბაიტი\n` +
              `📄 ტიპი: ${info.isFile ? 'ფაილი' : info.isDirectory ? 'დირექტორია' : 'სხვა'}\n` +
              `📅 შექმნა: ${info.created.toLocaleString('ka-GE')}\n` +
              `✏️ ცვლილება: ${info.modified.toLocaleString('ka-GE')}\n` +
              `👀 ნახვა: ${info.accessed.toLocaleString('ka-GE')}`
      }]
    };
  }

  private async searchFiles(args: any) {
    const searchInDirectory = async (dirPath: string, pattern: string): Promise<string[]> => {
      const results: string[] = [];
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.name.toLowerCase().includes(pattern.toLowerCase())) {
          results.push(fullPath);
        }
        
        if (item.isDirectory() && args.recursive !== false) {
          const subResults = await searchInDirectory(fullPath, pattern);
          results.push(...subResults);
        }
      }
      
      return results;
    };

    const results = await searchInDirectory(args.path, args.pattern);
    
    return {
      content: [{
        type: 'text',
        text: `🔍 ძიების შედეგები "${args.pattern}":\n\n${results.length > 0 ? results.join('\n') : 'არაფერი ვერ მოიძებნა'}`
      }]
    };
  }

  private async searchCode(args: any) {
    const extensions = args.fileExtensions || ['.ts', '.js', '.json', '.md'];
    const results: string[] = [];

    const searchInFile = async (filePath: string): Promise<string[]> => {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');
        const matches: string[] = [];
        
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(args.searchTerm.toLowerCase())) {
            matches.push(`${filePath}:${index + 1}: ${line.trim()}`);
          }
        });
        
        return matches;
      } catch {
        return [];
      }
    };

    const searchInDirectory = async (dirPath: string): Promise<void> => {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isFile() && extensions.some((ext: string) => item.name.endsWith(ext))) {
          const matches = await searchInFile(fullPath);
          results.push(...matches);
        } else if (item.isDirectory()) {
          await searchInDirectory(fullPath);
        }
      }
    };

    await searchInDirectory(args.path);
    
    return {
      content: [{
        type: 'text',
        text: `💻 კოდის ძიება "${args.searchTerm}":\n\n${results.length > 0 ? results.slice(0, 50).join('\n') : 'არაფერი ვერ მოიძებნა'}`
      }]
    };
  }

  private async getAllowedDirectories() {
    const allowedDirs = [
      'C:\\Users\\Louie',
      'C:\\Users\\Louie\\marathon-mcp-tool',
      'C:\\Users\\Louie\\Documents',
      'C:\\Users\\Louie\\Downloads',
      'C:\\Users\\Louie\\Desktop'
    ];
    
    return {
      content: [{
        type: 'text',
        text: `🛡️ ნებადართული დირექტორიები:\n\n${allowedDirs.join('\n')}`
      }]
    };
  }
}