import React from 'react';
import { BusRoute } from '../types';
import { Trophy, AlertTriangle, Zap, Timer } from 'lucide-react';

interface DriverScorecardProps {
  routes: BusRoute[];
}

const DriverScorecard: React.FC<DriverScorecardProps> = ({ routes }) => {
  // Mock generating scores based on route ID to keep it consistent but simulated
  const driverStats = routes.map(r => {
    // Generate a deterministic pseudo-random score based on bus number
    const seed = r.busNumber.charCodeAt(2) || 50; 
    const safetyScore = Math.min(100, Math.max(65, seed + 20)); 
    
    return {
      ...r,
      score: safetyScore,
      harshBraking: Math.floor((100 - safetyScore) / 5),
      speedingEvents: Math.floor((100 - safetyScore) / 8),
      idling: Math.floor((100 - safetyScore) / 2)
    };
  }).sort((a, b) => b.score - a.score); // Rank highest score first

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={18} /> Driver Safety Leaderboard
        </h3>
        <span className="text-xs font-medium text-slate-500">Weekly Assessment</span>
      </div>

      <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase sticky top-0 z-10">
                <tr>
                    <th className="p-3 border-b border-slate-100">Rank</th>
                    <th className="p-3 border-b border-slate-100">Driver</th>
                    <th className="p-3 border-b border-slate-100 text-center">Events</th>
                    <th className="p-3 border-b border-slate-100 text-right">Score</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {driverStats.map((driver, idx) => (
                    <tr key={driver.id} className="hover:bg-blue-50/50 transition-colors border-b border-slate-50 last:border-0">
                        <td className="p-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                idx === 1 ? 'bg-slate-200 text-slate-700' : 
                                idx === 2 ? 'bg-orange-100 text-orange-800' : 'text-slate-400'
                            }`}>
                                {idx + 1}
                            </div>
                        </td>
                        <td className="p-3">
                            <p className="font-bold text-slate-800">{driver.driver}</p>
                            <p className="text-xs text-slate-500">{driver.busNumber}</p>
                        </td>
                        <td className="p-3">
                            <div className="flex gap-2 justify-center">
                                {driver.harshBraking > 0 && (
                                    <span className="flex items-center text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100" title="Harsh Braking">
                                        <AlertTriangle size={10} className="mr-0.5"/> {driver.harshBraking}
                                    </span>
                                )}
                                {driver.speedingEvents > 0 && (
                                    <span className="flex items-center text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100" title="Speeding">
                                        <Zap size={10} className="mr-0.5"/> {driver.speedingEvents}
                                    </span>
                                )}
                            </div>
                        </td>
                        <td className="p-3 text-right">
                            <div className="inline-flex flex-col items-end">
                                <span className={`font-mono font-bold ${
                                    driver.score >= 90 ? 'text-green-600' :
                                    driver.score >= 80 ? 'text-blue-600' :
                                    driver.score >= 70 ? 'text-orange-500' : 'text-red-600'
                                }`}>
                                    {driver.score}
                                </span>
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                                    <div 
                                        className={`h-full rounded-full ${
                                            driver.score >= 90 ? 'bg-green-500' :
                                            driver.score >= 80 ? 'bg-blue-500' :
                                            driver.score >= 70 ? 'bg-orange-500' : 'bg-red-500'
                                        }`} 
                                        style={{ width: `${driver.score}%` }} 
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverScorecard;
