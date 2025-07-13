/**
 * 🏃‍♂️ Marathon MCP Tool - File System Module
 * 🇬🇪 ფაილური სისტემის მოდული
 */

import { promises as fs } from 'fs';

export class FileSystemModule {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
  }

  async getTools() {
    return [
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
        name: 'marathon_list_directory',
        description: '📁 დირექტორიის შიგთავსის სია',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'დირექტორიის ბილიკი' }
          },
          required: ['path']
        }
      }
    ];
  }

  async handleToolCall(name, args) {
    switch (name) {
      case 'marathon_read_file':
        return await this.readFile(args);
      case 'marathon_list_directory':
        return await this.listDirectory(args);
      default:
        return null;
    }
  }

  async readFile(args) {
    try {
      const content = await fs.readFile(args.path, 'utf8');
      return {
        content: [{
          type: 'text',
          text: `📖 ფაილი: ${args.path}\n\n${content}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ შეცდომა ფაილის წაკითხვაში: ${error.message}`
        }]
      };
    }
  }

  async listDirectory(args) {
    try {
      const items = await fs.readdir(args.path);
      const itemsList = items.map(item => `• ${item}`).join('\n');
      return {
        content: [{
          type: 'text',
          text: `📁 დირექტორია: ${args.path}\n\n${itemsList}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ შეცდომა დირექტორიის წაკითხვაში: ${error.message}`
        }]
      };
    }
  }
}