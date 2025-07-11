/**
 * 🏃‍♂️ Marathon Mode Manager v1.0.0
 * მარათონ რეჟიმის მენეჯერი
 * 
 * Features / ფუნქციები:
 * - Auto-save functionality / ავტომატური შენახვის ფუნქცია
 * - Session recovery / სესიის აღდგენა
 * - Project tracking / პროექტის ტრექინგი
 * - Context preservation / კონტექსტის შენარჩუნება
 * - Progress monitoring / პროგრესის მონიტორინგი
 */

import { SQLiteAdapter } from './sqlite-adapter.js';
import { MarathonLogger } from '../../utils/logger.js';

export class MarathonMode {
  private isActive: boolean = false;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private sqliteAdapter: SQLiteAdapter;
  private logger: MarathonLogger;
  private currentProject: string | null = null;
  private sessionId: string | null = null;
  private autoSaveInterval: number = 2; // minutes
  private saveCount: number = 0;
  private startTime: Date | null = null;

  constructor(sqliteAdapter: SQLiteAdapter, logger: MarathonLogger) {
    this.sqliteAdapter = sqliteAdapter;
    this.logger = logger;
  }

  public async activate(projectName?: string, interval: number = 2): Promise<any> {
    try {
      if (this.isActive) {
        return {
          status: 'already_active',
          message: '🏃‍♂️ მარათონ რეჟიმი უკვე აქტიურია / Marathon Mode is already active',
          current_project: this.currentProject,
          active_since: this.startTime?.toISOString(),
          auto_saves_completed: this.saveCount
        };
      }

      // Initialize Marathon Mode
      this.isActive = true;
      this.currentProject = projectName || `Marathon Project ${Date.now()}`;
      this.autoSaveInterval = interval;
      this.sessionId = this.generateSessionId();
      this.startTime = new Date();
      this.saveCount = 0;

      // Save marathon session to database
      await this.sqliteAdapter.saveMarathonSession(this.sessionId, this.currentProject);

      // Start auto-save timer
      this.startAutoSave();

      // Initial save
      await this.performAutoSave('Marathon Mode activation');

      return {
        status: 'activated',
        message: '🏃‍♂️ მარათონ რეჟიმი წარმატებით ჩაირთო / Marathon Mode successfully activated',
        details: {
          georgian: 'გრძელვადიანი პროექტების მუშაობისთვის ოპტიმიზებული რეჟიმი',
          english: 'Optimized mode for long-term project work'
        },
        project_name: this.currentProject,
        session_id: this.sessionId,
        auto_save_interval: `${this.autoSaveInterval} minutes`,
        features: {
          auto_save: true,
          session_recovery: true,
          project_tracking: true,
          context_preservation: true,
          progress_monitoring: true,
          emergency_save: true
        },
        batumi_wisdom: '🌊 გრძელი გზა ნაბიჯ-ნაბიჯ გაივლება - ყოველი ნაბიჯი ირჩება / Long journey is walked step by step - every step is saved',
        instructions: {
          georgian: 'თქვენი მუშაობა ყოველ ' + this.autoSaveInterval + ' წუთში ავტომატურად ირჩება',
          english: 'Your work is automatically saved every ' + this.autoSaveInterval + ' minutes'
        },
        started_at: this.startTime.toISOString()
      };
    } catch (error) {
      this.isActive = false;
      throw new Error(`Marathon Mode activation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async deactivate(saveFinalState: boolean = true): Promise<any> {
    try {
      if (!this.isActive) {
        return {
          status: 'not_active',
          message: '⏹️ მარათონ რეჟიმი აქტიური არ არის / Marathon Mode is not active',
          note: 'Nothing to deactivate / გამორთვაზე არაფერია'
        };
      }

      // Stop auto-save timer
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer);
        this.autoSaveTimer = null;
      }

      // Final save if requested
      if (saveFinalState) {
        await this.performAutoSave('Marathon Mode deactivation - final save');
      }

      // End marathon session in database
      if (this.sessionId) {
        await this.sqliteAdapter.endMarathonSession(this.sessionId);
      }

      // Calculate session statistics
      const endTime = new Date();
      const durationMs = this.startTime ? endTime.getTime() - this.startTime.getTime() : 0;
      const durationMinutes = Math.floor(durationMs / 60000);
      const durationHours = Math.floor(durationMinutes / 60);

      const stats = {
        project_name: this.currentProject,
        session_id: this.sessionId,
        duration: {
          total_minutes: durationMinutes,
          hours: durationHours,
          minutes: durationMinutes % 60,
          formatted: this.formatDuration(durationMs)
        },
        auto_saves_completed: this.saveCount,
        avg_save_interval: this.saveCount > 0 ? Math.floor(durationMinutes / this.saveCount) : 0
      };

      // Reset state
      this.isActive = false;
      this.currentProject = null;
      this.sessionId = null;
      this.startTime = null;
      this.saveCount = 0;

      return {
        status: 'deactivated',
        message: '⏹️ მარათონ რეჟიმი წარმატებით გამოირთო / Marathon Mode successfully deactivated',
        details: {
          georgian: 'სესია დასრულდა და ყველა ცვლილება შენახულია',
          english: 'Session completed and all changes saved'
        },
        session_statistics: stats,
        final_save_completed: saveFinalState,
        batumi_wisdom: '🌊 კარგად დასრულებული საქმე - ნახევარ გაკეთებული საქმე / Well finished work is half the work',
        gratitude: {
          georgian: 'გმადლობთ მარათონ რეჟიმის გამოყენებისთვის!',
          english: 'Thank you for using Marathon Mode!'
        },
        ended_at: endTime.toISOString()
      };
    } catch (error) {
      throw new Error(`Marathon Mode deactivation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private startAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(async () => {
      await this.performAutoSave('Scheduled auto-save');
    }, this.autoSaveInterval * 60 * 1000); // Convert minutes to milliseconds
  }

  private async performAutoSave(reason: string = 'Auto-save'): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const checkpoint = {
        session_id: this.sessionId!,
        context: reason,
        timestamp,
        type: 'auto',
        project_name: this.currentProject,
        save_number: this.saveCount + 1,
        marathon_active: true
      };

      await this.sqliteAdapter.saveCheckpoint(checkpoint);
      this.saveCount++;

      // Log the save
      await this.logger.logInfo(`🏃‍♂️ Marathon auto-save #${this.saveCount}: ${reason}`, 'marathon-mode');

      console.log(`🏃‍♂️ Marathon auto-save #${this.saveCount} completed: ${timestamp}`);
    } catch (error) {
      console.error('❌ Marathon auto-save failed:', error);
    }
  }

