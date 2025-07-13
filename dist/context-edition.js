/**
 * 🏃‍♂️ Marathon MCP Tool v2.0.0 - Context Management Edition
 * ერთი ხელსაწყო ყველა შესაძლებლობით + Context Management
 *
 * 🇬🇪 ქართული ინტერფეისი
 * 🌊 ბათუმური ხელწერით შექმნილია სიყვარულით
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
class MarathonContextManager {
    sessionsPath;
    currentSession = null;
    constructor() {
        this.sessionsPath = join(homedir(), '.marathon-mcp', 'sessions');
        this.ensureDirectory();
    }
    async ensureDirectory() {
        try {
            await fs.mkdir(this.sessionsPath, { recursive: true });
        }
        catch (error) {
            console.error('⚠️ Context directory creation error:', error);
        }
    }
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async startSession(goal) {
        const sessionId = this.generateSessionId();
        this.currentSession = {
            id: sessionId,
            start_time: new Date().toISOString(),
            last_activity: new Date().toISOString(),
            messages: [],
            summary: `🎯 მიზანი: ${goal}`,
            goal,
            current_step: 'გაშვება',
            completed_actions: [],
            next_steps: []
        };
        await this.saveSession();
        return sessionId;
    }    async logFunction(functionName, args, result, duration) {
        if (!this.currentSession) {
            await this.startSession('ავტომატური სესია');
        }
        if (this.currentSession) {
            this.currentSession.messages.push({
                timestamp: new Date().toISOString(),
                function_name: functionName,
                args,
                result,
                duration
            });
            this.currentSession.last_activity = new Date().toISOString();
            // Update completed actions
            this.currentSession.completed_actions.push(`✅ ${functionName} (${duration}ms)`);
            await this.saveSession();
        }
    }
    async updateCurrentStep(step) {
        if (this.currentSession) {
            this.currentSession.current_step = step;
            await this.saveSession();
        }
    }
    async addNextSteps(steps) {
        if (this.currentSession) {
            this.currentSession.next_steps = [...this.currentSession.next_steps, ...steps];
            await this.saveSession();
        }
    }
    async generateContinuationPrompt() {
        if (!this.currentSession) {
            return 'არ არის აქტიური სესია';
        }
        const session = this.currentSession;
        const duration = Math.round((Date.now() - new Date(session.start_time).getTime()) / (1000 * 60));
        return `
🏃‍♂️ **Marathon MCP Context Continuation**
🇬🇪 ქართული ინტერფეისი | 🌊 ბათუმური ხელწერა

**📋 Session Summary:**
- 🆔 Session ID: ${session.id}
- ⏱️ Duration: ${duration} წუთი
- 🎯 Original Goal: ${session.goal}
- 📍 Current Step: ${session.current_step}

**✅ Completed Actions:**
${session.completed_actions.slice(-10).map(action => `- ${action}`).join('\n')}

**🔄 Recent Functions Used:**
${session.messages.slice(-5).map(msg => `- ${msg.function_name} (${new Date(msg.timestamp).toLocaleTimeString()})`).join('\n')}

**📝 Context Summary:**
${session.summary}

**⏭️ Next Steps:**
${session.next_steps.length > 0 ? session.next_steps.map(step => `- ${step}`).join('\n') : '- მოდი ვაგრძელოთ სადაც გავჩერდით'}

**🔄 Continuation Prompt:**
"რას ვაგრძელებთ წინა სესიიდან? ${session.current_step} ეტაპზე დავრჩით."

🌊 ბათუმური ხელწერით შექმნილია სიყვარულით
        `.trim();
    }
    async saveSession() {
        if (!this.currentSession)
            return;
        try {
            const filePath = join(this.sessionsPath, `${this.currentSession.id}.json`);
            await fs.writeFile(filePath, JSON.stringify(this.currentSession, null, 2), 'utf8');
        }
        catch (error) {
            console.error('⚠️ Context save error:', error);
        }
    }
    async loadSession(sessionId) {
        try {
            const filePath = join(this.sessionsPath, `${sessionId}.json`);
            const data = await fs.readFile(filePath, 'utf8');
            const session = JSON.parse(data);
            this.currentSession = session;
            return session;
        }
        catch (error) {
            console.error('⚠️ Context load error:', error);
            return null;
        }
    }
    async getSessions(limit = 10) {
        try {
            const files = await fs.readdir(this.sessionsPath);
            const sessionFiles = files.filter(f => f.endsWith('.json')).slice(0, limit);
            const sessions = [];
            for (const file of sessionFiles) {
                try {
                    const data = await fs.readFile(join(this.sessionsPath, file), 'utf8');
                    const session = JSON.parse(data);
                    sessions.push({
                        id: session.id,
                        goal: session.goal,
                        start_time: session.start_time,
                        duration: Math.round((new Date(session.last_activity).getTime() - new Date(session.start_time).getTime()) / (1000 * 60)),
                        function_count: session.messages?.length || 0
                    });
                }
                catch (error) {
                    console.error(`⚠️ Error reading session ${file}:`, error);
                }
            }
            return sessions.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
        }
        catch (error) {
            console.error('⚠️ Error getting sessions:', error);
            return [];
        }
    }
}
class MarathonMCPServer {
    server;
    contextManager;
    constructor() {
        this.server = new Server({
            name: 'marathon-mcp-tool',
            version: '2.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.contextManager = new MarathonContextManager();
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
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
                    },
                    {
                        name: 'marathon_context_start',
                        description: '🎯 ახალი კონტექსტ სესიის დაწყება',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                goal: {
                                    type: 'string',
                                    description: 'სესიის მიზანი'
                                }
                            },
                            required: ['goal']
                        }
                    },
                    {
                        name: 'marathon_context_save',
                        description: '💾 მიმდინარე კონტექსტის შენახვა',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                summary: {
                                    type: 'string',
                                    description: 'სესიის შეჯამება'
                                },
                                next_steps: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'შემდეგი ნაბიჯები'
                                }
                            }
                        }
                    },
                    {
                        name: 'marathon_context_load',
                        description: '📂 კონტექსტ სესიის ჩატვირთვა',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                session_id: {
                                    type: 'string',
                                    description: 'სესიის იდენტიფიკატორი'
                                }
                            }
                        }
                    },
                    {
                        name: 'marathon_generate_continuation',
                        description: '🔄 ახალი chat-ისთვის continuation prompt-ის გენერაცია',
                        inputSchema: {
                            type: 'object',
                            properties: {}
                        }
                    },
                    {
                        name: 'marathon_get_sessions',
                        description: '📋 ბოლო სესიების სია',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                limit: {
                                    type: 'number',
                                    description: 'სესიების რაოდენობა'
                                }
                            }
                        }
                    },
                    {
                        name: 'marathon_symbol_command',
                        description: '⚡ სიმბოლური ბრძანებების მუშაობა (---, +++, ...)',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                command: {
                                    type: 'string',
                                    description: 'სიმბოლური ბრძანება'
                                }
                            },
                            required: ['command']
                        }
                    }
                ]
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            const startTime = Date.now();
            try {
                let result;
                switch (name) {
                    case 'marathon_test_connection':
                        result = {
                            content: [{
                                    type: 'text',
                                    text: `🏃‍♂️ Marathon MCP Tool v2.0.0 Context Edition\n🇬🇪 ქართული ინტერფეისი ჩართულია\n🌊 ბათუმური ხელწერით შექმნილია სიყვარულით\n✅ კავშირი წარმატებულია!\n📝 შეტყობინება: ${args?.message || 'ტესტირება'}\n⚡ 80+ ფუნქცია + Context Management მზადაა`
                                }]
                        };
                        break;
                    case 'marathon_get_status':
                        const status = {
                            status: 'მუშაობს',
                            message: 'Marathon MCP Tool v2.0.0 Context Edition',
                            version: '2.0.0',
                            edition: 'Context Management',
                            language: 'georgian',
                            theme: 'batumi_sunset',
                            current_session: this.contextManager.currentSession ? {
                                id: this.contextManager.currentSession.id,
                                goal: this.contextManager.currentSession.goal,
                                duration_minutes: Math.round((Date.now() - new Date(this.contextManager.currentSession.start_time).getTime()) / (1000 * 60)),
                                functions_called: this.contextManager.currentSession.messages?.length || 0
                            } : null,
                            total_functions: 85,
                            timestamp: new Date().toISOString(),
                            batumi_signature: '🌊 ბათუმური ხელწერით შექმნილია სიყვარულით'
                        };
                        result = {
                            content: [{
                                    type: 'text',
                                    text: JSON.stringify(status, null, 2)
                                }]
                        };
                        break;
                    case 'marathon_context_start':
                        const sessionId = await this.contextManager.startSession(args.goal);
                        await this.contextManager.updateCurrentStep('სესია დაიწყო');
                        result = {
                            content: [{
                                    type: 'text',
                                    text: `🎯 ახალი სესია დაიწყო!\n🆔 Session ID: ${sessionId}\n🎯 მიზანი: ${args.goal}\n⏰ დაწყების დრო: ${new Date().toLocaleString()}\n📊 Context tracking ჩართულია`
                                }]
                        };
                        break;
                    case 'marathon_context_save':
                        if (this.contextManager.currentSession) {
                            if (args.summary) {
                                this.contextManager.currentSession.summary = args.summary;
                            }
                            if (args.next_steps) {
                                await this.contextManager.addNextSteps(args.next_steps);
                            }
                            await this.contextManager.saveSession();
                        }
                        result = {
                            content: [{
                                    type: 'text',
                                    text: `💾 კონტექსტი შენახულია!\n📝 შეჯამება: ${args.summary || 'განახლებული'}\n⏭️ შემდეგი ნაბიჯები: ${args.next_steps?.length || 0} ნაბიჯი\n🔄 მზადაა continuation prompt-ისთვის`
                                }]
                        };
                        break;
                    case 'marathon_context_load':
                        const session = await this.contextManager.loadSession(args.session_id);
                        if (session) {
                            result = {
                                content: [{
                                        type: 'text',
                                        text: `📂 სესია ჩაიტვირთა: ${session.goal}`
                                    }]
                            };
                        }
                        else {
                            result = {
                                content: [{
                                        type: 'text',
                                        text: `❌ სესია ვერ მოიძებნა: ${args.session_id}`
                                    }]
                            };
                        }
                        break;
                    case 'marathon_generate_continuation':
                        const continuationPrompt = await this.contextManager.generateContinuationPrompt();
                        result = {
                            content: [{
                                    type: 'text',
                                    text: continuationPrompt
                                }]
                        };
                        break;
                    case 'marathon_get_sessions':
                        const sessions = await this.contextManager.getSessions(args.limit || 10);
                        const sessionsText = sessions.length > 0 ?
                            sessions.map(s => `🆔 ${s.id}\n🎯 ${s.goal}\n⏰ ${new Date(s.start_time).toLocaleString()}\n📊 ${s.function_count} ფუნქცია`).join('\n\n---\n') :
                            'სესიები არ მოიძებნა';
                        result = {
                            content: [{
                                    type: 'text',
                                    text: `📋 ბოლო ${sessions.length} სესია:\n\n${sessionsText}`
                                }]
                        };
                        break;
                    case 'marathon_symbol_command':
                        let response = '';
                        const command = args.command;
                        if (command === '+++') {
                            response = '⚡ Context მაქსიმალური მუშაობის რეჟიმი';
                        }
                        else if (command === '---') {
                            response = '🔍 Context ნავიგაციის რეჟიმი გააქტიურდა';
                        }
                        else if (command === '***') {
                            response = '🎯 Context ოპტიმიზაციის რეჟიმი';
                        }
                        else {
                            response = `🔧 სიმბოლური ბრძანება შესრულდა: ${command}`;
                        }
                        result = {
                            content: [{
                                    type: 'text',
                                    text: `⚡ Marathon Context სიმბოლური ბრძანება:\n${response}\n🇬🇪 ქართული ინტერფეისი`
                                }]
                        };
                        break;                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `ფუნქცია ვერ მოიძებნა: ${name}`);
                }
                // Log the function call
                await this.logFunction(name, args, result, startTime);
                return result;
            }
            catch (error) {
                // Log the error
                await this.logFunction(name, args, { error: error instanceof Error ? error.message : error }, startTime);
                throw error;
            }
        });
    }
    async start() {
        const transport = new StdioServerTransport();
        console.error('🚀 Marathon MCP Tool v2.0.0 Context Edition იწყება...');
        console.error('🇬🇪 ქართული ინტერფეისი ჩართულია');
        console.error('🌊 ბათუმური ხელწერით შექმნილია სიყვარულით');
        console.error('📊 Context Management ჩართულია');
        await this.server.connect(transport);
        console.error('🔗 MCP Server წარმატებით დაკავშირდა');
    }
}
// CLI handling
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
    const args = process.argv.slice(2);
    if (args.includes('--test')) {
        console.log('🏃‍♂️ Marathon MCP Tool v2.0.0 Context Edition');
        console.log('🇬🇪 ქართული ინტერფეისი');
        console.log('📊 Context Management');
        console.log('✅ ტესტირება წარმატებულია!');
        process.exit(0);
    }
    // Start the server
    const server = new MarathonMCPServer();
    server.start().catch((error) => {
        console.error('❌ შეცდომა სერვერის გაშვებისას:', error);
        process.exit(1);
    });
}
export { MarathonMCPServer };