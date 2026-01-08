import React, { useState, useEffect, useCallback } from 'react';
import OpeningTrainer from './components/OpeningTrainer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ModeToggle from './components/ModeToggle';
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
  const [view, setView] = useState<'trainer' | 'analytics'>('trainer');
  
  // Easter Egg State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [justCompletedMode, setJustCompletedMode] = useState<'book'|'trap'|null>(null);
  
  // Deck Progress State (for UI)
  const [deckProgress, setDeckProgress] = useState({ completed: 0, total: 0 });

  // Function to get a random opening based on mode, progress, and weights
  const loadRandomOpening = useCallback(() => {
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
        // Should have been handled by handleCompletion, but safe fallback:
        ProgressService.resetMode(mode);
        candidates = allModeOpenings;
        setDeckProgress({ completed: 0, total: allModeOpenings.length });
    }

    // 4. Calculate Weights for the candidates
    // Logic: "Inverse Weighting" based on historical success rate.
    // We want users to see their worst performing openings SOONER in the cycle than their best ones.
    // Since this is a "Deck" system, they will see ALL of them eventually.
    // But high weight = picked earlier in the run.
    
    const successRates = AnalyticsService.getVariationSuccessRates();
    
    const weightedCandidates = candidates.map(op => {
      const rate = successRates[op.variation_id] || 0; // 0.0 to 1.0
      
      // Weight Formula: 10 + (100 * (1 - rate))
      // 0% Success -> 110 Weight
      // 50% Success -> 60 Weight
      // 100% Success -> 10 Weight
      // This ensures even mastered openings have a small chance to appear early, but failed ones appear much more often.
      
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

  // Initial load & Reload when mode changes
  useEffect(() => {
    loadRandomOpening(); 
  }, [isNewbMode]); 

  // Handle completion from the Trainer component
  const handleOpeningComplete = (success: boolean) => {
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
            // Cycle Complete!
            triggerCelebration(mode);
            ProgressService.resetMode(mode);
            // We then load next, which will be from a fresh deck
        }
      }
      
      // Load next (either fresh deck or remaining pool)
      loadRandomOpening();
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

  const handleModeToggle = (checked: boolean) => {
    setIsNewbMode(checked);
  };

  const closeCelebration = () => {
    setShowCompletionModal(false);
  };

  if (!currentOpening) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

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
                    handleModeToggle(!isNewbMode); 
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
          <div className="flex items-center justify-between w-full">
            
            {/* Left: Logo/Analytics Trigger */}
            <div 
              className="flex items-center gap-3 overflow-hidden cursor-pointer group"
              onClick={() => setView(view === 'trainer' ? 'analytics' : 'trainer')}
              title="Click for Analytics"
            >
              <div className={`p-1.5 rounded-lg flex-shrink-0 transition-colors duration-300 relative ${
                isNewbMode ? 'bg-red-600' : 'bg-blue-600'
              }`}>
                 <TrendingUp className={`h-5 w-5 text-white transition-opacity duration-300 ${view === 'analytics' ? 'opacity-0 absolute' : 'opacity-100'}`} />
                 <BarChart2 className={`h-5 w-5 text-white transition-opacity duration-300 ${view === 'trainer' ? 'opacity-0 absolute' : 'opacity-100'}`} />
              </div>
              <div className="flex flex-col min-w-0 group-hover:opacity-80 transition-opacity">
                <span className="text-base font-bold text-white tracking-tight truncate leading-tight">
                  {view === 'analytics' ? 'Training Analytics' : currentOpening.name}
                </span>
                <span className="text-xs text-gray-400 truncate leading-tight flex items-center gap-1.5">
                   {view === 'analytics' ? 'Track your progress' : (
                       <>
                         <span>{currentOpening.eco_code}</span>
                         <span className="opacity-50">•</span>
                         <span className="flex items-center gap-1 text-gray-300">
                             <Layers className="w-3 h-3" />
                             {deckProgress.completed}/{deckProgress.total} in cycle
                         </span>
                       </>
                   )}
                </span>
              </div>
            </div>

            {/* Top Right Toggle (Only show in Trainer View) */}
            {view === 'trainer' && (
              <div className="flex-shrink-0 ml-2">
                <ModeToggle isNewbMode={isNewbMode} onToggle={handleModeToggle} />
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
          />
        )}
      </main>
    </div>
  );
}

export default App;