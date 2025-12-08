import React, { useEffect, useState } from 'react';
import { BusRoute, BusStatus, OptimizationInsight } from '../types';
import { Bus, MapPin, AlertTriangle, X, Navigation, Clock, CheckCircle2, Sparkles, Loader2, Wrench } from 'lucide-react';

export interface RoadDefinition {
  id: string;
  d: string;
}

interface SimulatedMapProps {
  routes: BusRoute[];
  onDismissAlert?: (busId: string) => void;
  roadOverrides?: RoadDefinition[];
  routeOverrides?: Record<string, string>;
  optimizationInsights?: OptimizationInsight[];
  focusedBusId?: string | null;
  onReportIssue?: (busId: string, busNumber: string) => void;
}

const DEFAULT_ROADS: RoadDefinition[] = [
    { id: 'road-1', d: "M 10 30 Q 30 30 50 50 T 90 70" }, 
    { id: 'road-2', d: "M 20 80 L 80 20" }, 
    { id: 'road-3', d: "M 50 10 L 50 90" } 
];

const DEFAULT_BUS_ROAD_MAP: Record<string, string> = {
    'R-101': 'road-1',
    'R-104': 'road-3',
    'R-202': 'road-2',
    'R-305': 'road-2'
};

const SimulatedMap: React.FC<SimulatedMapProps> = ({ 
    routes, 
    onDismissAlert,
    roadOverrides,
    routeOverrides,
    optimizationInsights,
    focusedBusId,
    onReportIssue
}) => {
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [confirmDismissId, setConfirmDismissId] = useState<string | null>(null);

  const activeRoads = roadOverrides || DEFAULT_ROADS;
  const activeBusMap = routeOverrides || DEFAULT_BUS_ROAD_MAP;
  const isOptimizedView = !!optimizationInsights;

  useEffect(() => {
    if (focusedBusId) {
        setSelectedBusId(focusedBusId);
    }
  }, [focusedBusId]);

  useEffect(() => {
    setConfirmDismissId(null);
  }, [selectedBusId]);

  if (!routes || routes.length === 0) {
    return (
        <div className="relative w-full h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner group/map flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-500" />
                <p className="text-sm font-semibold">Acquiring Satellite Link...</p>
            </div>
        </div>
    );
  }

  const selectedBus = routes.find(r => r.id === selectedBusId);

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner group/map">
      <svg className="absolute inset-0 w-full h-full text-slate-300" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.5"/>
            </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {activeRoads.map(road => (
            <path 
                key={road.id}
                d={road.d} 
                fill="none" 
                stroke={isOptimizedView ? "#a855f7" : "#cbd5e1"}
                strokeWidth={isOptimizedView ? "2.5" : "2"} 
                strokeLinecap="round" 
                vectorEffect="non-scaling-stroke" 
            />
        ))}
      </svg>

      {routes.map((bus) => {
        const isSelected = selectedBusId === bus.id;
        const insight = optimizationInsights?.find(i => i.routeId === bus.id);
        
        let markerClass = 'bg-green-500 ring-green-300';
        if (isOptimizedView && insight) markerClass = 'bg-purple-600 ring-purple-300';
        else if (bus.alert) markerClass = 'bg-red-500 ring-red-300';
        else if (bus.status === 'Maintenance') markerClass = 'bg-orange-500 ring-orange-300';
        else if (bus.status === 'Idle') markerClass = 'bg-gray-500 ring-gray-300';

        return (
            <div
                key={bus.id}
                className={`absolute transition-all duration-1000 ease-in-out transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 ${isSelected ? 'z-30 scale-110' : 'hover:scale-110'}`}
                style={{ left: `${bus.coordinates.x}%`, top: `${bus.coordinates.y}%` }}
                onClick={(e) => { e.stopPropagation(); setSelectedBusId(bus.id); }}
            >
                {(bus.status === 'On Route' || bus.status === 'Delayed' || isOptimizedView) && (
                    <div className={`absolute inset-0 rounded-full opacity-50 animate-ping ${markerClass.split(' ')[0]}`} />
                )}
                <div className={`relative z-10 p-2 rounded-full shadow-lg text-white ${markerClass} ${isSelected ? 'ring-4 ring-offset-2 ring-blue-400' : 'ring-2'}`}>
                    <Bus size={20} />
                </div>
            </div>
        );
      })}

      {selectedBus && (
           <div className="absolute top-4 right-4 w-72 bg-white/95 backdrop-blur rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-right-4 duration-300 z-40">
                <div className="bg-slate-800 text-white p-4 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Bus size={18} className="text-blue-400"/>
                            <span className="font-bold text-lg">{selectedBus.busNumber}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">{selectedBus.name}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedBusId(null); }} className="hover:bg-white/10 rounded-full p-1"><X size={18} /></button>
                </div>
                <div className="p-4">
                    <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Occupancy</span>
                             <div className="text-sm font-bold text-slate-700">{selectedBus.occupancy} / {selectedBus.capacity}</div>
                         </div>
                         <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min(100, (selectedBus.occupancy / selectedBus.capacity) * 100)}%` }}></div>
                         </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Operator</span>
                        <span className="font-medium text-slate-800">{selectedBus.driver}</span>
                    </div>
                </div>
           </div>
       )}
    </div>
  );
};

export default SimulatedMap;
