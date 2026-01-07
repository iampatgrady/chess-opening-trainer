import React from 'react';
import { Skull, BookOpen } from 'lucide-react';

interface ModeToggleProps {
  isNewbMode: boolean;
  onToggle: (checked: boolean) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ isNewbMode, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(!isNewbMode)}
      className={`relative inline-flex h-8 w-16 cursor-pointer items-center rounded-full transition-colors duration-300 ${
        isNewbMode ? 'bg-red-600' : 'bg-blue-600'
      }`}
      title={isNewbMode ? "Newb Mode (500 Elo Simulation)" : "Book Mode (Standard Theory)"}
    >
      <span className="sr-only">Toggle Newb Mode</span>
      <span
        className={`${
          isNewbMode ? 'translate-x-9' : 'translate-x-1'
        } inline-block h-6 w-6 transform rounded-full bg-white transition duration-300 flex items-center justify-center`}
      >
        {isNewbMode ? (
          <Skull className="h-3.5 w-3.5 text-red-600" />
        ) : (
          <BookOpen className="h-3.5 w-3.5 text-blue-600" />
        )}
      </span>
    </div>
  );
};

export default ModeToggle;