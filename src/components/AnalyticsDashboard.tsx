
import React from 'react';
import { Activity } from 'lucide-react';

const AnalyticsDashboard: React.FC<any> = () => {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 mt-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Activity className="text-blue-600"/> Analytics</h3>
        <div className="h-32 bg-slate-50 rounded flex items-center justify-center text-slate-400">Charts Loaded</div>
    </div>
  );
};

export default AnalyticsDashboard;
