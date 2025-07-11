/**
 * 🎯 Symbol Commands Handler v1.0.0
 * სიმბოლური ბრძანებების მართვა
 * 
 * Supported symbols / მხარდაჭერილი სიმბოლოები:
 * --- : Session Reset / სესიის განულება
 * +++ : Marathon Mode / მარათონ რეჟიმი
 * ... : Continue Task / ამოცანის გაგრძელება
 * *** : Emergency Save / გადაუდებელი შენახვა
 * ### : Deep Analysis / ღრმა ანალიზი
 * @@@ : Expert Mode / ექსპერტული რეჟიმი
 */

import { SQLiteAdapter } from './sqlite-adapter.js';

export class SymbolCommands {
  private sqliteAdapter: SQLiteAdapter;
  private currentSession: string;

  constructor(sqliteAdapter: SQLiteAdapter) {
    this.sqliteAdapter = sqliteAdapter;
    this.currentSession = this.generateSessionId();
  }

  public async process(symbol: string, context?: string): Promise<any> {
    const timestamp = new Date().toISOString();
    
    try {
      let result;
      
      switch (symbol) {
        case '---':
          result = await this.resetSession(context);
          break;
        case '+++':
          result = await this.activateMarathonMode(context);
          break;
        case '...':
          result = await this.continueTask(context);
          break;
        case '***':
          result = await this.emergencySave(context);
          break;
        case '###':
          result = await this.deepAnalysisMode(context);
          break;
        case '@@@':
          result = await this.expertMode(context);
          break;
        default:
          result = this.unknownSymbol(symbol);
      }

      // Save command execution to SQLite
      await this.sqliteAdapter.saveSymbolCommand(symbol, context, result, timestamp);
      
      return result;
    } catch (error) {
      return {
        status: 'error',
        symbol,
        message: `❌ სიმბოლური ბრძანების შეცდომა: ${error instanceof Error ? error.message : 'უცნობი შეცდომა'} / Symbol command error`,
        timestamp
      };
    }
  }

  private async resetSession(context?: string): Promise<any> {
    // Generate new session ID
    const oldSession = this.currentSession;
    this.currentSession = this.generateSessionId();
    
    // Save session end
    await this.sqliteAdapter.endSession(oldSession, 'user_reset');
    
    return {
      status: 'success',
      action: 'reset_session',
      symbol: '---',
      message: '🔄 სესია განულებულია / Session reset successfully',
      details: {
        georgian: 'სესიის კონტექსტი გასუფთავებულია, პროექტი შენარჩუნებულია',
        english: 'Session context cleared, project preserved'
      },
      old_session: oldSession,
      new_session: this.currentSession,
      context: context || null,
      batumi_wisdom: '🌊 ახალი დასაწყისი - ახალი შესაძლებლობები / New beginning - new possibilities',
      timestamp: new Date().toISOString()
    };
  }

  private async activateMarathonMode(context?: string): Promise<any> {
    // Save marathon mode activation
    await this.sqliteAdapter.saveMarathonSession(this.currentSession, context);
    
    return {
      status: 'activated',
      action: 'marathon_mode_activate',
      symbol: '+++',
      message: '🏃‍♂️ მარათონ რეჟიმი ჩართულია / Marathon Mode activated',
      details: {
        georgian: 'გრძელვადიანი პროექტების მუშაობისთვის ოპტიმიზებული რეჟიმი',
        english: 'Optimized mode for long-term project work'
      },
      features: {
        auto_save: true,
        session_recovery: true,
        project_tracking: true,
        context_preservation: true,
        progress_monitoring: true
      },
      session_id: this.currentSession,
      context: context || null,
      batumi_wisdom: '🌊 გრძელი გზა ნაბიჯ-ნაბიჯ გაივლება / Long journey is walked step by step',
      instructions: {
        georgian: 'მარათონ რეჟიმში თქვენი მუშაობა ავტომატურად ირჩება',
        english: 'Your work in Marathon Mode is automatically saved'
      },
      timestamp: new Date().toISOString()
    };
  }

  private async continueTask(context?: string): Promise<any> {
    // Load last saved context
    const lastContext = await this.sqliteAdapter.getLastContext(this.currentSession);
    
    return {
      status: 'resumed',
      action: 'continue_previous',
      symbol: '...',
      message: '⏩ წინა ამოცანა გრძელდება / Continuing previous task',
      details: {
        georgian: 'ბოლო შენახული კონტექსტის ჩატვირთვა და მუშაობის გაგრძელება',
        english: 'Loading last saved context and resuming work'
      },
      last_context: lastContext,
      session_id: this.currentSession,
      context: context || null,
      batumi_wisdom: '🌊 უკან დახედვა წინ წასასვლელად / Looking back to move forward',
      loaded_data: {
        context_found: !!lastContext,
        context_age: lastContext ? this.getTimeDifference(lastContext.timestamp) : null
      },
      timestamp: new Date().toISOString()
    };
  }

