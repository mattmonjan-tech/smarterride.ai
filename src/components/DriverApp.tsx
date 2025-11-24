
import React from 'react';
import { Bus } from 'lucide-react';

const DriverApp: React.FC<any> = ({ routes }) => {
  return (
    <div className="h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
        <Bus size={64} className="mb-4 text-blue-500"/>
        <h1 className="text-3xl font-bold mb-2">Driver Kiosk</h1>
        <p className="text-slate-400">Route: {routes[0]?.name}</p>
    </div>
  );
};

export default DriverApp;
