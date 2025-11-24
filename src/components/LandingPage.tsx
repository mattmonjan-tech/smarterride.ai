
import React from 'react';
import { Bus, ArrowRight } from 'lucide-react';

const LandingPage: React.FC<{ onLogin: any, onQuoteRequest?: any }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
            <Bus size={40} />
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">RideSmart<span className="text-blue-600">.ai</span></h1>
        <p className="text-xl text-slate-500 max-w-md mb-8">Next-generation student transportation logistics and safety platform.</p>
        <button 
            onClick={() => onLogin('ADMIN')} 
            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
        >
            Launch Dashboard <ArrowRight size={20}/>
        </button>
    </div>
  );
};

export default LandingPage;
