
import React, { useState } from 'react';
import { BusRoute } from '../types';
import { generateRouteOptimizations } from '../services/geminiService';
import { Sparkles, Play } from 'lucide-react';

const RouteOptimizer: React.FC<{ routes: BusRoute[] }> = ({ routes }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const result = await generateRouteOptimizations(routes);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Sparkles className="text-purple-600" /> AI Route Optimization</h2>
          <p className="text-slate-500">Analyze traffic patterns and occupancy.</p>
        </div>
        <button onClick={handleOptimize} disabled={loading} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2">
            {loading ? 'Analyzing...' : <><Play size={18}/> Run Model</>}
        </button>
      </div>
      {analysis && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-2">Optimization Report</h3>
              <p className="text-slate-600 mb-4">{analysis.overview}</p>
              <div className="text-3xl font-bold text-green-600 mb-4">{analysis.estimatedSavings} Savings</div>
              <div className="space-y-2">
                  {analysis.insights?.map((insight: any, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 rounded border border-slate-100">
                          <div className="font-bold text-slate-800">{insight.routeId}: {insight.suggestion}</div>
                          <div className="text-sm text-slate-500">{insight.impact}</div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default RouteOptimizer;
