/**
 * 🏃‍♂️ Marathon MCP Tool - Git Repository Module
 * 🇬🇪 Git რეპოზიტორიის მოდული
 */

export class GitRepositoryModule {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
  }

  async getTools() {
    return [
      {
        name: 'marathon_git_status',
        description: '🐙 Git რეპოზიტორიის სტატუსი',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'რეპოზიტორიის ბილიკი' }
          }
        }
      }
    ];
  }

  async handleToolCall(name, args) {
    switch (name) {
      case 'marathon_git_status':
        return await this.getGitStatus(args);
      default:
        return null;
    }
  }

  async getGitStatus(args) {
    return {
      content: [{
        type: 'text',
        text: `🐙 Git სტატუსი: ${args?.path || 'მიმდინარე დირექტორია'}

🏃‍♂️ Marathon Git მუშაობს!
🌊 ბათუმური კოდის მენეჯმენტი
🇬🇪 Made in Georgia`
      }]
    };
  }
}