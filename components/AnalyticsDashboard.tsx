
import React, { useMemo } from 'react';
import { AnalyticsService } from '../services/analytics';
import { TrainingAttempt } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Clock, CheckCircle, XCircle, TrendingUp, Activity } from 'lucide-react';

const AnalyticsDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const attempts = useMemo(() => AnalyticsService.getAllAttempts(), []);

  // --- Aggregations ---

  const totalTimeMinutes = Math.floor(attempts.reduce((acc, cur) => acc + cur.duration_ms, 0) / 1000 / 60);
  const successRate = attempts.length > 0 
    ? Math.round((attempts.filter(a => a.success).length / attempts.length) * 100) 
    : 0;
  
  // Group by Parent Opening
  const openingStats = useMemo(() => {
    const map = new Map<string, { total: number; success: number }>();
    attempts.forEach(a => {
      const current = map.get(a.parent_opening) || { total: 0, success: 0 };
      current.total += 1;
      if (a.success) current.success += 1;
      map.set(a.parent_opening, current);
    });
    
    return Array.from(map.entries()).map(([name, stats]) => ({
      name,
      rate: Math.round((stats.success / stats.total) * 100),
      count: stats.total
    })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [attempts]);

  // Trend Data (Last 20 attempts)
  const trendData = useMemo(() => {
    return attempts.slice(-20).map((a, idx) => ({
      id: idx + 1,
      duration: Math.round(a.duration_ms / 1000),
      success: a.success ? 100 : 0
    }));
  }, [attempts]);

  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center px-4">
        <Activity className="w-20 h-20 text-gray-600 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2">No Training Data Yet</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Complete some variations in the Opening Trainer to see your performance metrics here.
        </p>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          Start Training
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="text-blue-500" />
          Performance Analytics
        </h2>
        <button 
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white underline"
        >
          Back to Trainer
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Training Time</span>
            <Clock className="text-blue-400 w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-white">{totalTimeMinutes} <span className="text-sm font-normal text-gray-500">min</span></div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Variations Completed</span>
            <CheckCircle className="text-green-400 w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-white">{attempts.length}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Global Success Rate</span>
            <Activity className="text-purple-400 w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-white">{successRate}%</div>
          <p className="text-xs text-gray-500 mt-1">Perfect variations without errors</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Success Rate by Opening */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">Success Rate by Opening (Top 10)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={openingStats} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{fill: '#9CA3AF', fontSize: 11}} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                />
                <Bar dataKey="rate" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Success Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Speed Trend */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">Variation Speed (Last 20 Runs)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="id" hide />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                  labelFormatter={() => ''}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  name="Duration (sec)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-900/50 text-gray-200 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Opening</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Avg Move</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {attempts.slice().reverse().slice(0, 10).map((attempt) => (
                <tr key={attempt.id} className="hover:bg-gray-750">
                  <td className="px-4 py-3 font-medium text-white">{attempt.variation_name}</td>
                  <td className="px-4 py-3">
                    {attempt.success ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/50 text-green-400 border border-green-800">
                        Perfect
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900/50 text-red-400 border border-red-800">
                        {attempt.mistake_count} Misses
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{(attempt.duration_ms / 1000).toFixed(1)}s</td>
                  <td className="px-4 py-3">{(attempt.avg_time_per_move_ms / 1000).toFixed(2)}s</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(attempt.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsDashboard;
