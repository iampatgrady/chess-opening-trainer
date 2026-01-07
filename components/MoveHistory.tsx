import React, { useEffect, useRef } from 'react';

interface MoveHistoryProps {
  moves: string[]; // List of SAN moves played so far
  totalMoves: number; // Total expected moves
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, totalMoves }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when moves update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves]);

  // Group moves into pairs for display (White, Black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null
    });
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 flex flex-col h-full max-h-[300px] lg:max-h-[400px]">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Move History</h3>
          <span className="text-xs text-gray-400 font-mono">
            {moves.length}/{totalMoves} PLY
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800 sticky top-0">
            <tr>
              <th className="px-2 py-1 w-10">#</th>
              <th className="px-2 py-1">White</th>
              <th className="px-2 py-1">Black</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {movePairs.map((pair) => (
              <tr key={pair.num} className="hover:bg-gray-700/50">
                <td className="px-2 py-2 text-gray-500 font-mono">{pair.num}.</td>
                <td className="px-2 py-2 text-gray-200 font-medium">
                  <span className="bg-gray-700 px-2 py-1 rounded text-white border border-gray-600">
                    {pair.white}
                  </span>
                </td>
                <td className="px-2 py-2 text-gray-200 font-medium">
                  {pair.black ? (
                     <span className="bg-gray-700 px-2 py-1 rounded text-white border border-gray-600">
                     {pair.black}
                   </span>
                  ) : (
                    <span className="text-gray-600">...</span>
                  )}
                </td>
              </tr>
            ))}
            {/* If empty */}
            {movePairs.length === 0 && (
               <tr>
                 <td colSpan={3} className="px-2 py-8 text-center text-gray-500 italic">
                   Game has not started
                 </td>
               </tr>
            )}
            <div ref={bottomRef} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoveHistory;