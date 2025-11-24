import React from 'react';
import { Wifi } from 'lucide-react';

const TelematicsIntegration: React.FC<any> = () => {
  return (
    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2"><Wifi/> Telematics Gateway</h2>
        <p className="text-slate-400 text-sm mt-2">Status: Connected (Simulated)</p>
    </div>
  );
};

export default TelematicsIntegration;
