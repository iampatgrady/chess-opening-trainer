import React, { useState, useEffect, useCallback } from 'react';
import OpeningTrainer from './components/OpeningTrainer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ModeToggle from './components/ModeToggle';
import { OPENINGS_DB } from './data/openings';
import { OpeningVariation } from './types';
import { TrendingUp, BarChart2 } from 'lucide-react';

function App() {
  const [currentOpening, setCurrentOpening] = useState<OpeningVariation | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [isNewbMode, setIsNewbMode] = useState(false);
  const [view, setView] = useState<'trainer' | 'analytics'>('trainer');

  // Function to get a random opening based on mode
  const loadRandomOpening = useCallback(() => {
    // Filter DB based on mode
    const filteredOpenings = OPENINGS_DB.filter(op => {
      if (isNewbMode) return op.category === 'trap';
      return op.category === 'book' || !op.category;
    });

    if (filteredOpenings.length === 0) return;

    const randomIndex = Math.floor(Math.random() * filteredOpenings.length);
    let newOpening = filteredOpenings[randomIndex];

    // Try to pick a different one if multiple exist
    if (filteredOpenings.length > 1 && currentOpening) {
       while (newOpening.variation_id === currentOpening.variation_id) {
            const nextIndex = Math.floor(Math.random() * filteredOpenings.length);
            newOpening = filteredOpenings[nextIndex];
       }
    }
    
    setCurrentOpening(newOpening);
    setMoveIndex(0); // Reset moves for new opening
  }, [isNewbMode, currentOpening]);

  // Initial load & Reload when mode changes
  useEffect(() => {
    loadRandomOpening();
  }, [isNewbMode]); 

  const handleModeToggle = (checked: boolean) => {
    setIsNewbMode(checked);
  };

  if (!currentOpening) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
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
                <span className="text-xs text-gray-400 truncate leading-tight">
                   {view === 'analytics' ? 'Track your progress' : `${currentOpening.eco_code} • ${currentOpening.parent_opening}`}
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
            onNextOpening={loadRandomOpening} 
            moveIndex={moveIndex}
            onMoveIndexChange={setMoveIndex}
          />
        )}
      </main>
    </div>
  );
}

export default App;