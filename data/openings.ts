import { OpeningVariation } from '../types';

export const OPENINGS_DB: OpeningVariation[] = [
  {
    "variation_id": "RL_EXC_001",
    "name": "Ruy Lopez: Exchange Variation",
    "eco_code": "C68",
    "parent_opening": "Ruy Lopez",
    "moves_san": [
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
    },
    "category": "book",
    "description": "White trades the bishop for the knight to double Black's pawns and aim for a superior endgame structure."
  },
  {
    "variation_id": "RL_CLO_001",
    "name": "Ruy Lopez: Closed Main Line",
    "eco_code": "C84",
    "parent_opening": "Ruy Lopez",
    "moves_san": [
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
    },
    "category": "book",
    "description": "The classical approach to the Ruy Lopez, leading to a complex strategic battle with chances for both sides."
  },
  {
    "variation_id": "RL_BER_001",
    "name": "Ruy Lopez: Berlin Defense",
    "eco_code": "C65",
    "parent_opening": "Ruy Lopez",
    "moves_san": [
      "e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6", "O-O", "Nxe4", "d4", "Nd6"
    ],
    "player_side": "b",
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
    },
    "category": "book",
    "description": "A super-solid defensive system for Black, known for its high draw rate and resilience at the top level."
  },
  {
    "variation_id": "RL_SCH_001",
    "name": "Ruy Lopez: Schliemann Gambit",
    "eco_code": "C63",
    "parent_opening": "Ruy Lopez",
    "moves_san": [
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
    },
    "category": "book",
    "description": "An aggressive gambit line where Black challenges White's center immediately, leading to sharp positions."
  },
  {
    "variation_id": "IG_PIA_001",
    "name": "Italian Game: Giuoco Pianissimo",
    "eco_code": "C50",
    "parent_opening": "Italian Game",
    "moves_san": [
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
    },
    "category": "book",
    "description": "The 'Very Quiet Game'. White builds up slowly in the center, deferring the confrontation until pieces are developed."
  },
  {
    "variation_id": "IG_EVANS_001",
    "name": "Italian Game: Evans Gambit",
    "eco_code": "C51",
    "parent_opening": "Italian Game",
    "moves_san": [
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
    },
    "category": "book",
    "description": "A romantic gambit where White sacrifices the b-pawn to gain time and control the center."
  },
  {
    "variation_id": "IG_TK_POL_001",
    "name": "Two Knights: Polerio Defense",
    "eco_code": "C58",
    "parent_opening": "Italian Game",
    "moves_san": [
      "e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Na5"
    ],
    "player_side": "b",
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
    },
    "category": "book",
    "description": "The main line defense against the Knight Attack. Black sacrifices a pawn to disrupt White's coordination."
  },
  {
    "variation_id": "SG_CLASSIC_001",
    "name": "Scotch Game: Classical Variation",
    "eco_code": "C45",
    "parent_opening": "Scotch Game",
    "moves_san": [
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
    },
    "category": "book",
    "description": "Black challenges the Knight on d4, leading to concrete tactical play."
  },
  {
    "variation_id": "SG_SCHMIDT_001",
    "name": "Scotch Game: Schmidt Variation",
    "eco_code": "C45",
    "parent_opening": "Scotch Game",
    "moves_san": [
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
    },
    "category": "book",
    "description": "Black accepts a doubled pawn structure in exchange for active piece play and open lines."
  },
  {
    "variation_id": "PD_CLASSIC_001",
    "name": "Petroff Defense: Classical Attack",
    "eco_code": "C42",
    "parent_opening": "Petroff Defense",
    "moves_san": [
      "e4", "e5", "Nf3", "Nf6", "Nxe5", "d6", "Nf3", "Nxe4", "d4", "d5"
    ],
    "player_side": "b",
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
    },
    "category": "book",
    "description": "A very solid and symmetrical defense where Black mirrors White's play to neutralize the initiative."
  },
  {
    "variation_id": "PH_EXC_001",
    "name": "Philidor Defense: Exchange Variation",
    "eco_code": "C41",
    "parent_opening": "Philidor Defense",
    "moves_san": [
      "e4", "e5", "Nf3", "d6", "d4", "exd4", "Nxd4", "Nf6"
    ],
    "player_side": "b",
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
    },
    "category": "book",
    "description": "Black concedes the center slightly but maintains a very solid, hard-to-crack position."
  },
  {
    "variation_id": "PZ_JAE_001",
    "name": "Ponziani Opening: Jaenisch Variation",
    "eco_code": "C44",
    "parent_opening": "Ponziani Opening",
    "moves_san": [
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
    },
    "category": "book",
    "description": "A chaotic line where White seeks to establish a strong pawn center at the cost of development time."
  },
  {
    "variation_id": "FK_SPA_001",
    "name": "Four Knights: Spanish Variation",
    "eco_code": "C48",
    "parent_opening": "Four Knights Game",
    "moves_san": [
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
    },
    "category": "book",
    "description": "A symmetrical and quiet opening often leading to a draw, but with chances for outplaying the opponent in the endgame."
  },
  {
    "variation_id": "NEWB_WAYWARD_Q_01",
    "name": "Wayward Queen Attack",
    "eco_code": "C20",
    "parent_opening": "King's Pawn Game",
    "category": "trap",
    "player_side": "b", 
    "description": "The 500 Elo classic. White brings the Queen out early. Do NOT play g6 immediately. Develop Knight to c6, then g6, then hunt the Queen.",
    "moves_san": ["e4", "e5", "Qh5", "Nc6", "Bc4", "g6", "Qf3", "Nf6", "g4", "Nd4"],
    "fen_10_ply": "r1bqkb1r/pppp1p1p/5np1/4p3/2BnP1P1/5Q2/PPPP1P1P/RNB1K1NR w KQkq - 1 6",
    "strategic_themes": ["Punish early Queen", "Defend f7", "Fork trick"],
    "statistical_profile": { "white_win_percent": 45, "black_win_percent": 50, "draw_percent": 5 }
  },
  {
    "variation_id": "NEWB_ANTI_FRIED_01",
    "name": "Italian: Anti-Fried Liver Blunder",
    "eco_code": "C50",
    "parent_opening": "Italian Game",
    "category": "trap",
    "player_side": "w", 
    "description": "Black plays h6 to prevent Ng5, but wastes time. Punish immediately by blasting open the center with d4.",
    "moves_san": ["e4", "e5", "Nf3", "Nc6", "Bc4", "h6", "d4", "exd4", "Nxd4", "Qf6"],
    "fen_10_ply": "r1b1kbnr/pppp1pp1/2n2q1p/8/2BNP3/8/PPP2PPP/RNBQK2R w KQkq - 2 6",
    "strategic_themes": ["Central Break", "Punish slow play", "Development lead"],
    "statistical_profile": { "white_win_percent": 60, "black_win_percent": 30, "draw_percent": 10 }
  },
  {
    "variation_id": "NEWB_SCANDI_PATZER_01",
    "name": "Scandinavian: Patzer Check",
    "eco_code": "B01",
    "parent_opening": "Scandinavian Defense",
    "category": "trap",
    "player_side": "w", 
    "description": "Black checks with the Queen immediately. Block with the Bishop, then attack the Queen with tempo.",
    "moves_san": ["e4", "d5", "exd5", "Qxd5", "Nc3", "Qe5+", "Be2", "c6", "Nf3", "Qc7", "d4"],
    "fen_10_ply": "rnb1kbnr/ppq1pppp/2p5/8/3P4/2N2N2/PPP1BPPP/R1BQK2R b KQkq - 0 6",
    "strategic_themes": ["Gain Tempo", "Development advantage", "Safe King"],
    "statistical_profile": { "white_win_percent": 58, "black_win_percent": 35, "draw_percent": 7 }
  },
  {
    "variation_id": "NEWB_PONZIANI_COPYCAT_01",
    "name": "Ponziani: Copycat Blunder",
    "eco_code": "C44",
    "parent_opening": "Ponziani Opening",
    "category": "trap",
    "player_side": "w", 
    "description": "Black blindly copies the Italian setup. Punish them by pushing d4 and building a massive center.",
    "moves_san": ["e4", "e5", "Nf3", "Nc6", "c3", "Bc5", "d4", "exd4", "cxd4", "Bb4+", "Nc3"],
    "fen_10_ply": "r1bqk1nr/pppp1ppp/2n5/8/1b1PP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 2 6",
    "strategic_themes": ["Central Domination", "Tempo gain", "Space advantage"],
    "statistical_profile": { "white_win_percent": 55, "black_win_percent": 35, "draw_percent": 10 }
  }
];