  private async emergencySave(context?: string): Promise<any> {
    const checkpoint = {
      session_id: this.currentSession,
      context: context || 'Emergency save checkpoint',
      timestamp: new Date().toISOString(),
      type: 'emergency'
    };
    
    await this.sqliteAdapter.saveCheckpoint(checkpoint);
    
    return {
      status: 'saved',
      action: 'emergency_save',
      symbol: '***',
      message: '💾 გადაუდებელი შენახვა დასრულდა / Emergency save completed',
      details: {
        georgian: 'მიმდინარე მდგომარეობა უსაფრთხოდ შენახულია',
        english: 'Current state safely saved'
      },
      checkpoint_id: checkpoint.session_id + '_' + Date.now(),
      session_id: this.currentSession,
      context: context || null,
      batumi_wisdom: '🌊 უსაფრთხოება - ბუნების პირველი კანონი / Safety - nature\'s first law',
      save_location: 'SQLite database',
      recovery_info: {
        georgian: 'ეს checkpoint შეიძლება გამოყენებულ იქნას აღსადგენად',
        english: 'This checkpoint can be used for recovery'
      },
      timestamp: new Date().toISOString()
    };
  }

  private async deepAnalysisMode(context?: string): Promise<any> {
    // Enable deep analysis mode
    await this.sqliteAdapter.setSessionMode(this.currentSession, 'deep_analysis');
    
    return {
      status: 'analyzing',
      action: 'deep_analysis_mode',
      symbol: '###',
      message: '🧠 ღრმა ანალიზის რეჟიმი ჩართულია / Deep analysis mode activated',
      details: {
        georgian: 'კომპლექსური პრობლემების დეტალური ანალიზისა და გადაწყვეტის რეჟიმი',
        english: 'Mode for detailed analysis and solving complex problems'
      },
      analysis_features: {
        enhanced_reasoning: true,
        step_by_step_breakdown: true,
        multiple_perspectives: true,
        detailed_explanations: true,
        context_expansion: true
      },
      session_id: this.currentSession,
      context: context || null,
      batumi_wisdom: '🌊 ღრმა ზღვის საიდუმლოები მხოლოდ ღრმად ძირკვებს ემხელა / Deep sea secrets reveal only to deep divers',
      analysis_guidelines: {
        georgian: 'ყველა პრობლემა ნაწილ-ნაწილ გაანალიზდება',
        english: 'Every problem will be analyzed step by step'
      },
      timestamp: new Date().toISOString()
    };
  }

  private async expertMode(context?: string): Promise<any> {
    // Enable expert consultation mode
    await this.sqliteAdapter.setSessionMode(this.currentSession, 'expert_consultation');
    
    return {
      status: 'consulting',
      action: 'expert_consultation',
      symbol: '@@@',
      message: '👨‍💼 ექსპერტულ რეჟიმი ჩართულია / Expert consultation mode activated',
      details: {
        georgian: 'პროფესიონალური დონის კონსულტაცია და რჩევები',
        english: 'Professional level consultation and advice'
      },
      expert_features: {
        professional_analysis: true,
        industry_best_practices: true,
        advanced_recommendations: true,
        strategic_thinking: true,
        risk_assessment: true
      },
      session_id: this.currentSession,
      context: context || null,
      batumi_wisdom: '🌊 ექსპერტი მხოლოდ გამოცდილებით ხდება / Expert becomes only through experience',
      consultation_approach: {
        georgian: 'ყველა რჩევა პროფესიონალური გამოცდილების ბაზაზე',
        english: 'All advice based on professional experience'
      },
      available_expertise: [
        'Software Development',
        'System Architecture', 
        'Project Management',
        'Technical Strategy',
        'Georgian Development Culture'
      ],
      timestamp: new Date().toISOString()
    };
  }

  private unknownSymbol(symbol: string): any {
    return {
      status: 'unknown',
      action: 'unknown_symbol',
      symbol,
      message: `❓ უცნობი სიმბოლური ბრძანება: ${symbol} / Unknown symbol command: ${symbol}`,
      details: {
        georgian: 'ეს სიმბოლური ბრძანება არ არის ცნობილი ან მხარდაჭერილი',
        english: 'This symbol command is not recognized or supported'
      },
      supported_symbols: [
        '--- (Session Reset)',
        '+++ (Marathon Mode)',
        '... (Continue Task)',
        '*** (Emergency Save)',
        '### (Deep Analysis)',
        '@@@ (Expert Mode)'
      ],
      suggestion: {
        georgian: 'გამოიყენეთ ერთ-ერთი მხარდაჭერილი სიმბოლო',
        english: 'Use one of the supported symbols'
      },
      batumi_wisdom: '🌊 მხოლოდ ცნობილი გზები მიგვიყვანს სასურველ მიზანზე / Only known paths lead to desired destinations',
      timestamp: new Date().toISOString()
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getTimeDifference(timestamp: string): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'ახლახან / Just now';
    if (diffMins < 60) return `${diffMins} წუთის წინ / ${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} საათის წინ / ${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} დღის წინ / ${diffDays} days ago`;
  }

  public getCurrentSession(): string {
    return this.currentSession;
  }
}