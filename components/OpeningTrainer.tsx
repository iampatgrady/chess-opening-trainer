import React, { useState, useEffect, useRef } from 'react';
import { Chess, Move } from 'chess.js';
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
  // moveIndex is now a prop

  // Feedback
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Layout
  const [boardWidth, setBoardWidth] = useState(480);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  
  const ChessboardComponent = Chessboard as any;

  // --- Initialization ---

  // Handle Resize
  useEffect(() => {
    if (!boardContainerRef.current) return;
    const updateWidth = () => {
      if(boardContainerRef.current) {
        // Subtract 16px buffer to ensure it fits well within borders without clipping
        // We also rely on the container to center it
        const w = Math.min(boardContainerRef.current.clientWidth, window.innerHeight * 0.60) - 16;
        setBoardWidth(w > 0 ? w : 300);
      }
    };
    
    // Initial size
    updateWidth();
    
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
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
    // moveIndex is reset by parent
    setIsCompleted(false);
    updateFeedback(newGame, 0, 'info'); 
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
      const opponentMoveSan = opening.moves_san_10_ply[currentIndex];
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
    if (currentIndex >= opening.moves_san_10_ply.length) {
      setIsCompleted(true);
      setFeedback("Variation Complete!");
      setFeedbackType('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => onNextOpening(), 2500);
    } else {
      // If we are pending an auto-move, we might not want to flash "Correct" too aggressively,
      // but it confirms the user action.
      // Only show "Correct" if it was the USER'S move that just finished.
      // Assuming User starts at 0: User (0), Opponent (1), User (2).
      // So if currentIndex (state after move) is Odd (1, 3...), user just moved.
      if (currentIndex % 2 !== 0) {
        setFeedback("Correct!");
        setFeedbackType('success');
        
        // Hide "Correct" message shortly after
        setTimeout(() => {
             setFeedbackType(prev => (prev === 'success' && !isCompleted) ? 'info' : prev);
             setFeedback(prev => (prev === "Correct!" && !isCompleted) ? null : prev);
        }, 1000);

        // TRIGGER AUTO-PLAY for Opponent
        if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = setTimeout(() => {
            playOpponentMove(currentIndex);
        }, 500);
      }
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    if (isCompleted) return false;

    // 1. Get Expected Move
    const expectedMoveSan = opening.moves_san_10_ply[moveIndex];
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
      return false; // Snap back
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
        checkCompletion(newIndex);
        return true;
      }
    } catch (e) {
      console.error("Move failed to apply to main game", e);
    }

    return false;
  };

  // --- Controls ---

  const handleNext = () => {
    if (isCompleted || moveIndex >= opening.moves_san_10_ply.length) return;
    const expectedMoveSan = opening.moves_san_10_ply[moveIndex];

    try {
      const result = gameRef.current.move(expectedMoveSan);
      if (result) {
        const newIndex = moveIndex + 1;
        onMoveIndexChange(newIndex);
        syncState();
        checkCompletion(newIndex);
      }
    } catch (e) {
      console.error("Auto move failed", e);
    }
  };

  const handlePrevious = () => {
    if (moveIndex === 0) return;
    
    // Cancel any pending auto-move
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);

    try {
      gameRef.current.undo();
      const newIndex = moveIndex - 1;
      onMoveIndexChange(newIndex);
      setIsCompleted(false);
      syncState();
      updateFeedback(gameRef.current, newIndex, 'info');
    } catch (e) {
      console.error("Undo failed", e);
    }
  };

  const handleReset = () => {
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    const newGame = new Chess();
    gameRef.current = newGame;
    setFen(newGame.fen());
    setHistory([]);
    onMoveIndexChange(0);
    setIsCompleted(false);
    updateFeedback(newGame, 0, 'info');
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
                boardWidth={boardWidth}
                customDarkSquareStyle={{ backgroundColor: '#374151' }} 
                customLightSquareStyle={{ backgroundColor: '#9ca3af' }} 
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
                onClick={handleNext}
                disabled={isCompleted || moveIndex >= opening.moves_san_10_ply.length}
                className="flex items-center justify-center h-12 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded border border-gray-600 transition-colors"
                title="Hint / Play Move"
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
            totalMoves={opening.moves_san_10_ply.length} 
          />
          <StatsPanel opening={opening} />
        </div>
      </div>
    </div>
  );
};

export default OpeningTrainer;