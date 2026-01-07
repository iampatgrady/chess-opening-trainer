import { OpeningVariation } from '../types';

export const OPENINGS_DB: OpeningVariation[] = [
  {
    "variation_id": "RL_EXC_001",
    "name": "Ruy Lopez: Exchange Variation",
    "eco_code": "C68",
    "parent_opening": "Ruy Lopez",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "dxc6", "O-O", "f6"
    ],
    "fen_10_ply": "r1bqkbnr/1pp3pp/p1p2p2/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 6",
    "strategic_themes": [
      "Damage pawn structure",
      "Superior endgame for White",
      "Bishop pair for Black"
    ],
    "statistical_profile": {
      "white_win_percent": 33.1,
      "black_win_percent": 34.0,
      "draw_percent": 32.9
    }
  },
  {
    "variation_id": "RL_CLO_001",
    "name": "Ruy Lopez: Closed Main Line",
    "eco_code": "C84",
    "parent_opening": "Ruy Lopez",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7"
    ],
    "fen_10_ply": "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 6",
    "strategic_themes": [
      "Positional maneuvering",
      "Kingside attack potential",
      "The 'Spanish Torture'"
    ],
    "statistical_profile": {
      "white_win_percent": 36.5,
      "black_win_percent": 25.3,
      "draw_percent": 38.2
    }
  },
  {
    "variation_id": "RL_BER_001",
    "name": "Ruy Lopez: Berlin Defense",
    "eco_code": "C65",
    "parent_opening": "Ruy Lopez",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6", "O-O", "Nxe4", "d4", "Nd6"
    ],
    "fen_10_ply": "r1bqkb1r/pppp1ppp/2nn4/1B2p3/3P4/5N2/PPP2PPP/RNBQ1RK1 w kq - 2 6",
    "strategic_themes": [
      "The Berlin Wall",
      "Solid endgame structure",
      "Neutralizing White's initiative"
    ],
    "statistical_profile": {
      "white_win_percent": 34.5,
      "black_win_percent": 21.2,
      "draw_percent": 44.3
    }
  },
  {
    "variation_id": "RL_SCH_001",
    "name": "Ruy Lopez: Schliemann Gambit",
    "eco_code": "C63",
    "parent_opening": "Ruy Lopez",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "Bb5", "f5", "Nc3", "fxe4", "Nxe4", "d5"
    ],
    "fen_10_ply": "r1bqkbnr/ppp3pp/2n5/1B1pp3/4N3/5N2/PPPP1PPP/R1BQK2R w KQkq - 0 6",
    "strategic_themes": [
      "Sharp tactical play",
      "Counter-attacking",
      "High risk / High reward"
    ],
    "statistical_profile": {
      "white_win_percent": 39.2,
      "black_win_percent": 31.6,
      "draw_percent": 29.2
    }
  },
  {
    "variation_id": "IG_PIA_001",
    "name": "Italian Game: Giuoco Pianissimo",
    "eco_code": "C50",
    "parent_opening": "Italian Game",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "d3", "Nf6", "c3", "d6"
    ],
    "fen_10_ply": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 6",
    "strategic_themes": [
      "Slow central buildup",
      "Strategic maneuvering",
      "Avoids early simplification"
    ],
    "statistical_profile": {
      "white_win_percent": 30.5,
      "black_win_percent": 20.6,
      "draw_percent": 48.9
    }
  },
  {
    "variation_id": "IG_EVANS_001",
    "name": "Italian Game: Evans Gambit",
    "eco_code": "C51",
    "parent_opening": "Italian Game",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4", "Bxb4", "c3", "Ba5"
    ],
    "fen_10_ply": "r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/P2P1PPP/RNBQK2R w KQkq - 1 6",
    "strategic_themes": [
      "Sacrifice for initiative",
      "Rapid development",
      "Open lines"
    ],
    "statistical_profile": {
      "white_win_percent": 38.0,
      "black_win_percent": 32.0,
      "draw_percent": 30.0
    }
  },
  {
    "variation_id": "IG_TK_POL_001",
    "name": "Two Knights: Polerio Defense",
    "eco_code": "C58",
    "parent_opening": "Italian Game",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Na5"
    ],
    "fen_10_ply": "r1bqkb1r/ppp2ppp/5n2/n2Pp1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 1 6",
    "strategic_themes": [
      "Fried Liver prevention",
      "Pawn sacrifice for activity",
      "Counter-attack on Bishop"
    ],
    "statistical_profile": {
      "white_win_percent": 36.5,
      "black_win_percent": 38.7,
      "draw_percent": 24.8
    }
  },
  {
    "variation_id": "SG_CLASSIC_001",
    "name": "Scotch Game: Classical Variation",
    "eco_code": "C45",
    "parent_opening": "Scotch Game",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Bc5", "Be3", "Qf6"
    ],
    "fen_10_ply": "r1b1k1nr/pppp1ppp/2n2q2/2b5/3NP3/4B3/PPP2PPP/RN1QKB1R w KQkq - 3 6",
    "strategic_themes": [
      "Open center",
      "Piece activity over structure",
      "Concrete calculation"
    ],
    "statistical_profile": {
      "white_win_percent": 34.6,
      "black_win_percent": 41.6,
      "draw_percent": 23.7
    }
  },
  {
    "variation_id": "SG_SCHMIDT_001",
    "name": "Scotch Game: Schmidt Variation",
    "eco_code": "C45",
    "parent_opening": "Scotch Game",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Nf6", "Nxc6", "bxc6"
    ],
    "fen_10_ply": "r1bqkb1r/p1pp1ppp/2p2n2/8/4P3/8/PPP2PPP/RNBQKB1R w KQkq - 0 6",
    "strategic_themes": [
      "Structural imbalance",
      "Central space advantage",
      "Compact Black position"
    ],
    "statistical_profile": {
      "white_win_percent": 39.0,
      "black_win_percent": 26.0,
      "draw_percent": 35.0
    }
  },
  {
    "variation_id": "PD_CLASSIC_001",
    "name": "Petroff Defense: Classical Attack",
    "eco_code": "C42",
    "parent_opening": "Petroff Defense",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nf6", "Nxe5", "d6", "Nf3", "Nxe4", "d4", "d5"
    ],
    "fen_10_ply": "rnbqkb1r/ppp2ppp/8/3p4/3Pn3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 6",
    "strategic_themes": [
      "Symmetry",
      "Drawish tendencies",
      "Attrition warfare"
    ],
    "statistical_profile": {
      "white_win_percent": 36.5,
      "black_win_percent": 19.0,
      "draw_percent": 44.5
    }
  },
  {
    "variation_id": "PH_EXC_001",
    "name": "Philidor Defense: Exchange Variation",
    "eco_code": "C41",
    "parent_opening": "Philidor Defense",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "d6", "d4", "exd4", "Nxd4", "Nf6", "Nc3", "Be7"
    ],
    "fen_10_ply": "rnbqk2r/ppp1bppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 2 6",
    "strategic_themes": [
      "Solid pawn structure",
      "Space advantage for White",
      "Restricted pieces for Black"
    ],
    "statistical_profile": {
      "white_win_percent": 47.5,
      "black_win_percent": 26.6,
      "draw_percent": 25.8
    }
  },
  {
    "variation_id": "PZ_JAE_001",
    "name": "Ponziani Opening: Jaenisch Variation",
    "eco_code": "C44",
    "parent_opening": "Ponziani Opening",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "c3", "Nf6", "d4", "Nxe4", "d5", "Ne7"
    ],
    "fen_10_ply": "r1bqkb1r/ppppnppp/8/3Pp3/4n3/2P2N2/PP3PPP/RNBQKB1R w KQkq - 1 6",
    "strategic_themes": [
      "Strong pawn center",
      "Disrupted coordination",
      "Early tactical clashes"
    ],
    "statistical_profile": {
      "white_win_percent": 41.8,
      "black_win_percent": 29.9,
      "draw_percent": 28.3
    }
  },
  {
    "variation_id": "FK_SPA_001",
    "name": "Four Knights: Spanish Variation",
    "eco_code": "C48",
    "parent_opening": "Four Knights Game",
    "moves_san_10_ply": [
      "e4", "e5", "Nf3", "Nc6", "Nc3", "Nf6", "Bb5", "Bb4", "O-O", "O-O"
    ],
    "fen_10_ply": "r1bq1rk1/pppp1ppp/2n2n2/1B2p3/1b2P3/2N2N2/PPPP1PPP/R1BQ1RK1 w - - 6 6",
    "strategic_themes": [
      "Symmetrical play",
      "Quiet development",
      "High draw probability"
    ],
    "statistical_profile": {
      "white_win_percent": 32.0,
      "black_win_percent": 22.0,
      "draw_percent": 46.0
    }
  }
];