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
    "variation_id": "SIC_DRAGON_01",
    "name": "Sicilian Defense: Dragon Variation",
    "eco_code": "B70",
    "parent_opening": "Sicilian Defense",
    "moves_san": ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"],
    "fen_10_ply": "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
    "strategic_themes": ["Sharp Tactical Play", "Opposite Side Castling", "Piece Activity"],
    "statistical_profile": { "white_win_percent": 38, "black_win_percent": 32, "draw_percent": 30 },
    "category": "book",
    "description": "One of the sharpest openings in chess. Black fianchettoes the Bishop to breathe fire down the long diagonal."
  },
  {
    "variation_id": "FR_ADVANCE_01",
    "name": "French Defense: Advance Variation",
    "eco_code": "C02",
    "parent_opening": "French Defense",
    "moves_san": ["e4", "e6", "d4", "d5", "e5", "c5", "c3", "Nc6", "Nf3"],
    "fen_10_ply": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 1 5",
    "strategic_themes": ["Space Advantage", "Locked Center", "Pawn Chains"],
    "statistical_profile": { "white_win_percent": 40, "black_win_percent": 28, "draw_percent": 32 },
    "category": "book",
    "description": "White grabs space immediately. The battle revolves around Black trying to undermine the d4 pawn while White maintains the chain."
  },
  {
    "variation_id": "CK_ADVANCE_01",
    "name": "Caro-Kann: Advance Variation",
    "eco_code": "B12",
    "parent_opening": "Caro-Kann Defense",
    "moves_san": ["e4", "c6", "d4", "d5", "e5", "Bf5"],
    "fen_10_ply": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4",
    "strategic_themes": ["Solid Structure", "Bishop Mobility", "Space vs Solidity"],
    "statistical_profile": { "white_win_percent": 39, "black_win_percent": 29, "draw_percent": 32 },
    "category": "book",
    "description": "Unlike the French, Black gets the light-squared bishop OUT of the pawn chain before closing the door with e6."
  },
  {
    "variation_id": "VIE_GAMBIT_01",
    "name": "Vienna Game: Vienna Gambit",
    "eco_code": "C29",
    "parent_opening": "Vienna Game",
    "moves_san": ["e4", "e5", "Nc3", "Nf6", "f4", "d5", "fxe5", "Nxe4", "Nf3"],
    "fen_10_ply": "rnbqkb1r/ppp2ppp/8/3pP3/4n3/2N2N2/PPPP2PP/R1BQKB1R b KQkq - 1 5",
    "strategic_themes": ["Aggressive Center", "King's Gambit Style", "Tactical"],
    "statistical_profile": { "white_win_percent": 42, "black_win_percent": 33, "draw_percent": 25 },
    "category": "book",
    "description": "A more sound version of the King's Gambit. White attacks the center immediately while maintaining rapid development."
  },
  {
    "variation_id": "LON_SYSTEM_01",
    "name": "London System",
    "eco_code": "D02",
    "parent_opening": "Queen's Pawn Game",
    "category": "book",
    "player_side": "w",
    "description": "A universal system for White where the dark-squared bishop develops to f4 early. Extremely solid and easy to learn.",
    "moves_san": ["d4", "d5", "Bf4", "Nf6", "e3", "c5", "c3", "Nc6", "Nf3", "e6"],
    "fen_10_ply": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1B2/2P1PN2/PP3PPP/RN1QKB1R w KQkq - 1 6",
    "strategic_themes": ["Solid Triangle Structure", "Control of e5", "Bishop outside pawn chain"],
    "statistical_profile": { "white_win_percent": 36, "black_win_percent": 25, "draw_percent": 39 }
  },
  {
    "variation_id": "QGD_MAIN_01",
    "name": "Queen's Gambit Declined",
    "eco_code": "D37",
    "parent_opening": "Queen's Gambit Declined",
    "category": "book",
    "player_side": "b", 
    "description": "The gold standard of defense against 1. d4. Black holds the center firmly with ...d5 and ...e6.",
    "moves_san": ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Be7", "e3", "O-O"],
    "fen_10_ply": "rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1P3/PP3PPP/R2QKBNR w KQ - 3 6",
    "strategic_themes": ["Solid Center", "Restricted Light-Square Bishop", "Strategic Maneuvering"],
    "statistical_profile": { "white_win_percent": 38, "black_win_percent": 22, "draw_percent": 40 }
  },
  {
    "variation_id": "KID_CLASSICAL_01",
    "name": "King's Indian Defense",
    "eco_code": "E97",
    "parent_opening": "King's Indian Defense",
    "category": "book",
    "player_side": "b", 
    "description": "A hypermodern defense where Black allows White a broad center to counter-attack it later. Aggressive and complex.",
    "moves_san": ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "Nf3", "O-O"],
    "fen_10_ply": "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQ - 3 6",
    "strategic_themes": ["Kingside Attack", "Central Counter-Blows", "Dynamic Imbalance"],
    "statistical_profile": { "white_win_percent": 39, "black_win_percent": 33, "draw_percent": 28 }
  },
  {
    "variation_id": "NIMZO_INDIAN_01",
    "name": "Nimzo-Indian Defense",
    "eco_code": "E20",
    "parent_opening": "Nimzo-Indian Defense",
    "category": "book",
    "player_side": "b",
    "description": "Black pins the White knight to prevent e4 and creates doubled pawns. Considered one of the best defenses to d4.",
    "moves_san": ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4", "e3", "O-O", "Bd3", "d5"],
    "fen_10_ply": "rnbq1rk1/ppp2ppp/4pn2/3p4/1bPP4/2NBP3/PP3PPP/R1BQK1NR w KQ - 2 6",
    "strategic_themes": ["Control of e4", "Rapid Development", "Flexible Pawn Structure"],
    "statistical_profile": { "white_win_percent": 35, "black_win_percent": 28, "draw_percent": 37 }
  },
  {
    "variation_id": "RETI_OPENING_01",
    "name": "Réti Opening",
    "eco_code": "A09",
    "parent_opening": "Réti Opening",
    "category": "book",
    "player_side": "w",
    "description": "A hypermodern flank opening. White controls the center from the sides using pieces rather than occupying it with pawns early.",
    "moves_san": ["Nf3", "d5", "c4", "dxc4", "e3", "Nf6", "Bxc4", "e6", "O-O", "c5"],
    "fen_10_ply": "rnbqkb1r/pp3ppp/4pn2/2p5/2B5/4PN2/PP1P1PPP/RNBQ1RK1 w kq - 0 6",
    "strategic_themes": ["Flexible Structure", "Control of Long Diagonal", "Delayed Central Strike"],
    "statistical_profile": { "white_win_percent": 34, "black_win_percent": 24, "draw_percent": 42 }
  },
  {
    "variation_id": "NIMZO_DEFENSE_01",
    "name": "Nimzowitsch Defense",
    "eco_code": "B00",
    "parent_opening": "Nimzowitsch Defense",
    "category": "book",
    "player_side": "b",
    "description": "A rare and provocative defense where Black blocks their c-pawn to challenge the center with pieces immediately.",
    "moves_san": ["e4", "Nc6", "d4", "d5", "e5", "Bf5", "c3", "e6", "Nf3", "f6"],
    "fen_10_ply": "r2qkbnr/ppp3pp/2n1pp2/3pPb2/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 0 6",
    "strategic_themes": ["Provocation", "Closed Center", "Blockade"],
    "statistical_profile": { "white_win_percent": 42, "black_win_percent": 30, "draw_percent": 28 }
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
  },
  {
    "variation_id": "NEWB_BLACKBURNE_01",
    "name": "Blackburne Shilling Gambit",
    "eco_code": "C50",
    "parent_opening": "Italian Game",
    "category": "trap",
    "player_side": "b", 
    "description": "The ultimate 'Oh no, my Queen!' trap. If White gets greedy with the e5 pawn, they get mated in 7 moves.",
    "moves_san": ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nd4", "Nxe5", "Qg5", "Nxf7", "Qxg2", "Rf1", "Qxe4+", "Be2", "Nf3#"],
    "fen_10_ply": "r1b1kbnr/pppp1Npp/8/8/4q3/5n2/PPPPBPPP/RNBQK2R b KQkq - 1 8", 
    "strategic_themes": ["Smothered Mate", "Punish Greed", "Queen Sacrifice"],
    "statistical_profile": { "white_win_percent": 10, "black_win_percent": 85, "draw_percent": 5 }
  },
  {
    "variation_id": "NEWB_DAMIANO_01",
    "name": "Damiano Defense Punishment",
    "eco_code": "C40",
    "parent_opening": "King's Pawn Game",
    "category": "trap",
    "player_side": "w", 
    "description": "NEVER play f6 to defend the King. If they do, sacrifice the Knight to expose their King to a deadly attack.",
    "moves_san": ["e4", "e5", "Nf3", "f6", "Nxe5", "fxe5", "Qh5+", "Ke7", "Qxe5+", "Kf7", "Bc4+", "d5", "Bxd5+", "Kg6"],
    "fen_10_ply": "rnbq1bnr/ppp3pp/6k1/3BQ3/4P3/8/PPPP1PPP/RNB1K2R b KQ - 1 8",
    "strategic_themes": ["King Hunt", "Sacrifice", "Exposed King"],
    "statistical_profile": { "white_win_percent": 70, "black_win_percent": 25, "draw_percent": 5 }
  },
  {
    "variation_id": "NEWB_STAFFORD_01",
    "name": "Stafford Gambit: Oh No My Queen",
    "eco_code": "C42",
    "parent_opening": "Petroff Defense",
    "category": "trap",
    "player_side": "b", 
    "description": "The internet's favorite trap. Sacrifice the pawn, bring the Bishop out, and if they pin your Knight... Mate them.",
    "moves_san": ["e4", "e5", "Nf3", "Nf6", "Nxe5", "Nc6", "Nxc6", "dxc6", "d3", "Bc5", "Bg5", "Nxe4", "Bxd8", "Bxf2+", "Ke2", "Bg4#"],
    "fen_10_ply": "r2B3r/ppp2ppp/2p5/2b5/4n1b1/3P4/PPP1KbPP/RNB2B1R b - - 1 9",
    "strategic_themes": ["Queen Sacrifice", "Linear Mate", "Trap"],
    "statistical_profile": { "white_win_percent": 20, "black_win_percent": 75, "draw_percent": 5 }
  },
  {
    "variation_id": "NEWB_FISHING_POLE_01",
    "name": "Ruy Lopez: Fishing Pole Trap",
    "eco_code": "C65",
    "parent_opening": "Ruy Lopez",
    "category": "trap",
    "player_side": "b", 
    "description": "Bait the h-pawn. If White takes the Knight on g4, the h-file opens up and their King dies.",
    "moves_san": ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6", "O-O", "Ng4", "h3", "h5", "hxg4", "hxg4", "Ne1", "Qh4"],
    "fen_10_ply": "r1bqkb1r/pppp1pp1/2n5/4p3/4P1nq/3P4/PPP2PP1/RNBQNRK1 w kq - 1 8",
    "strategic_themes": ["H-file Attack", "Piece Sacrifice", "Checkmate Threat"],
    "statistical_profile": { "white_win_percent": 15, "black_win_percent": 80, "draw_percent": 5 }
  },
  {
    "variation_id": "NEWB_QGA_GREED_01",
    "name": "QGA: The Greedy Trap",
    "eco_code": "D20",
    "parent_opening": "Queen's Gambit Accepted",
    "category": "trap",
    "player_side": "w", 
    "description": "The 800 Elo opponent accepts the gambit and tries to hold the pawn with ...b5, ignoring development. Punish them by trapping their Rook.",
    "moves_san": ["d4", "d5", "c4", "dxc4", "e3", "b5", "a4", "c6", "axb5", "cxb5", "Qf3"],
    "fen_10_ply": "rnbqkbnr/p3pppp/8/1p6/2pP4/4PQ2/1P3PPP/RNB1KBNR b KQkq - 1 6",
    "strategic_themes": ["Rook Trap", "Punish Greed", "Undermining Pawn Chain"],
    "statistical_profile": { "white_win_percent": 92, "black_win_percent": 5, "draw_percent": 3 }
  },
  {
    "variation_id": "NEWB_FRIED_LIVER_01",
    "name": "Two Knights: The Fried Liver",
    "eco_code": "C57",
    "parent_opening": "Italian Game",
    "category": "trap",
    "player_side": "w",
    "description": "The opponent plays book moves until move 5, where they recapture with the Knight (Nxd5). This is the fatal error. Sacrifice on f7 immediately.",
    "moves_san": ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Nxd5", "Nxf7", "Kxf7", "Qf3+"],
    "fen_10_ply": "r1bq1b1r/ppp2kpp/2n5/3np3/2B5/5Q2/PPPP1PPP/RNB1K2R b KQ - 1 7",
    "strategic_themes": ["King Hunt", "Sacrifice", "Exposing the King"],
    "statistical_profile": { "white_win_percent": 75, "black_win_percent": 20, "draw_percent": 5 }
  },
  {
    "variation_id": "NEWB_LEGALS_MATE_01",
    "name": "Philidor: Légal's Mate",
    "eco_code": "C41",
    "parent_opening": "Philidor Defense",
    "category": "trap",
    "player_side": "w",
    "description": "The opponent pins your Knight to the Queen and thinks it can't move. Prove them wrong by sacrificing the Queen for Checkmate.",
    "moves_san": ["e4", "e5", "Nf3", "d6", "Bc4", "Bg4", "Nc3", "h6", "Nxe5", "Bxd1", "Bxf7+", "Ke7", "Nd5#"],
    "fen_10_ply": "rn1q1b1r/ppp1kBp1/3p3p/3NN3/4P3/8/PPPP1PPP/R1BbK2R b KQ - 1 7",
    "strategic_themes": ["Queen Sacrifice", "Mating Net", "Punishing 'The Pin'"],
    "statistical_profile": { "white_win_percent": 99, "black_win_percent": 1, "draw_percent": 0 }
  },
  {
    "variation_id": "NEWB_CENTER_FORK_01",
    "name": "Italian Game: Center Fork Trick",
    "eco_code": "C50",
    "parent_opening": "Italian Game",
    "category": "trap",
    "player_side": "b", 
    "description": "White plays 'Auto-Pilot' development (Nc3) instead of c3/d3. This allows Black to temporarily sacrifice a piece to dominate the center.",
    "moves_san": ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Nc3", "Nxe4", "Nxe4", "d5", "Bd3", "dxe4"],
    "fen_10_ply": "r1bqkb1r/ppp2ppp/2n5/4p3/4p3/3B1N2/PPPP1PPP/R1BQK2R w KQkq - 0 7",
    "strategic_themes": ["Fork", "Equality", "Punishing Passive Play"],
    "statistical_profile": { "white_win_percent": 40, "black_win_percent": 50, "draw_percent": 10 }
  }
];