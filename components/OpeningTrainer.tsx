import React, { useState, useEffect, useRef } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { OpeningVariation } from '../types';
import StatsPanel from './StatsPanel';
import MoveHistory from './MoveHistory';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface OpeningTrainerProps {
  opening: OpeningVariation;
  onNextOpening: () => void;
  moveIndex: number;
  onMoveIndexChange: (index: number) => void;
}

const OpeningTrainer: React.FC<OpeningTrainerProps> = ({ opening, onNextOpening, moveIndex, onMoveIndexChange }) => {
  // --- Game Engine (Ref) ---
  const gameRef = useRef<Chess>(new Chess());
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- UI State ---
  const [fen, setFen] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [hintSquares, setHintSquares] = useState<Record<string, { backgroundColor: string }>>({});

  // Feedback
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Layout
  const [boardWidth, setBoardWidth] = useState(480);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  
  const ChessboardComponent = Chessboard as any;

  // Determine user side
  const userColor = opening.player_side || 'w';

  // --- Initialization ---

  // Handle Resize with ResizeObserver to ensure board always fits container
  useEffect(() => {
    if (!boardContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // The first entry is our board container
      const entry = entries[0];
      if (!entry) return;

      // contentRect provides the size of the content box (inside padding/borders)
      // This is exactly the maximum width the board should take.
      const containerWidth = entry.contentRect.width;
      
      // Calculate a max height based on viewport to ensure the board fits vertically on mobile
      // leaving room for the header and controls.
      // 65% of viewport height is usually a good safe zone for the board.
      const maxHeight = window.innerHeight * 0.65;
      
      // The board is square, so we take the smaller of the available width or height.
      // We floor it to avoid subpixel rendering issues.
      const size = Math.floor(Math.min(containerWidth, maxHeight));
      
      setBoardWidth(size > 0 ? size : 300);
    });

    resizeObserver.observe(boardContainerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Cleanup timeout on unmount
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
    updateFeedback(newGame, 0, 'info'); 

    // If User is playing Black, AI moves first
    if (userColor === 'b') {
        autoPlayTimeoutRef.current = setTimeout(() => {
            playOpponentMove(0);
        }, 800);
    }
  }, [opening]);


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
        checkCompletion(nextIndex);
      } catch (e) {
        console.error("Opponent auto-move failed", e);
      }
  };

  const checkCompletion = (currentIndex: number) => {
    if (currentIndex >= opening.moves_san.length) {
      // Delay completion effects to allow piece animation (200ms) to finish
      setTimeout(() => {
        setIsCompleted(true);
        setFeedback("Variation Complete!");
        setFeedbackType('success');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => onNextOpening(), 2500);
      }, 300);
    } else {
      // Determine whose turn it is
      // White User: User=Even, AI=Odd
      // Black User: AI=Even, User=Odd
      
      const isNextMoveAI = (userColor === 'w' && currentIndex % 2 !== 0) || 
                           (userColor === 'b' && currentIndex % 2 === 0);

      // Determine if the last move was made by User to give feedback
      const lastMoveIndex = currentIndex - 1;
      const wasUserMove = (userColor === 'w' && lastMoveIndex % 2 === 0) ||
                          (userColor === 'b' && lastMoveIndex % 2 !== 0);

      if (wasUserMove) {
        setFeedback("Correct!");
        setFeedbackType('success');
        
        // Hide "Correct" message shortly after
        setTimeout(() => {
             // Only clear if we haven't completed in the meantime (though logic above handles completion separate branch, 
             // but react state updates are async/batched, safely checking prev state is good)
             setFeedbackType(prev => (prev === 'success' && !isCompleted) ? 'info' : prev);
             setFeedback(prev => (prev === "Correct!" && !isCompleted) ? null : prev);
        }, 1000);
      }

      if (isNextMoveAI) {
        // TRIGGER AUTO-PLAY for Opponent
        if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = setTimeout(() => {
            playOpponentMove(currentIndex);
        }, 500);
      }
    }
  };

  // Reusable move function
  const handleMoveAttempt = (sourceSquare: string, targetSquare: string): boolean => {
    if (isCompleted) return false;

    // Check if it is user's turn
    const isUserTurn = (userColor === 'w' && moveIndex % 2 === 0) ||
                       (userColor === 'b' && moveIndex % 2 !== 0);

    if (!isUserTurn) {
        return false;
    }

    // 1. Get Expected Move
    const expectedMoveSan = opening.moves_san[moveIndex];
    if (!expectedMoveSan) return false;

    // 2. Check correctness (Logic match)
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
      setFeedback(`Incorrect! Expected ${expectedMoveSan}`);
      setFeedbackType('error');
      return false; 
    }

    // 3. Apply to Real Game
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
        setHintSquares({}); // Clear hints on successful move
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
    if (isCompleted) return;

    // 1. If we have a selected piece, try to move to the clicked square
    if (moveFrom) {
       // If clicking the same square or another friendly piece, just select that instead
       const piece = gameRef.current.get(square);
       if (piece && piece.color === gameRef.current.turn()) {
         setMoveFrom(square);
         return;
       }

       const success = handleMoveAttempt(moveFrom, square);
       if (success) {
         setMoveFrom(null);
       } else {
         // Invalid move: deselect
         setMoveFrom(null);
       }
       return;
    }

    // 2. If nothing selected, select the clicked square if it has a friendly piece
    const piece = gameRef.current.get(square);
    if (piece && piece.color === gameRef.current.turn()) {
      setMoveFrom(square);
    }
  };

  // Combine hint styles and selection styles
  const customSquareStyles = {
    ...hintSquares,
    ...(moveFrom ? { [moveFrom]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' } } : {})
  };

  // --- Controls ---

  const handleHint = () => {
    if (isCompleted || moveIndex >= opening.moves_san.length) return;
    
    // Don't show hint if it's not user's turn
    const isUserTurn = (userColor === 'w' && moveIndex % 2 === 0) ||
                       (userColor === 'b' && moveIndex % 2 !== 0);
    if (!isUserTurn) return;

    const expectedMoveSan = opening.moves_san[moveIndex];

    // Peek at the move to get 'from' and 'to' squares
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
    // 1. Cancel any pending auto-move first
    if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
    }

    if (moveIndex === 0) return;
    
    // Helper to perform one step undo
    const performUndo = (currentIndex: number) => {
        try {
            gameRef.current.undo();
            const newIndex = currentIndex - 1;
            onMoveIndexChange(newIndex);
            setIsCompleted(false);
            syncState();
            setMoveFrom(null);
            setHintSquares({});
            updateFeedback(gameRef.current, newIndex, 'info');
            return newIndex;
        } catch (e) {
            console.error("Undo failed", e);
            return currentIndex;
        }
    };

    // Undo User move
    let newIndex = performUndo(moveIndex);

    // If we are now at an AI turn index (meaning we undid User move, so it's AI turn now),
    // we should likely undo AI move too so the user can actually Play again.
    // Unless we are at start (index 0) and user is Black.
    
    const isAiTurnNow = (userColor === 'w' && newIndex % 2 !== 0) || 
                        (userColor === 'b' && newIndex % 2 === 0);

    if (isAiTurnNow) {
        if (newIndex > 0) {
            // Undo AI move as well
            performUndo(newIndex);
        } else if (newIndex === 0 && userColor === 'b') {
            // We are at start and it is AI turn. Trigger AI to move again.
             if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
             autoPlayTimeoutRef.current = setTimeout(() => {
                playOpponentMove(0);
             }, 800);
        }
    }
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

    // If Black, trigger AI
    if (userColor === 'b') {
        autoPlayTimeoutRef.current = setTimeout(() => {
            playOpponentMove(0);
        }, 800);
    }
  };

  const handleSkip = () => {
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    onNextOpening();
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
                customBoardStyle={{
                  borderRadius: '4px',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                }}
                arePiecesDraggable={!isCompleted}
                animationDuration={200}
              />
            )}
            
            {isCompleted && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in duration-300 rounded-lg">
                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Excellent!</h2>
                <p className="text-gray-300">Loading next opening...</p>
              </div>
            )}
          </div>

          {/* Compact Controls & Feedback Bar */}
          <div className="w-full max-w-[600px] mt-4 flex flex-col gap-3">
            
            {/* Feedback Status */}
            {(feedbackType !== 'info' || feedback) && (
              <div className={`flex items-center justify-center gap-3 px-4 py-2 rounded-md w-full transition-colors duration-300 h-12 ${
                feedbackType === 'error' ? 'bg-red-900/40 text-red-200 border border-red-800' :
                feedbackType === 'success' ? 'bg-green-900/40 text-green-200 border border-green-800' :
                'bg-gray-800/80 text-gray-200 border border-gray-700'
              }`}>
                {/* Icons for success/error */}
                {feedbackType === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                {feedbackType === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                
                {/* Text Feedback */}
                {feedback && <span className="font-medium text-sm">{feedback}</span>}
              </div>
            )}
            
            {/* Navigation Buttons Row */}
            <div className="grid grid-cols-4 gap-2">
               <button 
                onClick={handlePrevious}
                disabled={moveIndex === 0}
                className="flex items-center justify-center h-12 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded border border-gray-600 transition-colors"
                title="Undo"
              >
                <ChevronLeft className="w-6 h-6" /> 
              </button>

              <button 
                onClick={handleHint}
                disabled={isCompleted || moveIndex >= opening.moves_san.length}
                className="flex items-center justify-center h-12 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded border border-gray-600 transition-colors"
                title="Hint / Highlight Move"
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
                title="Next Opening"
              >
                <ChevronsRight className="w-6 h-6" /> 
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Stats & History */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <MoveHistory 
            moves={history} 
            totalMoves={opening.moves_san.length} 
          />
          <StatsPanel opening={opening} />
        </div>
      </div>
    </div>
  );
};

export default OpeningTrainer;