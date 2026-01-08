
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
  },

  /**
   * Returns a map of variation_id -> success rate (0.0 to 1.0)
   * used for weighting the randomizer.
   */
  getVariationSuccessRates: () => {
    const attempts = AnalyticsService.getAllAttempts();
    const stats: Record<string, { total: number; success: number }> = {};

    attempts.forEach(a => {
      if (!stats[a.variation_id]) {
        stats[a.variation_id] = { total: 0, success: 0 };
      }
      stats[a.variation_id].total += 1;
      if (a.success) {
        stats[a.variation_id].success += 1;
      }
    });

    const rates: Record<string, number> = {};
    Object.keys(stats).forEach(id => {
      const { total, success } = stats[id];
      rates[id] = total === 0 ? 0 : success / total;
    });

    return rates;
  },

  /**
   * Returns a Set of variation_ids that have been completed successfully at least once.
   */
  getMasteredVariationIds: () => {
    const attempts = AnalyticsService.getAllAttempts();
    const mastered = new Set<string>();
    attempts.forEach(a => {
      if (a.success) {
        mastered.add(a.variation_id);
      }
    });
    return mastered;
  }
};
