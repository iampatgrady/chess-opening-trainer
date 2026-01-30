import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { stockfish } from '../services/stockfish';
import { AlertTriangle, CheckCircle, ShieldAlert, BarChart } from 'lucide-react';
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

  useEffect(() => {
    resetGame();
  }, []); // Run only on mount. Reset logic is handled by parent re-keying.

  // Fetch evaluation whenever FEN changes
  useEffect(() => {
    // Determine who's to move for correct evaluation context if needed, 
    // but stockfish returns absolute scores (positive = white advantage)
    stockfish.getEvaluation(fen, 1).then((data) => {
        if (data.evaluation) {
            setCurrentEval(data.evaluation);
        }
    });
  }, [fen]);

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
    
    const evalData = await stockfish.getEvaluation(game.fen(), 10);
    const sortedMoves = evalData.possibleMoves?.sort((a, b) => b.score - a.score) || [];
    const bestMoveUci = evalData.bestMove;

    if (!bestMoveUci) return validMoves[0].lan; 

    // Constraint 2: "Book" / Standard (AI Moves 1 & 2)
    // Applies to Move 2 (moveNum == 1) or Black's first response (moveNum == 0)
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
    if (!isTurn) return false;
    
    const game = gameRef.current;
    const fenBefore = game.fen();
    
    let move = null;
    try {
      move = game.move({ from: source, to: target, promotion: 'q' });
    } catch (e) { return false; }
    
    if (!move) return false;

    // Undo to check engine
    game.undo(); 
    setStatus("Checking move quality...");
    
    stockfish.getEvaluation(fenBefore, 1).then(evalData => {
      const bestMoveUci = evalData.bestMove;
      const userMoveUci = `${source}${target}${move?.promotion ? move.promotion : ''}`;
      
      const isAcceptable = bestMoveUci?.includes(userMoveUci) || 
                           (evalData.possibleMoves && evalData.possibleMoves[0]?.uci.includes(userMoveUci));

      if (isAcceptable) {
        gameRef.current.move({ from: source, to: target, promotion: 'q' });
        setFen(gameRef.current.fen());
        setFeedback({ type: 'success', msg: "Excellent! Best move found." });
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
        setFeedback({ type: 'error', msg: `Inaccurate. Engine preferred ${bestMoveUci}` });
        setStatus("Your Turn: Try again");
      }
    });

    return true; 
  };

  // --- Eval Bar Logic ---
  const getEvalBarWidth = () => {
    if (!currentEval) return 50;
    
    if (currentEval.type === 'mate') {
        if (currentEval.value > 0) return 100; // White mates
        if (currentEval.value < 0) return 0;   // Black mates
        return 50;
    }

    // Centipawns logic
    // +500 cp = 100% white, -500 cp = 0% white (100% black)
    // Clamp between 5% and 95% to always show a sliver
    const clampedScore = Math.max(-500, Math.min(500, currentEval.value));
    const percent = 50 + (clampedScore / 10); // 50 + (500/10) = 100
    return Math.max(5, Math.min(95, percent));
  };

  const getEvalText = () => {
      if (!currentEval) return "0.0";
      if (currentEval.type === 'mate') return `M${Math.abs(currentEval.value)}`;
      return (currentEval.value / 100).toFixed(1);
  };
  
  const evalPercent = getEvalBarWidth();

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center animate-in fade-in duration-500">
      
      <div className="mb-6 flex flex-col items-center gap-2">
         <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-sm flex items-center gap-2 ${
             playerColor === 'w' ? 'bg-gray-200 text-gray-900' : 'bg-black text-gray-100 border border-gray-700'
         }`}>
            {playerColor === 'w' ? 'Playing as White' : 'Playing as Black'}
         </div>
         <p className="text-gray-400 text-sm font-mono h-5">{status}</p>
      </div>
      
      <div className="w-full max-w-[500px] flex flex-col gap-1">
        <div className="shadow-2xl rounded-lg overflow-hidden border-4 border-gray-700">
            <Chessboard 
                id="AiTrainerBoard"
                position={fen} 
                onPieceDrop={onDrop}
                boardOrientation={playerColor === 'w' ? 'white' : 'black'}
                customDarkSquareStyle={{ backgroundColor: '#779556' }} 
                customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
                animationDuration={200}
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
