import React, { useState, useEffect } from 'react';
import OpeningTrainer from './components/OpeningTrainer';
import { OPENINGS_DB } from './data/openings';
import { OpeningVariation } from './types';
import { BookOpen, Hash } from 'lucide-react';

function App() {
  const [currentOpening, setCurrentOpening] = useState<OpeningVariation | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);

  // Function to get a random opening
  const loadRandomOpening = () => {
    const randomIndex = Math.floor(Math.random() * OPENINGS_DB.length);
    // Ensure we don't pick the same one twice if possible (unless only 1 exists)
    if (OPENINGS_DB.length > 1 && currentOpening) {
        let newOpening = OPENINGS_DB[randomIndex];
        while (newOpening.variation_id === currentOpening.variation_id) {
             const nextIndex = Math.floor(Math.random() * OPENINGS_DB.length);
             newOpening = OPENINGS_DB[nextIndex];
        }
        setCurrentOpening(newOpening);
    } else {
        setCurrentOpening(OPENINGS_DB[randomIndex]);
    }
    setMoveIndex(0); // Reset moves for new opening
  };

  // Initial load
  useEffect(() => {
    loadRandomOpening();
  }, []);

  if (!currentOpening) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-20 h-14 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-blue-600 p-1.5 rounded-lg flex-shrink-0">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold text-white tracking-tight truncate leading-tight">
                  {currentOpening.name}
                </span>
                <span className="text-xs text-gray-400 truncate leading-tight">
                  {currentOpening.eco_code} • {currentOpening.parent_opening}
                </span>
              </div>
            </div>

            {/* Top Right Move Indicator */}
            <div className="flex-shrink-0 ml-2">
              <div className="bg-gray-700/50 px-3 py-1.5 rounded-md border border-gray-600 flex items-center gap-2">
                <Hash className="w-3 h-3 text-gray-400" />
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-mono font-bold">{moveIndex}</span>
                  <span className="text-gray-500 font-mono text-xs">/</span>
                  <span className="text-gray-400 font-mono text-xs">{currentOpening.moves_san_10_ply.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <OpeningTrainer 
          opening={currentOpening} 
          onNextOpening={loadRandomOpening} 
          moveIndex={moveIndex}
          onMoveIndexChange={setMoveIndex}
        />
      </main>
    </div>
  );
}

export default App;