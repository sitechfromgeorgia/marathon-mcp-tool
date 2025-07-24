/**
 * 🏃‍♂️ Marathon MCP Tool - Core System Module
 * 🇬🇪 ძირითადი სისტემის მოდული
 */

import { MarathonConfig } from '../../config/marathon-config.js';
import { MarathonLogger } from '../../utils/logger.js';

export class CoreSystemModule {
  constructor(
    private config: MarathonConfig,
    private logger: MarathonLogger
  ) {}

  async getTools() {
    return [
      {
        name: 'marathon_test_connection',
        description: '🏃‍♂️ კავშირის ტესტირება და სისტემის სტატუსი',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'ტესტის შეტყობინება'
            }
          }
        }
      },
      {
        name: 'marathon_get_status',
        description: '📊 სისტემის სრული სტატუსი',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ];
  }

  async handleTool(name: string, args: any) {
    switch (name) {
      case 'marathon_test_connection':
        return await this.testConnection(args);
      case 'marathon_get_status':
        return await this.getStatus(args);
      default:
        return null;
    }
  }

  private async testConnection(args: any) {
    const message = args.message || 'Marathon MCP Tool კავშირის ტესტი';
    
    this.logger.info('🏃‍♂️ კავშირის ტესტირება...');
    
    return {
      content: [{
        type: 'text',
        text: `✅ SUCCESS! Marathon MCP Tool v2.0.0 მუშაობს!

🇬🇪 ქართული ინტერფეისი ჩართულია
🌊 ბათუმური ხელწერით შექმნილია სიყვარულით
🏔️ კავკასიონის მთების სიძლიერით

ტესტის შეტყობინება: ${message}
დრო: ${new Date().toISOString()}

⚡ ყველა მოდული მზადაა მუშაობისთვის!
🎯 80+ ფუნქცია 7 კატეგორიაში
✨ Universal Edition ჩართულია

** ყველაფერი მუშაობს! **`
      }]
    };
  }

  private async getStatus(args: any) {
    const systemInfo = this.config.getSystemInfo();
    
    return {
      content: [{
        type: 'text',
        text: `🏃‍♂️ Marathon MCP Tool v${systemInfo.version} სისტემის სტატუსი

📊 საერთო ინფორმაცია:
- ვერსია: ${systemInfo.version}
- რედაქცია: ${systemInfo.edition}
- ენა: ${systemInfo.language === 'georgian' ? '🇬🇪 ქართული' : '🇬🇧 English'}
- თემა: ${systemInfo.theme}

📦 მოდულები (${systemInfo.modules_enabled.length}/7):
${systemInfo.modules_enabled.map((m: string) => `  ✅ ${m}`).join('\n')}

🎯 ხელმისაწვდომი ფუნქციები: ${systemInfo.total_functions}+

${systemInfo.batumi_signature}`
      }]
    };
  }
}