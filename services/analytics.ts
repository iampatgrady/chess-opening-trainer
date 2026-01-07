
import { TrainingAttempt } from '../types';

const STORAGE_KEY = 'chess_trainer_analytics_v1';

export const AnalyticsService = {
  saveAttempt: (attempt: Omit<TrainingAttempt, 'id' | 'timestamp'>) => {
    const fullAttempt: TrainingAttempt = {
      ...attempt,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const existingData = AnalyticsService.getAllAttempts();
    const newData = [...existingData, fullAttempt];
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save analytics data", e);
    }
  },

  getAllAttempts: (): TrainingAttempt[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse analytics data", e);
      return [];
    }
  },

  clearData: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getStatsSummary: () => {
    const attempts = AnalyticsService.getAllAttempts();
    
    const totalSessions = attempts.length;
    if (totalSessions === 0) return null;

    const totalTimeMs = attempts.reduce((acc, curr) => acc + curr.duration_ms, 0);
    const successCount = attempts.filter(a => a.success).length;
    
    return {
      totalTimeMs,
      totalVariationsCompleted: totalSessions,
      globalSuccessRate: (successCount / totalSessions) * 100,
    };
  }
};
