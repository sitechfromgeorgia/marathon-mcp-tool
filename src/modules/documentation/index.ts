/**
 * 📚 Documentation & Content Module
 * დოკუმენტაცია და კონტენტის მოდული
 */

import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

export class DocumentationModule {
  private config: MarathonConfig;
  private logger: MarathonLogger;
  private readonly moduleName = 'documentation';

  constructor(config: MarathonConfig, logger: MarathonLogger) {
    this.config = config;
    this.logger = logger;
  }

  public async getTools(): Promise<any[]> {
    const georgian = this.config.getGeorgianInterface();
    
    return [
      {
        name: 'marathon_fetch_docs',
        description: `${georgian['marathon_fetch_docs']} - Fetch documentation from URL`,
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Documentation URL to fetch'
            },
            format: {
              type: 'string',
              description: 'Output format',
              enum: ['markdown', 'text', 'html'],
              default: 'markdown'
            }
          },
          required: ['url']
        }
      },
      {
        name: 'marathon_search_docs',
        description: `${georgian['marathon_search_docs']} - Search within documentation`,
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query'
            },
            source: {
              type: 'string',
              description: 'Documentation source or URL'
            },
            max_results: {
              type: 'number',
              description: 'Maximum results to return',
              default: 10
            }
          },
          required: ['query']
        }
      },
      {
        name: 'marathon_generate_readme',
        description: `${georgian['marathon_generate_readme'] || 'README გენერაცია'} - Generate README file`,
        inputSchema: {
          type: 'object',
          properties: {
            project_name: {
              type: 'string',
              description: 'Project name'
            },
            description: {
              type: 'string',
              description: 'Project description'
            },
            language: {
              type: 'string',
              description: 'Language for README',
              enum: ['georgian', 'english', 'both'],
              default: 'both'
            }
          },
          required: ['project_name', 'description']
        }
      }
    ];
  }

  public async handleTool(name: string, args: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      await this.logger.logFunctionCall(name, args, this.moduleName);
      
      if (!this.config.isModuleEnabled('documentation')) {
        throw new Error('დოკუმენტაციის მოდული გამორთულია');
      }
      
      let result;
      
      switch (name) {
        case 'marathon_fetch_docs':
          result = await this.fetchDocs(args);
          break;
        case 'marathon_search_docs':
          result = await this.searchDocs(args);
          break;
        case 'marathon_generate_readme':
          result = await this.generateReadme(args);
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

  private async fetchDocs(args: any): Promise<any> {
    const { url, format = 'markdown' } = args;
    
    return {
      status: 'success',
      message: `📖 დოკუმენტაცია ჩატვირთულია: ${url}`,
      url,
      format,
      content: `# დოკუმენტაცია ${url}-დან\n\nეს არის სიმულირებული დოკუმენტაცია...`,
      timestamp: new Date().toISOString(),
      batumi_signature: '🌊 ბათუმური დოკუმენტაცია'
    };
  }

  private async searchDocs(args: any): Promise<any> {
    const { query, source, max_results = 10 } = args;
    
    const mockResults = [
      {
        title: `${query} - პირველი შედეგი`,
        excerpt: `ეს არის შედეგი ძიების ტერმინისთვის: ${query}`,
        relevance: 0.95
      },
      {
        title: `${query} - მეორე შედეგი`,
        excerpt: `კიდევ ერთი რელევანტური შედეგი...`,
        relevance: 0.87
      }
    ];
    
    return {
      status: 'success',
      message: `🔍 ძიება დასრულდა: ${query}`,
      query,
      source,
      results: mockResults.slice(0, max_results),
      total_found: mockResults.length,
      search_time: '0.15s'
    };
  }

  private async generateReadme(args: any): Promise<any> {
    const { project_name, description, language = 'both' } = args;
    
    let readmeContent = '';
    
    if (language === 'georgian' || language === 'both') {
      readmeContent += `# ${project_name}\n\n🇬🇪 **ქართული აღწერა**\n\n${description}\n\n`;
      readmeContent += `## ინსტალაცია\n\n\`\`\`bash\nnpm install ${project_name}\n\`\`\`\n\n`;
      readmeContent += `## გამოყენება\n\nპროექტის გამოყენების მაგალითი...\n\n`;
      readmeContent += `---\n\n`;
    }
    
    if (language === 'english' || language === 'both') {
      readmeContent += `# ${project_name}\n\n🇬🇧 **English Description**\n\n${description}\n\n`;
      readmeContent += `## Installation\n\n\`\`\`bash\nnpm install ${project_name}\n\`\`\`\n\n`;
      readmeContent += `## Usage\n\nExample usage of the project...\n\n`;
    }
    
    readmeContent += `\n---\n🌊 Created with ❤️ in Batumi, Georgia\n`;
    
    return {
      status: 'success',
      message: `📝 README ფაილი გენერირებულია: ${project_name}`,
      project_name,
      language,
      content: readmeContent,
      file_size: readmeContent.length,
      batumi_signature: '🌊 ბათუმური README'
    };
  }
}
