export interface OpeningVariation {
  variation_id: string;
  name: string;
  eco_code: string;
  parent_opening: string;
  moves_san_10_ply: string[]; // Array of 10 moves (5 white, 5 black)
  fen_10_ply: string;
  strategic_themes: string[];
  statistical_profile: {
    white_win_percent: number;
    black_win_percent: number;
    draw_percent: number;
  };
}