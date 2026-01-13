import React, { useState, useEffect, useRef } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { OpeningVariation } from '../types';
import { AnalyticsService } from '../services/analytics';
import StatsPanel from './StatsPanel';
import MoveHistory from './MoveHistory';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, ChevronsRight, Play, Lightbulb, ExternalLink, RefreshCw } from 'lucide-react';

interface OpeningTrainerProps {
  opening: OpeningVariation;
  onComplete: (success: boolean) => void;
  moveIndex: number;
  onMoveIndexChange: (index: number) => void;
  gameMode: 'challenge' | 'training';
}

const OpeningTrainer: React.FC<OpeningTrainerProps> = ({ opening, onComplete, moveIndex, onMoveIndexChange, gameMode }) => {
  // --- Game Engine (Ref) ---
  const gameRef = useRef<Chess>(new Chess());
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- UI State ---
  const [fen, setFen] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [hintSquares, setHintSquares] = useState<Record<string, { backgroundColor: string }>>({});

  // Feedback & Training Mode
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTrainingStarted, setIsTrainingStarted] = useState(false);
  const [isSuccessAttempt, setIsSuccessAttempt] = useState(false);
  
  // --- Analytics State Refs ---
  const attemptStartTimeRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number | null>(null);
  const moveDurationsRef = useRef<number[]>([]);
  const hasFailedRef = useRef<boolean>(false);
  const mistakeCountRef = useRef<number>(0);

  // Layout
  const [boardWidth, setBoardWidth] = useState(480);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  
  const ChessboardComponent = Chessboard as any;

  // Determine user side
  const userColor = opening.player_side || 'w';

  // --- Initialization ---

  // Handle Resize
  useEffect(() => {
    if (!boardContainerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const containerWidth = entry.contentRect.width;
      const maxHeight = window.innerHeight * 0.65;
      const size = Math.floor(Math.min(containerWidth, maxHeight));
      setBoardWidth(size > 0 ? size : 300);
    });
    resizeObserver.observe(boardContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    };
  }, []);

  // On Opening Change
  useEffect(() => {
    const newGame = new Chess();
    gameRef.current = newGame;
    
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);

    setFen(newGame.fen());
    setHistory([]);
    setMoveFrom(null);
    setHintSquares({});
    setIsCompleted(false);
    setIsSuccessAttempt(false);
    updateFeedback(newGame, 0, 'info'); 
    
    // Reset Analytics
    setIsTrainingStarted(false); // Show modal again for new variation
    attemptStartTimeRef.current = null;
    lastMoveTimeRef.current = null;
    moveDurationsRef.current = [];
    hasFailedRef.current = false;
    mistakeCountRef.current = 0;

  }, [opening]);


  const startTraining = () => {
    setIsTrainingStarted(true);
    attemptStartTimeRef.current = Date.now();
    lastMoveTimeRef.current = Date.now();
    
    // If User is playing Black, AI moves first immediately after start
    if (userColor === 'b' && moveIndex === 0) {
        autoPlayTimeoutRef.current = setTimeout(() => {
            playOpponentMove(0);
        }, 600);
    }
  };


  // --- Logic ---

  const updateFeedback = (currentGame: Chess, index: number, type: 'success' | 'error' | 'info', customMsg?: string) => {
    setFeedbackType(type);
    if (customMsg) {
      setFeedback(customMsg);
      return;
    }
    setFeedback(null);
  };

  const syncState = () => {
    setFen(gameRef.current.fen());
    setHistory(gameRef.current.history());
  };

  const playOpponentMove = (currentIndex: number) => {
      const opponentMoveSan = opening.moves_san[currentIndex];
      if (!opponentMoveSan) return;

      try {
        gameRef.current.move(opponentMoveSan);
        const nextIndex = currentIndex + 1;
        onMoveIndexChange(nextIndex);
        syncState();
        
        // Reset move timer for user's turn
        lastMoveTimeRef.current = Date.now();
        
        checkCompletion(nextIndex);
      } catch (e) {
        console.error("Opponent auto-move failed", e);
      }
  };

  const checkCompletion = (currentIndex: number) => {
    if (currentIndex >= opening.moves_san.length) {
      // --- Analytics Completion ---
      const endTime = Date.now();
      const totalDuration = attemptStartTimeRef.current ? endTime - attemptStartTimeRef.current : 0;
      
      const totalMoveTime = moveDurationsRef.current.reduce((a, b) => a + b, 0);
      const avgMoveTime = moveDurationsRef.current.length > 0 ? totalMoveTime / moveDurationsRef.current.length : 0;

      const isSuccess = !hasFailedRef.current;
      setIsSuccessAttempt(isSuccess);

      // Only save analytics if in challenge mode (optional, but requested behavior implies training is casual)
      // Actually, tracking stats in training is fine, but we won't update the "Deck" progress.
      AnalyticsService.saveAttempt({
        variation_id: opening.variation_id,
        variation_name: opening.name,
        parent_opening: opening.parent_opening,
        category: opening.category || 'book',
        player_side: userColor,
        duration_ms: totalDuration,
        avg_time_per_move_ms: avgMoveTime,
        success: isSuccess,
        mistake_count: mistakeCountRef.current,
      });

      // Delay visual completion
      setTimeout(() => {
        setIsCompleted(true);
        setFeedback("Variation Complete!");
        setFeedbackType('success');
        
        if (isSuccess) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
        }
      }, 300);

    } else {
      const isNextMoveAI = (userColor === 'w' && currentIndex % 2 !== 0) || 
                           (userColor === 'b' && currentIndex % 2 === 0);

      const lastMoveIndex = currentIndex - 1;
      const wasUserMove = (userColor === 'w' && lastMoveIndex % 2 === 0) ||
                          (userColor === 'b' && lastMoveIndex % 2 !== 0);

      if (wasUserMove) {
        setFeedback("Correct!");
        setFeedbackType('success');
        setTimeout(() => {
             setFeedbackType(prev => (prev === 'success' && !isCompleted) ? 'info' : prev);
             setFeedback(prev => (prev === "Correct!" && !isCompleted) ? null : prev);
        }, 1000);
      }

      if (isNextMoveAI) {
        if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = setTimeout(() => {
            playOpponentMove(currentIndex);
        }, 500);
      }
    }
  };

  // Reusable move function
  const handleMoveAttempt = (sourceSquare: string, targetSquare: string): boolean => {
    if (isCompleted || !isTrainingStarted) return false;

    // Check if it is user's turn
    const isUserTurn = (userColor === 'w' && moveIndex % 2 === 0) ||
                       (userColor === 'b' && moveIndex % 2 !== 0);

    if (!isUserTurn) {
        return false;
    }

    const expectedMoveSan = opening.moves_san[moveIndex];
    if (!expectedMoveSan) return false;

    const tempGame = new Chess(gameRef.current.fen());
    let userMove: Move | null = null;
    try {
      userMove = tempGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });
    } catch (e) {
      return false; // Illegal chess move
    }

    if (!userMove) return false;

    const validationGame = new Chess(gameRef.current.fen());
    let expectedMoveObj: Move | null = null;
    try {
      expectedMoveObj = validationGame.move(expectedMoveSan);
    } catch (e) {
      console.error("Invalid expected move in data:", expectedMoveSan);
      return false;
    }

    if (!expectedMoveObj) return false;

    const isCorrect = 
      userMove.from === expectedMoveObj.from && 
      userMove.to === expectedMoveObj.to;

    if (!isCorrect) {
      // --- Analytics: Record Failure ---
      hasFailedRef.current = true;
      mistakeCountRef.current += 1;
      
      setFeedback(`Incorrect! Expected ${expectedMoveSan}`);
      setFeedbackType('error');
      return false; 
    }

    // --- Analytics: Record Success Move Time ---
    const now = Date.now();
    if (lastMoveTimeRef.current) {
        moveDurationsRef.current.push(now - lastMoveTimeRef.current);
    }
    lastMoveTimeRef.current = now;

    // Apply to Real Game
    try {
      const result = gameRef.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });
      
      if (result) {
        const newIndex = moveIndex + 1;
        onMoveIndexChange(newIndex);
        syncState(); 
        setHintSquares({}); 
        checkCompletion(newIndex);
        return true;
      }
    } catch (e) {
      console.error("Move failed to apply to main game", e);
    }

    return false;
  };

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    const success = handleMoveAttempt(sourceSquare, targetSquare);
    if (success) {
      setMoveFrom(null);
    }
    return success;
  };

  const onSquareClick = (square: Square) => {
    if (isCompleted || !isTrainingStarted) return;

    if (moveFrom) {
       const piece = gameRef.current.get(square);
       if (piece && piece.color === gameRef.current.turn()) {
         setMoveFrom(square);
         return;
       }
       const success = handleMoveAttempt(moveFrom, square);
       if (success) {
         setMoveFrom(null);
       } else {
         setMoveFrom(null);
       }
       return;
    }

    const piece = gameRef.current.get(square);
    if (piece && piece.color === gameRef.current.turn()) {
      setMoveFrom(square);
    }
  };

  const customSquareStyles = {
    ...hintSquares,
    ...(moveFrom ? { [moveFrom]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' } } : {})
  };

  // --- Controls ---

  const handleHint = () => {
    if (isCompleted || moveIndex >= opening.moves_san.length || !isTrainingStarted) return;
    const isUserTurn = (userColor === 'w' && moveIndex % 2 === 0) ||
                       (userColor === 'b' && moveIndex % 2 !== 0);
    if (!isUserTurn) return;

    // Mark as failed if they needed a hint
    hasFailedRef.current = true;
    mistakeCountRef.current += 0.5;

    const expectedMoveSan = opening.moves_san[moveIndex];
    const tempGame = new Chess(gameRef.current.fen());
    try {
      const move = tempGame.move(expectedMoveSan);
      if (move) {
        setHintSquares({
          [move.from]: { backgroundColor: 'rgba(0, 255, 200, 0.4)' },
          [move.to]: { backgroundColor: 'rgba(0, 255, 200, 0.4)' }
        });
      }
    } catch (e) {
      console.error("Hint calculation failed", e);
    }
  };

  const handlePrevious = () => {
    if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
    }
    if (moveIndex === 0) return;
    
    // Undo invalidates the timing run effectively
    hasFailedRef.current = true;

    try {
        gameRef.current.undo();
        let newIndex = moveIndex - 1;
        onMoveIndexChange(newIndex);
        
        // If undoing lands on AI turn, undo again to get back to User turn
        const isAiTurnNow = (userColor === 'w' && newIndex % 2 !== 0) || 
                            (userColor === 'b' && newIndex % 2 === 0);
        
        if (isAiTurnNow && newIndex > 0) {
             gameRef.current.undo();
             newIndex--;
             onMoveIndexChange(newIndex);
        }

        setIsCompleted(false);
        syncState();
        setMoveFrom(null);
        setHintSquares({});
        updateFeedback(gameRef.current, newIndex, 'info');

        // If back at start and User is black, AI moves
        if (newIndex === 0 && userColor === 'b') {
             if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
             autoPlayTimeoutRef.current = setTimeout(() => {
                playOpponentMove(0);
             }, 800);
        }
    } catch (e) { console.error(e); }
  };

  const handleReset = () => {
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    const newGame = new Chess();
    gameRef.current = newGame;
    setFen(newGame.fen());
    setHistory([]);
    setMoveFrom(null);
    setHintSquares({});
    onMoveIndexChange(0);
    setIsCompleted(false);
    updateFeedback(newGame, 0, 'info');
    
    // Reset Trainer
    setIsTrainingStarted(false); 
  };

  const handleSkip = () => {
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    // Skipping counts as not completing.
    onComplete(false); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Main Chessboard Area */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
            
          <div 
            ref={boardContainerRef}
            className="w-full max-w-[600px] bg-gray-800 rounded-lg shadow-2xl border-4 border-gray-700 relative flex justify-center items-center p-2"
          >
            {/* Start Training Overlay */}
            {!isTrainingStarted && (
              <div className="absolute inset-0 z-30 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg animate-in fade-in duration-300">
                 <div className="text-center p-6 max-w-sm">
                   <h3 className="text-2xl font-bold text-white mb-2">{opening.name}</h3>
                   <p className="text-gray-300 mb-6 text-sm">{opening.description}</p>
                   <button 
                    onClick={startTraining}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
                   >
                     <Play className="w-6 h-6 fill-current" />
                     <span>Start Training</span>
                   </button>
                 </div>
              </div>
            )}

            {boardWidth > 0 && (
              <ChessboardComponent 
                id="OpeningTrainerBoard"
                position={fen} 
                onPieceDrop={onDrop}
                onSquareClick={onSquareClick}
                boardWidth={boardWidth}
                boardOrientation={userColor === 'w' ? 'white' : 'black'}
                customDarkSquareStyle={{ backgroundColor: '#779556' }} 
                customLightSquareStyle={{ backgroundColor: '#ebecd0' }} 
                customSquareStyles={customSquareStyles}
                arePiecesDraggable={isTrainingStarted && !isCompleted}
                animationDuration={200}
              />
            )}
            
            {isCompleted && (
              <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center z-30 animate-in fade-in duration-300 rounded-lg p-6">
                
                {/* Header Section */}
                <div className="flex flex-col items-center mb-4 animate-in slide-in-from-bottom-2 duration-500 delay-100">
                    <CheckCircle className="w-12 h-12 text-green-400 mb-2 drop-shadow-lg" />
                    <h3 className="text-2xl font-bold text-white tracking-tight">Excellent!</h3>
                </div>

                {/* Content Area (Followup) */}
                <div className="w-full max-w-md bg-gray-800/80 border border-gray-700 p-5 rounded-xl shadow-xl mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <Lightbulb className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Strategy Tip</h4>
                    </div>
                    <p className="text-gray-100 text-base leading-relaxed">
                        {opening.followup || "Well done! Proceed to the next variation."}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-3 animate-in slide-in-from-bottom-6 duration-700 delay-300">
                    <button 
                        onClick={handleReset}
                        className="group relative inline-flex items-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-gray-500/25 hover:-translate-y-1"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>Retry</span>
                    </button>

                    <a 
                        href={`https://www.chess.com/analysis?fen=${encodeURIComponent(gameRef.current.fen())}&flip=${userColor === 'b' ? 'true' : 'false'}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-gray-500/25 hover:-translate-y-1"
                        title="Analyze on Chess.com"
                    >
                        <ExternalLink className="w-5 h-5" />
                        <span className="hidden sm:inline">Analyze</span>
                    </a>

                    <button 
                        onClick={() => onComplete(isSuccessAttempt)}
                        className="group relative inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/25 hover:-translate-y-1"
                    >
                        <span>Next Variation</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="w-full max-w-[600px] mt-4 flex flex-col gap-3">
            
            {(feedbackType !== 'info' || feedback) && (
              <div className={`flex items-center justify-center gap-3 px-4 py-2 rounded-md w-full transition-colors duration-300 h-12 ${
                feedbackType === 'error' ? 'bg-red-900/40 text-red-200 border border-red-800' :
                feedbackType === 'success' ? 'bg-green-900/40 text-green-200 border border-green-800' :
                'bg-gray-800/80 text-gray-200 border border-gray-700'
              }`}>
                {feedbackType === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                {feedbackType === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                {feedback && <span className="font-medium text-sm">{feedback}</span>}
              </div>
            )}
            
            <div className="grid grid-cols-4 gap-2">
               <button 
                onClick={handlePrevious}
                disabled={moveIndex === 0 || !isTrainingStarted}
                className="flex items-center justify-center h-12 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded border border-gray-600 transition-colors"
                title="Undo"
              >
                <ChevronLeft className="w-6 h-6" /> 
              </button>

              <button 
                onClick={handleHint}
                disabled={isCompleted || moveIndex >= opening.moves_san.length || !isTrainingStarted}
                className="flex items-center justify-center h-12 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded border border-gray-600 transition-colors"
                title="Hint"
              >
                <ChevronRight className="w-6 h-6" /> 
              </button>

              <button 
                onClick={handleReset}
                className="flex items-center justify-center h-12 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-600 transition-colors"
                title="Reset Board"
              >
                <RotateCcw className="w-5 h-5" /> 
              </button>

              <button 
                onClick={handleSkip}
                className="flex items-center justify-center h-12 bg-blue-600 hover:bg-blue-500 text-white rounded border border-blue-500 transition-colors"
                title="Next"
              >
                <ChevronsRight className="w-6 h-6" /> 
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <MoveHistory 
            moves={history} 
            totalMoves={opening.moves_san.length} 
            title={opening.name}
          />
          <StatsPanel opening={opening} />
        </div>
      </div>
    </div>
  );
};

export default OpeningTrainer;