/**
 * Analytics utilities for tracking onboarding questionnaire effectiveness
 * Provides insights into user behavior and completion rates
 */

export interface OnboardingAnalyticsEvent {
  eventType: 'started' | 'question_answered' | 'question_skipped' | 'completed' | 'abandoned';
  questionId?: number;
  questionCategory?: string;
  answerType?: 'single' | 'multiple' | 'scale' | 'text';
  timeSpent?: number;
  sessionId: string;
  timestamp: Date;
  userAgent?: string;
}

export interface OnboardingSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  questionsAnswered: number;
  totalQuestions: number;
  completionRate: number;
  averageTimePerQuestion: number;
  abandonedAt?: number;
  completed: boolean;
}

export class OnboardingAnalytics {
  private static events: OnboardingAnalyticsEvent[] = [];
  private static sessions: Map<string, OnboardingSession> = new Map();

  /**
   * Track when onboarding starts
   */
  static trackOnboardingStart(sessionId: string, totalQuestions: number): void {
    const session: OnboardingSession = {
      sessionId,
      startTime: new Date(),
      questionsAnswered: 0,
      totalQuestions,
      completionRate: 0,
      averageTimePerQuestion: 0,
      completed: false,
    };

    this.sessions.set(sessionId, session);
    
    this.trackEvent({
      eventType: 'started',
      sessionId,
      timestamp: new Date(),
    });
  }

  /**
   * Track when a question is answered
   */
  static trackQuestionAnswered(
    sessionId: string,
    questionId: number,
    questionCategory: string,
    answerType: 'single' | 'multiple' | 'scale' | 'text',
    timeSpent: number
  ): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.questionsAnswered++;
      session.completionRate = (session.questionsAnswered / session.totalQuestions) * 100;
      
      // Update average time per question
      const totalTime = new Date().getTime() - session.startTime.getTime();
      session.averageTimePerQuestion = totalTime / session.questionsAnswered;
    }

    this.trackEvent({
      eventType: 'question_answered',
      questionId,
      questionCategory,
      answerType,
      timeSpent,
      sessionId,
      timestamp: new Date(),
    });
  }

  /**
   * Track when onboarding is completed
   */
  static trackOnboardingCompleted(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = new Date();
      session.completed = true;
      session.completionRate = 100;
    }

    this.trackEvent({
      eventType: 'completed',
      sessionId,
      timestamp: new Date(),
    });
  }

  /**
   * Track when onboarding is abandoned
   */
  static trackOnboardingAbandoned(sessionId: string, abandonedAt: number): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = new Date();
      session.abandonedAt = abandonedAt;
    }

    this.trackEvent({
      eventType: 'abandoned',
      sessionId,
      timestamp: new Date(),
    });
  }

  /**
   * Get analytics summary for optimization
   */
  static getAnalyticsSummary(): {
    totalSessions: number;
    completionRate: number;
    averageTimeToComplete: number;
    mostSkippedQuestions: { questionId: number; skipCount: number }[];
    categoryEngagement: { category: string; averageTime: number }[];
    dropOffPoints: { questionId: number; dropOffRate: number }[];
  } {
    const sessions = Array.from(this.sessions.values());
    const completedSessions = sessions.filter(s => s.completed);
    
    const completionRate = sessions.length > 0 
      ? (completedSessions.length / sessions.length) * 100 
      : 0;

    const averageTimeToComplete = completedSessions.length > 0
      ? completedSessions.reduce((sum, session) => {
          const duration = session.endTime 
            ? session.endTime.getTime() - session.startTime.getTime()
            : 0;
          return sum + duration;
        }, 0) / completedSessions.length
      : 0;

    // Calculate category engagement
    const categoryTimes = this.events
      .filter(e => e.eventType === 'question_answered' && e.timeSpent)
      .reduce((acc, event) => {
        if (event.questionCategory && event.timeSpent) {
          if (!acc[event.questionCategory]) {
            acc[event.questionCategory] = { total: 0, count: 0 };
          }
          acc[event.questionCategory].total += event.timeSpent;
          acc[event.questionCategory].count++;
        }
        return acc;
      }, {} as Record<string, { total: number; count: number }>);

    const categoryEngagement = Object.entries(categoryTimes).map(([category, data]) => ({
      category,
      averageTime: data.total / data.count,
    }));

    return {
      totalSessions: sessions.length,
      completionRate,
      averageTimeToComplete,
      mostSkippedQuestions: [], // Would be calculated from skip events
      categoryEngagement,
      dropOffPoints: [], // Would be calculated from abandonment patterns
    };
  }

  /**
   * Private method to track events
   */
  private static trackEvent(event: OnboardingAnalyticsEvent): void {
    this.events.push(event);
    
    // In production, send to analytics service
    console.log('Onboarding Analytics:', event);
  }

  /**
   * Clear analytics data (useful for testing)
   */
  static clearData(): void {
    this.events = [];
    this.sessions.clear();
  }

  /**
   * Export data for analysis
   */
  static exportData(): {
    events: OnboardingAnalyticsEvent[];
    sessions: OnboardingSession[];
  } {
    return {
      events: this.events,
      sessions: Array.from(this.sessions.values()),
    };
  }
}