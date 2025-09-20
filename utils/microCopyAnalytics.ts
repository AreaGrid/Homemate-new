/**
 * Analytics utilities for tracking micro-copy effectiveness
 * This would integrate with your analytics service (e.g., Firebase Analytics, Mixpanel)
 */

export interface MicroCopyEvent {
  messageId: number;
  language: 'english' | 'dutch';
  displayTime: number;
  userEngagement?: 'viewed' | 'interacted' | 'dismissed';
  sessionId: string;
  timestamp: Date;
}

export class MicroCopyAnalytics {
  private static events: MicroCopyEvent[] = [];

  /**
   * Track when a micro-copy message is displayed
   */
  static trackMessageDisplay(
    messageId: number,
    language: 'english' | 'dutch',
    sessionId: string
  ): void {
    const event: MicroCopyEvent = {
      messageId,
      language,
      displayTime: Date.now(),
      sessionId,
      timestamp: new Date(),
    };

    this.events.push(event);
    
    // In a real implementation, you would send this to your analytics service
    console.log('Micro-copy displayed:', event);
  }

  /**
   * Track user engagement with micro-copy area
   */
  static trackUserEngagement(
    messageId: number,
    engagementType: 'viewed' | 'interacted' | 'dismissed',
    sessionId: string
  ): void {
    const eventIndex = this.events.findIndex(
      event => event.messageId === messageId && event.sessionId === sessionId
    );

    if (eventIndex !== -1) {
      this.events[eventIndex].userEngagement = engagementType;
      console.log('User engagement tracked:', this.events[eventIndex]);
    }
  }

  /**
   * Get analytics summary for testing and optimization
   */
  static getAnalyticsSummary(): {
    totalDisplays: number;
    averageDisplayTime: number;
    engagementRate: number;
    popularMessages: { messageId: number; displays: number }[];
    languagePreference: { english: number; dutch: number };
  } {
    const totalDisplays = this.events.length;
    const engagedEvents = this.events.filter(e => e.userEngagement);
    const engagementRate = totalDisplays > 0 ? (engagedEvents.length / totalDisplays) * 100 : 0;

    // Calculate popular messages
    const messageDisplays = this.events.reduce((acc, event) => {
      acc[event.messageId] = (acc[event.messageId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const popularMessages = Object.entries(messageDisplays)
      .map(([messageId, displays]) => ({ messageId: parseInt(messageId), displays }))
      .sort((a, b) => b.displays - a.displays)
      .slice(0, 5);

    // Calculate language preference
    const languageStats = this.events.reduce(
      (acc, event) => {
        acc[event.language]++;
        return acc;
      },
      { english: 0, dutch: 0 }
    );

    return {
      totalDisplays,
      averageDisplayTime: 5000, // 5 seconds average display time
      engagementRate,
      popularMessages,
      languagePreference: languageStats,
    };
  }

  /**
   * Clear analytics data (useful for testing)
   */
  static clearData(): void {
    this.events = [];
  }
}