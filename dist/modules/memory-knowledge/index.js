/**
 * 🏃‍♂️ Marathon MCP Tool - Memory Knowledge Module (Simplified)
 * 🇬🇪 მეხსიერებისა და ცოდნის მოდული (გამარტივებული)
 */

export class MemoryKnowledgeModule {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.memory = new Map(); // Simple in-memory storage
    this.knowledge = new Map(); // Simple knowledge storage
  }

  async getTools() {
    return [
      {
        name: 'marathon_simple_memory',
        description: '🧠 მარტივი მეხსიერების მუშაობა (save/load/list)',
        inputSchema: {
          type: 'object',
          properties: {
            action: { 
              type: 'string', 
              enum: ['save', 'load', 'list', 'clear'],
              description: 'მოქმედება' 
            },
            key: { type: 'string', description: 'გასაღები' },
            data: { type: 'string', description: 'მონაცემები' }
          },
          required: ['action']
        }
      },
      {
        name: 'marathon_knowledge_store',
        description: '🔗 ცოდნის შენახვა და ძიება',
        inputSchema: {
          type: 'object',
          properties: {
            action: { 
              type: 'string', 
              enum: ['store', 'search', 'get_all'],
              description: 'მოქმედება' 
            },
            topic: { type: 'string', description: 'თემა' },
            content: { type: 'string', description: 'კონტენტი' },
            query: { type: 'string', description: 'ძიების ტექსტი' }
          },
          required: ['action']
        }
      },
      {
        name: 'marathon_session_context',
        description: '📝 სესიის კონტექსტის მართვა',
        inputSchema: {
          type: 'object',
          properties: {
            action: { 
              type: 'string', 
              enum: ['save_context', 'load_context', 'clear_context'],
              description: 'მოქმედება' 
            },
            context_data: { type: 'string', description: 'კონტექსტის მონაცემები' }
          },
          required: ['action']
        }
      }
    ];
  }

  async handleToolCall(name, args) {
    switch (name) {
      case 'marathon_simple_memory':
        return await this.handleSimpleMemory(args);
      case 'marathon_knowledge_store':
        return await this.handleKnowledgeStore(args);
      case 'marathon_session_context':
        return await this.handleSessionContext(args);
      default:
        return null;
    }
  }

  async handleSimpleMemory(args) {
    const { action, key, data } = args;
    
    switch (action) {
      case 'save':
        if (!key || !data) {
          return { content: [{ type: 'text', text: '❌ გასაღები და მონაცემები აუცილებელია' }] };
        }
        this.memory.set(key, { data, timestamp: new Date().toISOString() });
        return { content: [{ type: 'text', text: `✅ შენახულია: ${key}` }] };
        
      case 'load':
        if (!key) {
          return { content: [{ type: 'text', text: '❌ გასაღები აუცილებელია' }] };
        }
        const item = this.memory.get(key);
        if (!item) {
          return { content: [{ type: 'text', text: `❌ ვერ მოიძებნა: ${key}` }] };
        }
        return { content: [{ type: 'text', text: `📖 ${key}: ${item.data}\nდრო: ${item.timestamp}` }] };
        
      case 'list':
        const keys = Array.from(this.memory.keys());
        if (keys.length === 0) {
          return { content: [{ type: 'text', text: '📝 მეხსიერება ცარიელია' }] };
        }
        return { content: [{ type: 'text', text: `📋 ჩანაწერები: ${keys.join(', ')}` }] };
        
      case 'clear':
        this.memory.clear();
        return { content: [{ type: 'text', text: '🗑️ მეხსიერება გასუფთავებულია' }] };
        
      default:
        return { content: [{ type: 'text', text: '❌ უცნობი მოქმედება' }] };
    }
  }

  async handleKnowledgeStore(args) {
    const { action, topic, content, query } = args;
    
    switch (action) {
      case 'store':
        if (!topic || !content) {
          return { content: [{ type: 'text', text: '❌ თემა და კონტენტი აუცილებელია' }] };
        }
        this.knowledge.set(topic, { content, timestamp: new Date().toISOString() });
        return { content: [{ type: 'text', text: `✅ ცოდნა შენახულია: ${topic}` }] };
        
      case 'search':
        if (!query) {
          return { content: [{ type: 'text', text: '❌ ძიების ტექსტი აუცილებელია' }] };
        }
        const results = [];
        for (const [topic, data] of this.knowledge) {
          if (topic.includes(query) || data.content.includes(query)) {
            results.push(`📌 ${topic}: ${data.content.substring(0, 100)}...`);
          }
        }
        if (results.length === 0) {
          return { content: [{ type: 'text', text: `🔍 "${query}" ვერ მოიძებნა` }] };
        }
        return { content: [{ type: 'text', text: `🔍 ძიების შედეგები:\n${results.join('\n')}` }] };
        
      case 'get_all':
        const topics = Array.from(this.knowledge.keys());
        if (topics.length === 0) {
          return { content: [{ type: 'text', text: '📚 ცოდნის ბაზა ცარიელია' }] };
        }
        return { content: [{ type: 'text', text: `📚 ცოდნის თემები: ${topics.join(', ')}` }] };
        
      default:
        return { content: [{ type: 'text', text: '❌ უცნობი მოქმედება' }] };
    }
  }

  async handleSessionContext(args) {
    const { action, context_data } = args;
    
    switch (action) {
      case 'save_context':
        if (!context_data) {
          return { content: [{ type: 'text', text: '❌ კონტექსტის მონაცემები აუცილებელია' }] };
        }
        this.memory.set('_session_context', { data: context_data, timestamp: new Date().toISOString() });
        return { content: [{ type: 'text', text: '✅ სესიის კონტექსტი შენახულია' }] };
        
      case 'load_context':
        const context = this.memory.get('_session_context');
        if (!context) {
          return { content: [{ type: 'text', text: '❌ სესიის კონტექსტი ვერ მოიძებნა' }] };
        }
        return { content: [{ type: 'text', text: `📖 სესიის კონტექსტი:\n${context.data}` }] };
        
      case 'clear_context':
        this.memory.delete('_session_context');
        return { content: [{ type: 'text', text: '🗑️ სესიის კონტექსტი გასუფთავებულია' }] };
        
      default:
        return { content: [{ type: 'text', text: '❌ უცნობი მოქმედება' }] };
    }
  }
}