  public async manualSave(description?: string, priority: string = 'normal'): Promise<any> {
    try {
      if (!this.isActive) {
        return {
          status: 'not_active',
          message: '⚠️ მარათონ რეჟიმი აქტიური არ არის / Marathon Mode is not active',
          note: 'Activate Marathon Mode first / ჯერ ჩართეთ მარათონ რეჟიმი'
        };
      }

      const saveReason = description || `Manual save (${priority})`;
      await this.performAutoSave(saveReason);

      return {
        status: 'saved',
        message: '💾 ხელით შენახვა დასრულდა / Manual save completed',
        details: {
          georgian: 'მიმდინარე მდგომარეობა წარმატებით შენახულია',
          english: 'Current state successfully saved'
        },
        save_info: {
          description: saveReason,
          priority,
          save_number: this.saveCount,
          session_id: this.sessionId,
          project: this.currentProject
        },
        batumi_wisdom: '🌊 ხელით შენახული - გულით შენახული / Manually saved - saved with heart',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `❌ ხელით შენახვის შეცდომა: ${error instanceof Error ? error.message : 'Unknown error'} / Manual save error`,
        timestamp: new Date().toISOString()
      };
    }
  }

  public async getStatus(): Promise<any> {
    if (!this.isActive) {
      return {
        status: 'inactive',
        message: '⏸️ მარათონ რეჟიმი გამორთულია / Marathon Mode is inactive',
        available_actions: ['activate'],
        batumi_note: '🌊 მზად ვართ ახალი მარათონისთვის / Ready for new marathon'
      };
    }

    const now = new Date();
    const durationMs = this.startTime ? now.getTime() - this.startTime.getTime() : 0;
    const nextSave = this.autoSaveTimer ? new Date(now.getTime() + (this.autoSaveInterval * 60 * 1000)) : null;

    return {
      status: 'active',
      message: '🏃‍♂️ მარათონ რეჟიმი აქტიურია / Marathon Mode is active',
      project_info: {
        name: this.currentProject,
        session_id: this.sessionId,
        started_at: this.startTime?.toISOString(),
        duration: this.formatDuration(durationMs)
      },
      auto_save_info: {
        interval_minutes: this.autoSaveInterval,
        saves_completed: this.saveCount,
        next_save_at: nextSave?.toISOString(),
        next_save_in: this.getTimeUntilNextSave()
      },
      available_actions: ['deactivate', 'manual_save', 'emergency_save'],
      batumi_encouragement: '🌊 მარათონი გრძელდება - ყოველი ნაბიჯი მნიშვნელოვანია / Marathon continues - every step matters'
    };
  }

  private formatDuration(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private getTimeUntilNextSave(): string {
    if (!this.autoSaveTimer || !this.startTime) return 'Unknown';

    const now = Date.now();
    const lastSaveTime = this.startTime.getTime() + (this.saveCount * this.autoSaveInterval * 60 * 1000);
    const nextSaveTime = lastSaveTime + (this.autoSaveInterval * 60 * 1000);
    const timeUntilNext = Math.max(0, nextSaveTime - now);

    const minutes = Math.floor(timeUntilNext / 60000);
    const seconds = Math.floor((timeUntilNext % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  }

  private generateSessionId(): string {
    return `marathon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public isActive(): boolean {
    return this.isActive;
  }

  public getCurrentProject(): string | null {
    return this.currentProject;
  }

  public getSaveCount(): number {
    return this.saveCount;
  }

  public getSessionId(): string | null {
    return this.sessionId;
  }

  // Emergency save (can be called from symbol commands)
  public async emergencySave(reason?: string): Promise<any> {
    const saveReason = reason || 'Emergency save triggered';
    
    if (this.isActive) {
      return await this.manualSave(saveReason, 'emergency');
    } else {
      // Even if marathon mode is not active, we can still do emergency save
      const checkpoint = {
        session_id: 'emergency_' + Date.now(),
        context: saveReason,
        timestamp: new Date().toISOString(),
        type: 'emergency',
        marathon_active: false
      };

      await this.sqliteAdapter.saveCheckpoint(checkpoint);

      return {
        status: 'saved',
        message: '🆘 გადაუდებელი შენახვა დასრულდა / Emergency save completed',
        details: {
          georgian: 'მდგომარეობა გადაუდებლად შენახულია',
          english: 'State saved urgently'
        },
        checkpoint_id: checkpoint.session_id,
        batumi_wisdom: '🌊 უსაფრთხოება ყველაზე მნიშვნელოვანია / Safety is most important',
        timestamp: checkpoint.timestamp
      };
    }
  }
}