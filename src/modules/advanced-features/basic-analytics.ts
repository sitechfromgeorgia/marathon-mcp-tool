/**
 * 📊 Basic Analytics Engine v1.0.0
 * ძირითადი ანალიტიკის ძრავა
 * 
 * Features / ფუნქციები:
 * - Function usage tracking / ფუნქციების გამოყენების ტრექინგი
 * - Performance monitoring / შესრულების მონიტორინგი
 * - User behavior analysis / მომხმარებლის ქცევის ანალიზი
 * - System health metrics / სისტემის ჯანმრთელობის მეტრიკები
 */

export class BasicAnalytics {
  private events: Map<string, number> = new Map();
  private eventHistory: Array<{event: string, timestamp: string, properties?: any}> = [];
  private sessionStart: Date;
  private performanceMetrics: Map<string, {totalTime: number, callCount: number}> = new Map();

  constructor() {
    this.sessionStart = new Date();
    this.track('analytics_initialized');
  }

  public track(eventName: string, properties?: any): void {
    // Update event counter
    const currentCount = this.events.get(eventName) || 0;
    this.events.set(eventName, currentCount + 1);

    // Add to history
    this.eventHistory.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      properties
    });

    // Keep history size manageable (last 1000 events)
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000);
    }
  }

  public trackPerformance(functionName: string, executionTime: number): void {
    const current = this.performanceMetrics.get(functionName) || {totalTime: 0, callCount: 0};
    this.performanceMetrics.set(functionName, {
      totalTime: current.totalTime + executionTime,
      callCount: current.callCount + 1
    });
  }

  public getReport(period: string = 'today', detailed: boolean = false): any {
    const now = new Date();
    const sessionDuration = now.getTime() - this.sessionStart.getTime();

    const baseReport = {
      status: 'success',
      message: '📊 ანალიტიკის რეპორტი / Analytics Report',
      period,
      generated_at: now.toISOString(),
      session_info: {
        started_at: this.sessionStart.toISOString(),
        duration: this.formatDuration(sessionDuration),
        total_events: this.eventHistory.length
      },
      top_functions: this.getTopFunctions(10),
      performance_summary: this.getPerformanceSummary(),
      batumi_insights: this.getBatumiInsights(),
      development_note: '🚧 ძირითადი ანალიტიკა - მომავალში გაფართოვდება / Basic analytics - will be expanded in future'
    };

    if (detailed) {
      return {
        ...baseReport,
        detailed_metrics: {
          all_events: Object.fromEntries(this.events),
          recent_activity: this.getRecentActivity(20),
          performance_details: this.getDetailedPerformance(),
          usage_patterns: this.getUsagePatterns(),
          system_health: this.getSystemHealth()
        }
      };
    }

    return baseReport;
  }

  private getTopFunctions(limit: number = 10): any[] {
    const sorted = Array.from(this.events.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return sorted.map(([event, count], index) => ({
      rank: index + 1,
      function: event,
      usage_count: count,
      percentage: ((count / this.getTotalEvents()) * 100).toFixed(1) + '%',
      georgian_name: this.getGeorgianName(event)
    }));
  }

  private getPerformanceSummary(): any {
    const performances = Array.from(this.performanceMetrics.entries())
      .map(([name, metrics]) => ({
        function: name,
        average_time: Math.round(metrics.totalTime / metrics.callCount),
        total_calls: metrics.callCount,
        total_time: metrics.totalTime
      }))
      .sort((a, b) => b.average_time - a.average_time);

    return {
      fastest_function: performances[performances.length - 1] || null,
      slowest_function: performances[0] || null,
      total_functions_tracked: performances.length,
      average_response_time: this.getAverageResponseTime()
    };
  }

  private getBatumiInsights(): any {
    const totalEvents = this.getTotalEvents();
    const sessionHours = (Date.now() - this.sessionStart.getTime()) / 3600000;
    const eventsPerHour = totalEvents / Math.max(sessionHours, 0.1);

    return {
      productivity_level: this.getProductivityLevel(eventsPerHour),
      batumi_wisdom: this.getBatumiWisdom(totalEvents),
      usage_intensity: eventsPerHour.toFixed(1) + ' events/hour',
      georgian_assessment: this.getGeorgianAssessment(totalEvents),
      session_quality: this.getSessionQuality()
    };
  }

  private getRecentActivity(limit: number = 20): any[] {
    return this.eventHistory
      .slice(-limit)
      .reverse()
      .map(item => ({
        event: item.event,
        georgian_name: this.getGeorgianName(item.event),
        timestamp: item.timestamp,
        time_ago: this.getTimeAgo(item.timestamp),
        properties: item.properties
      }));
  }

  private getDetailedPerformance(): any {
    return Array.from(this.performanceMetrics.entries()).map(([name, metrics]) => ({
      function: name,
      georgian_name: this.getGeorgianName(name),
      statistics: {
        total_calls: metrics.callCount,
        total_time_ms: metrics.totalTime,
        average_time_ms: Math.round(metrics.totalTime / metrics.callCount),
        calls_per_session: metrics.callCount,
        performance_rating: this.getPerformanceRating(metrics.totalTime / metrics.callCount)
      }
    }));
  }

  private getUsagePatterns(): any {
    const patterns = {
      most_active_period: this.getMostActivePeriod(),
      function_categories: this.categorizeFunctions(),
      usage_trends: this.getUsageTrends(),
      user_preferences: this.getUserPreferences()
    };

    return patterns;
  }

  private getSystemHealth(): any {
    const errorEvents = this.countEventsByPattern('error');
    const successEvents = this.countEventsByPattern('success');
    const totalEvents = this.getTotalEvents();

    return {
      health_score: this.calculateHealthScore(errorEvents, successEvents, totalEvents),
      error_rate: totalEvents > 0 ? ((errorEvents / totalEvents) * 100).toFixed(2) + '%' : '0%',
      success_rate: totalEvents > 0 ? ((successEvents / totalEvents) * 100).toFixed(2) + '%' : '0%',
      stability_assessment: this.getStabilityAssessment(errorEvents, totalEvents),
      georgian_health_note: this.getGeorgianHealthNote(errorEvents, totalEvents)
    };
  }

  // Helper methods
  private getTotalEvents(): number {
    return Array.from(this.events.values()).reduce((sum, count) => sum + count, 0);
  }

  private getAverageResponseTime(): number {
    const metrics = Array.from(this.performanceMetrics.values());
    if (metrics.length === 0) return 0;

    const totalTime = metrics.reduce((sum, m) => sum + m.totalTime, 0);
    const totalCalls = metrics.reduce((sum, m) => sum + m.callCount, 0);

    return totalCalls > 0 ? Math.round(totalTime / totalCalls) : 0;
  }

  private getProductivityLevel(eventsPerHour: number): string {
    if (eventsPerHour > 50) return 'ძალიან მაღალი / Very High';
    if (eventsPerHour > 20) return 'მაღალი / High';
    if (eventsPerHour > 10) return 'საშუალო / Medium';
    if (eventsPerHour > 5) return 'დაბალი / Low';
    return 'ძალიან დაბალი / Very Low';
  }

  private getBatumiWisdom(totalEvents: number): string {
    const wisdoms = [
      '🌊 ზღვის ტალღები ნელ-ნელა ქვას ამუშავებს / Sea waves slowly shape the stone',
      '🏔️ მთა ნაბიჯ-ნაბიჯ აიმაღლება / Mountain rises step by step',
      '☕ ქართული ყავა ნელა ისხამება, მაგრამ გემრიელად / Georgian coffee brews slowly, but deliciously',
      '🍇 ღვინო დროთა განმავლობაში გამოიშურება / Wine matures over time',
      '🌊 ბათუმის ღამე ლამაზია, დღეც / Batumi night is beautiful, so is the day'
    ];

    const index = totalEvents % wisdoms.length;
    return wisdoms[index];
  }

  private getGeorgianAssessment(totalEvents: number): string {
    if (totalEvents > 100) return 'ბრავო! ძალიან აქტიური მუშაობა / Bravo! Very active work';
    if (totalEvents > 50) return 'კარგი ტემპი / Good pace';
    if (totalEvents > 20) return 'თანდათანობით / Gradually';
    if (totalEvents > 10) return 'კარგი დასაწყისი / Good beginning';
    return 'იწყება მუშაობა / Work is starting';
  }

  private getSessionQuality(): string {
    const errorCount = this.countEventsByPattern('error');
    const totalEvents = this.getTotalEvents();
    const errorRate = totalEvents > 0 ? errorCount / totalEvents : 0;

    if (errorRate < 0.05) return 'შესანიშნავი / Excellent';
    if (errorRate < 0.1) return 'კარგი / Good';
    if (errorRate < 0.2) return 'საშუალო / Average';
    return 'საჭიროებს გაუმჯობესებას / Needs improvement';
  }

  private getGeorgianName(eventName: string): string {
    const georgianNames: Record<string, string> = {
      'marathon_test_connection': 'კავშირის ტესტირება',
      'marathon_read_file': 'ფაილის წაკითხვა',
      'marathon_write_file': 'ფაილში ჩაწერა',
      'marathon_memory_save': 'მეხსიერების შენახვა',
      'marathon_memory_load': 'მეხსიერების ჩატვირთვა',
      'marathon_symbol_command': 'სიმბოლური ბრძანება',
      'marathon_mode_activate': 'მარათონ რეჟიმის ჩართვა',
      'marathon_analytics_report': 'ანალიტიკის რეპორტი',
      'analytics_initialized': 'ანალიტიკა ინიციალიზებული'
    };

    return georgianNames[eventName] || eventName;
  }

  private formatDuration(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  private getTimeAgo(timestamp: string): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'ახლახან / Just now';
    if (diffMins < 60) return `${diffMins} წუთის წინ / ${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} საათის წინ / ${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} დღის წინ / ${diffDays} days ago`;
  }

  private getPerformanceRating(avgTime: number): string {
    if (avgTime < 100) return 'შესანიშნავი / Excellent';
    if (avgTime < 500) return 'კარგი / Good';
    if (avgTime < 1000) return 'საშუალო / Average';
    return 'ნელი / Slow';
  }

  private countEventsByPattern(pattern: string): number {
    return Array.from(this.events.keys())
      .filter(key => key.toLowerCase().includes(pattern.toLowerCase()))
      .reduce((sum, key) => sum + (this.events.get(key) || 0), 0);
  }

  private calculateHealthScore(errors: number, successes: number, total: number): number {
    if (total === 0) return 100;
    const errorRate = errors / total;
    return Math.max(0, Math.round((1 - errorRate) * 100));
  }

  private getStabilityAssessment(errors: number, total: number): string {
    const errorRate = total > 0 ? errors / total : 0;
    if (errorRate < 0.01) return 'ძალიან სტაბილური / Very Stable';
    if (errorRate < 0.05) return 'სტაბილური / Stable';
    if (errorRate < 0.1) return 'საშუალოდ სტაბილური / Moderately Stable';
    return 'არასტაბილური / Unstable';
  }

  private getGeorgianHealthNote(errors: number, total: number): string {
    if (errors === 0) return 'სისტემა მუშაობს შესანიშნავად! / System works excellently!';
    if (errors < total * 0.05) return 'სისტემა კარგ მდგომარეობაშია / System is in good condition';
    return 'სისტემას სჭირდება ყურადღება / System needs attention';
  }

  private getMostActivePeriod(): string {
    // Simple implementation - could be enhanced with time-based analysis
    return 'Current session / მიმდინარე სესია';
  }

  private categorizeFunctions(): any {
    const categories = {
      'core': ['marathon_test_connection', 'marathon_get_config'],
      'file': ['marathon_read_file', 'marathon_write_file'],
      'memory': ['marathon_memory_save', 'marathon_memory_load'],
      'advanced': ['marathon_symbol_command', 'marathon_mode_activate']
    };

    const result: any = {};
    for (const [category, functions] of Object.entries(categories)) {
      result[category] = functions.reduce((sum, func) => sum + (this.events.get(func) || 0), 0);
    }

    return result;
  }

  private getUsageTrends(): string {
    return 'Consistent usage / თანმიმდევრული გამოყენება';
  }

  private getUserPreferences(): any {
    const topFunction = this.getTopFunctions(1)[0];
    return {
      most_used_feature: topFunction?.function || 'None',
      georgian_preference: topFunction?.georgian_name || 'არაფერი'
    };
  }

  public getEventCount(): number {
    return this.getTotalEvents();
  }

  public reset(): void {
    this.events.clear();
    this.eventHistory = [];
    this.performanceMetrics.clear();
    this.sessionStart = new Date();
    this.track('analytics_reset');
  }
}