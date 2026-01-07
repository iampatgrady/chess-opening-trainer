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