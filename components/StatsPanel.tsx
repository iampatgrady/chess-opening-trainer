import React from 'react';
import { OpeningVariation } from '../types';

interface StatsPanelProps {
  opening: OpeningVariation;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ opening }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700 space-y-6">
      {opening.description && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-white">Strategy & Context</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {opening.description}
          </p>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Strategic Themes</h3>
        <div className="flex flex-wrap gap-2">
          {opening.strategic_themes.map((theme, idx) => (
            <span 
              key={idx} 
              className="px-3 py-1 bg-gray-700 text-gray-200 text-sm rounded-full border border-gray-600"
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