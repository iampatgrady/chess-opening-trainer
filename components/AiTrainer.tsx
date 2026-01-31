import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { stockfish } from '../services/stockfish';
import { AlertTriangle, CheckCircle, ShieldAlert, BarChart, Hourglass } from 'lucide-react';
import confetti from 'canvas-confetti';

const AiTrainer: React.FC<{ playerColor: 'w' | 'b'; onResetColor: () => void }> = ({ playerColor, onResetColor }) => {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState('start');
  const [status, setStatus] = useState<string>('Initialize...');
  const [isTurn, setIsTurn] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  
  // Evaluation State
  const [currentEval, setCurrentEval] = useState<{ type: 'cp' | 'mate'; value: number } | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [isStabilizing, setIsStabilizing] = useState(false);

  // Buffer for smoothing evaluation (Last 5 polls)
  const evalBufferRef = useRef<number[]>([]);

  useEffect(() => {
    resetGame();
  }, []); // Run only on mount. Reset logic is handled by parent re-keying.

  // Fetch evaluation whenever FEN changes OR Turn changes
  useEffect(() => {
    // Only run continuous analysis when it is the Player's turn.
    // When it's AI's turn, the engine is busy calculating the move.
    if (!isTurn) {
        stockfish.stopAnalysis();
        return;
    }

    // Reset state on new turn
    evalBufferRef.current = [];
    setCurrentEval(null);
    setValidMoves([]);
    setIsStabilizing(true);

    // Enforce 750ms stabilization delay to ensure we have high quality moves
    const stabilizationTimer = setTimeout(() => {
        setIsStabilizing(false);
    }, 750);

    // Determine perspective (Engine gives score relative to side to move)
    // We want absolute score (White perspective)
    // If Black to move, multiply by -1.
    const turnColor = fen === 'start' ? 'w' : fen.split(' ')[1];
    const multiplier = turnColor === 'b' ? -1 : 1;

    stockfish.startAnalysis(fen, (data) => {
        // Update Valid Moves
        if (data.topMoves && data.topMoves.length > 0) {
            setValidMoves(data.topMoves);
        }

        // Update Evaluation
        if (data.evaluation) {
            // Instant update for Mate
            if (data.evaluation.type === 'mate') {
                setCurrentEval({ type: 'mate', value: data.evaluation.value * multiplier });
                evalBufferRef.current = []; // Clear buffer so we don't mix CP and Mate
                return;
            }

            // Smoothing for Centipawns
            if (data.evaluation.type === 'cp') {
                const absValue = data.evaluation.value * multiplier;

                const buffer = evalBufferRef.current;
                buffer.push(absValue);
                if (buffer.length > 5) buffer.shift(); // Keep last 5

                const sum = buffer.reduce((a, b) => a + b, 0);
                const avg = sum / buffer.length;
                
                setCurrentEval({ type: 'cp', value: avg });
            }
        }
    });

    return () => {
        clearTimeout(stabilizationTimer);
        stockfish.stopAnalysis();
    };
  }, [fen, isTurn]);

  const resetGame = () => {
    const game = new Chess();
    
    // Automate First Move for White
    const allowed = ['e4', 'd4', 'Nf3', 'b3'];
    const pick = allowed[Math.floor(Math.random() * allowed.length)];
    game.move(pick);
    
    gameRef.current = game;
    setFen(game.fen());
    setMoveCount(0);
    setFeedback(null);
    setCurrentEval({ type: 'cp', value: 0 }); // Reset eval
    evalBufferRef.current = [];
    setValidMoves([]);
    
    if (playerColor === 'w') {
      // User is White, but AI (Black) needs to respond to the automated first move
      setIsTurn(false);
      setStatus("AI is responding...");
      setTimeout(() => aiMakeMove(0), 500);
    } else {
      // User is Black, it is their turn to respond to the automated move
      setIsTurn(true);
      setStatus(`Your Turn: Respond to ${pick}`);
    }
  };

  const fullReset = () => {
    onResetColor(); 
  };

  const getAiMoveStrategy = async (moveNum: number, game: Chess): Promise<string | null> => {
    const validMoves = game.moves({ verbose: true });
    
    // Note: This calls getEvaluation which stops the continuous analysis
    const evalData = await stockfish.getEvaluation(game.fen(), 3); // Check 3 lines
    const sortedMoves = evalData.possibleMoves?.sort((a, b) => b.score - a.score) || [];
    const bestMoveUci = evalData.bestMove;

    if (!bestMoveUci) return validMoves[0].lan; 

    // Constraint 2: "Book" / Standard (AI Moves 1 & 2)
    if (moveNum === 1 || moveNum === 0) {
       if (sortedMoves.length > 0) {
           const candidates = sortedMoves.slice(0, 3);
           const pick = candidates[Math.floor(Math.random() * candidates.length)];
           return pick.uci;
       }
       return bestMoveUci;
    }

    // Constraint 3: "Variable" (AI Move 3)
    if (moveNum === 2) {
      const r = Math.random();
      if (r < 0.33) return bestMoveUci; 
      if (sortedMoves.length > 3) return sortedMoves[2].uci; 
      if (sortedMoves.length > 1) return sortedMoves[1].uci;
      return bestMoveUci;
    }

    // Constraint 4: "Random" (AI Move 4)
    if (moveNum === 3) {
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      return randomMove.lan; 
    }

    // Constraint 5+: "Best"
    return bestMoveUci;
  };

  const aiMakeMove = async (currentMoveCount: number) => {
    const game = gameRef.current;
    
    const uciOrSan = await getAiMoveStrategy(currentMoveCount, game);
    
    if (uciOrSan) {
      try {
        game.move(uciOrSan); 
      } catch (e) {
        const moves = game.moves({ verbose: true });
        const m = moves.find(m => m.lan === uciOrSan || (m.from + m.to + (m.promotion||'')) === uciOrSan);
        if (m) {
            game.move(m.san);
        } else {
             try { game.move(uciOrSan) } catch(err) { console.error(err); }
        }
      }
      
      setFen(game.fen());
      setMoveCount(prev => prev + 1); 
      setIsTurn(true);
      setStatus("Your Turn: Find the best move");
    }
  };

  const onDrop = (source: string, target: string) => {
    // Prevent dropping if not turn, stabilizing, or valid moves not ready
    if (!isTurn || isStabilizing || validMoves.length === 0) return false;
    
    const game = gameRef.current;
    
    let move = null;
    try {
      move = game.move({ from: source, to: target, promotion: 'q' });
    } catch (e) { return false; }
    
    if (!move) return false;

    // Undo immediately to check against our list (we just wanted to validate legality and get promotion info)
    game.undo(); 
    
    // Construct User UCI (e.g., e2e4 or a7a8q)
    const userMoveUci = `${source}${target}${move.promotion ? move.promotion : ''}`;

    // INSTANT VALIDATION: Check against pre-calculated validMoves
    const isAcceptable = validMoves.some(m => m.includes(userMoveUci));

    if (isAcceptable) {
      gameRef.current.move({ from: source, to: target, promotion: 'q' });
      setFen(gameRef.current.fen());
      setFeedback({ type: 'success', msg: "Excellent! Good move." });
      setIsTurn(false);
      
      // Stop after Move 5 is complete (User plays move 5)
      const limit = 4;
      
      if (moveCount >= limit) {
         confetti();
         setStatus("Drill Complete! Starting new round...");
         // Auto-reset
         setTimeout(() => {
           fullReset();
         }, 2500);
      } else {
         setStatus("AI is thinking...");
         setTimeout(() => aiMakeMove(moveCount), 500);
      }
    } else {
      setFeedback({ type: 'error', msg: `Inaccurate. Engine preferred ${validMoves[0]}` });
      setStatus("Your Turn: Try again");
      
      // IMPORTANT: Do NOT restart analysis. 
      // The analysis is still running in the background (we never stopped it, 
      // we only stopped it when isTurn becomes false). 
      // Since isTurn is STILL true, the effect is still active and validMoves are still fresh.
    }

    return true; 
  };

  // --- Eval Bar Logic ---
  const getEvalBarWidth = () => {
    if (!currentEval) return 50;
    
    // Absolute values now (Positive = White winning)
    if (currentEval.type === 'mate') {
        if (currentEval.value > 0) return 100; // White mates
        if (currentEval.value < 0) return 0;   // Black mates
        return 50;
    }

    const clampedScore = Math.max(-500, Math.min(500, currentEval.value));
    const percent = 50 + (clampedScore / 10); 
    return Math.max(5, Math.min(95, percent));
  };

  const getEvalText = () => {
      if (!currentEval) return "0.0";
      if (currentEval.type === 'mate') return `M${Math.abs(currentEval.value)}`;
      return (currentEval.value / 100).toFixed(1);
  };
  
  const evalPercent = getEvalBarWidth();
  const canMove = isTurn && !isStabilizing && validMoves.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center animate-in fade-in duration-500">
      
      <div className="mb-6 flex flex-col items-center gap-2">
         <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-sm flex items-center gap-2 ${
             playerColor === 'w' ? 'bg-gray-200 text-gray-900' : 'bg-black text-gray-100 border border-gray-700'
         }`}>
            {playerColor === 'w' ? 'Playing as White' : 'Playing as Black'}
         </div>
         <p className="text-gray-400 text-sm font-mono h-5 flex items-center gap-2">
            {isStabilizing ? <><Hourglass className="w-3 h-3 animate-spin"/> Stabilizing...</> : status}
         </p>
      </div>
      
      <div className="w-full max-w-[500px] flex flex-col gap-1">
        <div className={`shadow-2xl rounded-lg overflow-hidden border-4 transition-colors duration-300 ${isStabilizing ? 'border-yellow-500/50' : 'border-gray-700'}`}>
            <Chessboard 
                id="AiTrainerBoard"
                position={fen} 
                onPieceDrop={onDrop}
                boardOrientation={playerColor === 'w' ? 'white' : 'black'}
                customDarkSquareStyle={{ backgroundColor: '#779556' }} 
                customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
                animationDuration={200}
                arePiecesDraggable={canMove}
            />
        </div>
        
        {/* Horizontal Eval Bar */}
        <div className="w-full h-6 bg-gray-900 rounded-md overflow-hidden relative border border-gray-600 mt-1">
            <div 
                className="h-full bg-white transition-all duration-700 ease-out"
                style={{ width: `${evalPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono tracking-wider pointer-events-none mix-blend-difference text-white">
                {currentEval ? (
                    <span className="flex items-center gap-1">
                        <BarChart className="w-3 h-3" />
                        {getEvalText()}
                    </span>
                ) : (
                    "Analyzing..."
                )}
            </div>
        </div>
      </div>

      {feedback && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 w-full max-w-[500px] shadow-lg border ${
            feedback.type === 'error' ? 'bg-red-900/40 text-red-200 border-red-800' : 'bg-green-900/40 text-green-200 border-green-800'
        }`}>
            {feedback.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
            <span className="font-medium">{feedback.msg}</span>
        </div>
      )}
      
      <div className="mt-8 w-full max-w-[600px]">
          <div className="flex items-center gap-2 mb-2 justify-center">
             <ShieldAlert className="w-4 h-4 text-purple-400" />
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Strategy Profile</span>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-xs text-gray-500">
            <div className={`p-2 rounded ${moveCount === 0 ? "bg-purple-900/30 text-purple-400 font-bold border border-purple-800" : "bg-gray-800 border border-gray-700"}`}>1. Book</div>
            <div className={`p-2 rounded ${moveCount === 1 ? "bg-purple-900/30 text-purple-400 font-bold border border-purple-800" : "bg-gray-800 border border-gray-700"}`}>2. Book</div>
            <div className={`p-2 rounded ${moveCount === 2 ? "bg-purple-900/30 text-purple-400 font-bold border border-purple-800" : "bg-gray-800 border border-gray-700"}`}>3. Variable</div>
            <div className={`p-2 rounded ${moveCount === 3 ? "bg-purple-900/30 text-purple-400 font-bold border border-purple-800" : "bg-gray-800 border border-gray-700"}`}>4. Random</div>
            <div className={`p-2 rounded ${moveCount >= 4 ? "bg-purple-900/30 text-purple-400 font-bold border border-purple-800" : "bg-gray-800 border border-gray-700"}`}>5. Best</div>
          </div>
      </div>
    </div>
  );
};

export default AiTrainer;
