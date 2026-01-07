import React from 'react';
import { OpeningVariation } from '../types';

interface StatsPanelProps {
  opening: OpeningVariation;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ opening }) => {
  const { white_win_percent, black_win_percent, draw_percent } = opening.statistical_profile;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-white">Statistical Profile</h3>
      
      <div className="space-y-4">
        {/* White Wins */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">White Wins</span>
            <span className="text-green-400 font-bold">{white_win_percent}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500 ease-out"
              style={{ width: `${white_win_percent}%` }}
            />
          </div>
        </div>

        {/* Draw */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">Draw</span>
            <span className="text-gray-400 font-bold">{draw_percent}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-400 transition-all duration-500 ease-out"
              style={{ width: `${draw_percent}%` }}
            />
          </div>
        </div>

        {/* Black Wins */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">Black Wins</span>
            <span className="text-red-400 font-bold">{black_win_percent}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-500 ease-out"
              style={{ width: `${black_win_percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Strategic Themes</h4>
        <div className="flex flex-wrap gap-2">
          {opening.strategic_themes.map((theme, idx) => (
            <span 
              key={idx} 
              className="px-3 py-1 bg-gray-700 text-gray-200 text-xs rounded-full border border-gray-600"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;