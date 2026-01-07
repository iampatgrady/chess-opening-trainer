
export interface OpeningVariation {
  variation_id: string;
  name: string;
  eco_code: string;
  parent_opening: string;
  moves_san: string[]; // Variable length
  player_side?: 'w' | 'b'; // 'w' for White, 'b' for Black
  fen_10_ply: string;
  strategic_themes: string[];
  statistical_profile: {
    white_win_percent: number;
    black_win_percent: number;
    draw_percent: number;
  };
  category: 'book' | 'trap';
  description?: string;
}

export interface TrainingAttempt {
  id: string;
  timestamp: number; // Unix timestamp
  variation_id: string;
  variation_name: string;
  parent_opening: string;
  category: 'book' | 'trap';
  player_side: 'w' | 'b';
  duration_ms: number; // Time to complete variation
  avg_time_per_move_ms: number;
  success: boolean; // True if no errors were made
  mistake_count: number;
}
