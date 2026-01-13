import React, { useState, useEffect, useCallback } from 'react';
import OpeningTrainer from './components/OpeningTrainer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ModeToggle from './components/ModeToggle';
import GameModeToggle from './components/GameModeToggle';
import { OPENINGS_DB } from './data/openings';
import { OpeningVariation } from './types';
import { TrendingUp, BarChart2, Trophy, Star, Layers } from 'lucide-react';
import { AnalyticsService } from './services/analytics';
import { ProgressService } from './services/progress';
import confetti from 'canvas-confetti';

function App() {
  const [currentOpening, setCurrentOpening] = useState<OpeningVariation | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [isNewbMode, setIsNewbMode] = useState(false);
  const [gameMode, setGameMode] = useState<'challenge' | 'training'>('challenge');
  const [view, setView] = useState<'trainer' | 'analytics'>('trainer');
  
  // Easter Egg State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [justCompletedMode, setJustCompletedMode] = useState<'book'|'trap'|null>(null);
  
  // Deck Progress State (for UI)
  const [deckProgress, setDeckProgress] = useState({ completed: 0, total: 0 });

  // --- Logic for Training Mode (Deterministic) ---
  const getTrainingList = useCallback(() => {
     return OPENINGS_DB
        .filter(op => isNewbMode ? op.category === 'trap' : (op.category === 'book' || !op.category))
        .sort((a, b) => a.name.localeCompare(b.name));
  }, [isNewbMode]);

  const loadTrainingOpening = useCallback((specificOp?: OpeningVariation) => {
     const list = getTrainingList();
     if (list.length === 0) return;

     if (specificOp) {
       setCurrentOpening(specificOp);
     } else if (!currentOpening || !list.find(o => o.variation_id === currentOpening.variation_id)) {
       setCurrentOpening(list[0]);
     }
     setMoveIndex(0);
     setDeckProgress({ completed: 0, total: list.length }); 
  }, [getTrainingList, currentOpening]);


  // --- Logic for Challenge Mode (Weighted Random) ---
  const loadRandomChallengeOpening = useCallback(() => {
    // 1. Filter DB based on mode
    const mode = isNewbMode ? 'trap' : 'book';
    const allModeOpenings = OPENINGS_DB.filter(op => {
      if (isNewbMode) return op.category === 'trap';
      return op.category === 'book' || !op.category;
    });

    if (allModeOpenings.length === 0) return;

    // 2. Get Completed Variations for this cycle (The "Room")
    const progress = ProgressService.getProgress();
    const completedIds = progress[mode] || [];
    
    // Update UI Stats
    setDeckProgress({ completed: completedIds.length, total: allModeOpenings.length });

    // 3. Filter candidates (The "Pool")
    // If a user refreshes after completion but before reset, this might be empty. 
    // In that case, we reset implicitly.
    let candidates = allModeOpenings.filter(op => !completedIds.includes(op.variation_id));
    
    if (candidates.length === 0) {
        ProgressService.resetMode(mode);
        candidates = allModeOpenings;
        setDeckProgress({ completed: 0, total: allModeOpenings.length });
    }

    // 4. Calculate Weights for the candidates
    const successRates = AnalyticsService.getVariationSuccessRates();
    
    const weightedCandidates = candidates.map(op => {
      const rate = successRates[op.variation_id] || 0; // 0.0 to 1.0
      
      let weight = 10 + (100 * (1 - rate));
      
      // Small penalty if it was the VERY last one played (to prevent back-to-back if deck was just reset)
      if (currentOpening?.variation_id === op.variation_id && candidates.length > 1) {
          weight = weight * 0.1;
      }
      
      return { op, weight };
    });

    // 5. Weighted Random Selection
    const totalWeight = weightedCandidates.reduce((sum, c) => sum + c.weight, 0);
    let randomValue = Math.random() * totalWeight;
    
    let selectedOpening = weightedCandidates[0].op;
    for (const candidate of weightedCandidates) {
      randomValue -= candidate.weight;
      if (randomValue <= 0) {
        selectedOpening = candidate.op;
        break;
      }
    }
    
    setCurrentOpening(selectedOpening);
    setMoveIndex(0); 
  }, [isNewbMode, currentOpening]);


  // --- Master Loader ---
  const loadNextOpening = useCallback(() => {
    if (gameMode === 'training') {
        loadTrainingOpening();
    } else {
        loadRandomChallengeOpening();
    }
  }, [gameMode, loadTrainingOpening, loadRandomChallengeOpening]);

  // Initial load & Reload when params change
  useEffect(() => {
    loadNextOpening(); 
  }, [gameMode, isNewbMode]); // React to changes in mode


  // Handle completion from the Trainer component
  const handleOpeningComplete = (success: boolean) => {
      if (gameMode === 'training') {
          // In Training mode, "Next" simply goes to the next index
          if (!currentOpening) return;
          const list = getTrainingList();
          const currentIndex = list.findIndex(op => op.variation_id === currentOpening.variation_id);
          const nextIndex = (currentIndex + 1) % list.length;
          setCurrentOpening(list[nextIndex]);
          setMoveIndex(0);
          return;
      }

      // Challenge Mode Logic
      if (success && currentOpening) {
        const mode = isNewbMode ? 'trap' : 'book';
        
        // Mark as complete in the "Room"
        ProgressService.markComplete(currentOpening.variation_id, mode);
        
        // Check if Deck is Full (Cycle Complete)
        const progress = ProgressService.getProgress();
        const completedIds = progress[mode] || [];
        
        const allModeOpenings = OPENINGS_DB.filter(op => {
            if (isNewbMode) return op.category === 'trap';
            return op.category === 'book' || !op.category;
        });

        if (completedIds.length >= allModeOpenings.length) {
            triggerCelebration(mode);
            ProgressService.resetMode(mode);
        }
      }
      
      // Load next
      loadRandomChallengeOpening();
  };

  const handleTrainingSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      const op = OPENINGS_DB.find(o => o.variation_id === id);
      if (op) {
          setCurrentOpening(op);
          setMoveIndex(0);
      }
  };

  const triggerCelebration = (mode: 'trap' | 'book') => {
    setJustCompletedMode(mode);
    setShowCompletionModal(true);
    
    // Big fireworks
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: mode === 'trap' ? ['#ef4444', '#b91c1c'] : ['#3b82f6', '#1d4ed8']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: mode === 'trap' ? ['#ef4444', '#b91c1c'] : ['#3b82f6', '#1d4ed8']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const closeCelebration = () => {
    setShowCompletionModal(false);
  };

  if (!currentOpening) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  const trainingList = getTrainingList();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col relative">
      
      {/* Celebration Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-gray-800 border-2 border-yellow-500/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-yellow-500/10 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                 <Trophy className="w-10 h-10 text-yellow-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                {justCompletedMode === 'trap' ? 'Traps Mastered!' : 'Theory Mastered!'}
              </h2>
              <p className="text-gray-300 mb-8">
                You have successfully cleared the deck! Every variation in this mode has been completed in this run. The cycle will now reset.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                  onClick={closeCelebration}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Start New Cycle
                </button>
                <button 
                  onClick={() => {
                    closeCelebration();
                    setIsNewbMode(!isNewbMode); 
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                   Try {isNewbMode ? 'Book' : 'Newb'} Mode <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className={`border-b transition-colors duration-500 sticky top-0 z-20 h-14 flex items-center shadow-sm ${
        isNewbMode ? 'bg-red-900/20 border-red-800' : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between w-full gap-4">
            
            {/* Left: Logo/Analytics Trigger */}
            <div 
              className="flex items-center gap-3 overflow-hidden cursor-pointer group flex-1"
            >
              <div 
                  className={`p-1.5 rounded-lg flex-shrink-0 transition-colors duration-300 relative ${
                    isNewbMode ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                  onClick={() => setView(view === 'trainer' ? 'analytics' : 'trainer')}
              >
                 <TrendingUp className={`h-5 w-5 text-white transition-opacity duration-300 ${view === 'analytics' ? 'opacity-0 absolute' : 'opacity-100'}`} />
                 <BarChart2 className={`h-5 w-5 text-white transition-opacity duration-300 ${view === 'trainer' ? 'opacity-0 absolute' : 'opacity-100'}`} />
              </div>

              {view === 'analytics' ? (
                <div className="flex flex-col min-w-0" onClick={() => setView('trainer')}>
                    <span className="text-base font-bold text-white tracking-tight">Training Analytics</span>
                </div>
              ) : (
                <div className="flex flex-col min-w-0 flex-1">
                    {/* In Training Mode, allow Selection */}
                    {gameMode === 'training' ? (
                        <div className="w-full max-w-sm">
                             <select 
                                value={currentOpening.variation_id}
                                onChange={handleTrainingSelect}
                                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1"
                             >
                                {trainingList.map(op => (
                                    <option key={op.variation_id} value={op.variation_id}>
                                        {op.name}
                                    </option>
                                ))}
                             </select>
                        </div>
                    ) : (
                        // Challenge Mode Display
                        <div className="group-hover:opacity-80 transition-opacity" onClick={() => setView('analytics')}>
                            <span className="text-base font-bold text-white tracking-tight truncate leading-tight block">
                                {currentOpening.name}
                            </span>
                            <span className="text-xs text-gray-400 truncate leading-tight flex items-center gap-1.5">
                                <span>{currentOpening.eco_code}</span>
                                <span className="opacity-50">•</span>
                                <span className="flex items-center gap-1 text-gray-300">
                                    <Layers className="w-3 h-3" />
                                    {deckProgress.completed}/{deckProgress.total} in deck
                                </span>
                            </span>
                        </div>
                    )}
                </div>
              )}
            </div>

            {/* Top Right Toggles (Only show in Trainer View) */}
            {view === 'trainer' && (
              <div className="flex items-center gap-3 flex-shrink-0">
                <GameModeToggle mode={gameMode} onToggle={setGameMode} />
                <div className="h-6 w-px bg-gray-700"></div>
                <ModeToggle isNewbMode={isNewbMode} onToggle={setIsNewbMode} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-900">
        {view === 'analytics' ? (
          <AnalyticsDashboard onBack={() => setView('trainer')} />
        ) : (
          <OpeningTrainer 
            opening={currentOpening} 
            onComplete={handleOpeningComplete} 
            moveIndex={moveIndex}
            onMoveIndexChange={setMoveIndex}
            gameMode={gameMode}
          />
        )}
      </main>
    </div>
  );
}

export default App;