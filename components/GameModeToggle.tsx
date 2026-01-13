import React from 'react';
import { Trophy, Dumbbell } from 'lucide-react';

interface GameModeToggleProps {
  mode: 'challenge' | 'training';
  onToggle: (mode: 'challenge' | 'training') => void;
}

const GameModeToggle: React.FC<GameModeToggleProps> = ({ mode, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(mode === 'challenge' ? 'training' : 'challenge')}
      className={`relative inline-flex h-8 w-16 cursor-pointer items-center rounded-full transition-colors duration-300 ${
        mode === 'challenge' ? 'bg-yellow-600' : 'bg-emerald-600'
      }`}
      title={mode === 'challenge' ? "Challenge Mode: Random deck & Progress tracking" : "Training Mode: Pick & Practice"}
    >
      <span className="sr-only">Toggle Game Mode</span>
      <span
        className={`${
          mode === 'challenge' ? 'translate-x-1' : 'translate-x-9'
        } inline-block h-6 w-6 transform rounded-full bg-white transition duration-300 flex items-center justify-center shadow-md`}
      >
        {mode === 'challenge' ? (
          <Trophy className="h-3.5 w-3.5 text-yellow-600" />
        ) : (
          <Dumbbell className="h-3.5 w-3.5 text-emerald-600" />
        )}
      </span>
    </div>
  );
};

export default GameModeToggle;