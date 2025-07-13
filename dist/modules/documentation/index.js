/**
 * 🏃‍♂️ Marathon MCP Tool - Documentation Module
 * 🇬🇪 დოკუმენტაციის მოდული
 */

export class DocumentationModule {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
  }

  async getTools() {
    return [
      {
        name: 'marathon_get_help',
        description: '📚 დახმარების ინფორმაცია',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: 'დახმარების თემა' }
          }
        }
      }
    ];
  }

  async handleToolCall(name, args) {
    switch (name) {
      case 'marathon_get_help':
        return await this.getHelp(args);
      default:
        return null;
    }
  }

  async getHelp(args) {
    return {
      content: [{
        type: 'text',
        text: `📚 Marathon MCP Tool დახმარება

🏃‍♂️ Universal Edition - 80+ ფუნქცია 7 კატეგორიაში
🇬🇪 ქართული ინტერფეისი
🌊 ბათუმური ხელწერით შექმნილია სიყვარულით`
      }]
    };
  }
}