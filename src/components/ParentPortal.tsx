import React from 'react';
import { Student, BusRoute } from '../types';
import { User, Bus } from 'lucide-react';

const ParentPortal: React.FC<{ student: Student, routes: BusRoute[] }> = ({ student }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><User className="text-blue-600"/> Guardian Portal View</h2>
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 mb-6">
            <h3 className="font-bold text-blue-900 text-lg mb-2">{student.name}</h3>
            <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium flex items-center gap-2"><Bus size={16}/> Status: {student.status}</span>
            </div>
        </div>
        <div className="text-center text-slate-400 text-sm">Simulation of Parent Mobile App Interface</div>
    </div>
  );
};

export default ParentPortal;
