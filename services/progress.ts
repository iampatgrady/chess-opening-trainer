
const PROGRESS_KEY = 'chess_trainer_progress_v1';

interface ProgressData {
  book: string[];
  trap: string[];
}

export const ProgressService = {
  getProgress: (): ProgressData => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      return stored ? JSON.parse(stored) : { book: [], trap: [] };
    } catch {
      return { book: [], trap: [] };
    }
  },
  
  markComplete: (variationId: string, category: 'book' | 'trap') => {
    const data = ProgressService.getProgress();
    // Ensure array exists
    if (!data[category]) data[category] = [];
    
    if (!data[category].includes(variationId)) {
        data[category].push(variationId);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    }
  },

  resetMode: (category: 'book' | 'trap') => {
    const data = ProgressService.getProgress();
    data[category] = [];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  }
};
