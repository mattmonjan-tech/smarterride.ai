import React, { useState } from 'react';
import { BusRoute, BusStatus, VehicleType } from '../types';
import { X, Save, Bus, User, Users, MapPin, Truck, ChevronDown } from 'lucide-react';

interface EditRouteModalProps {
  route: BusRoute;
  onSave: (updatedRoute: BusRoute) => void;
  onClose: () => void;
}

const EditRouteModal: React.FC<EditRouteModalProps> = ({ route, onSave, onClose }) => {
  const [name, setName] = useState(route.name);
  const [driver, setDriver] = useState(route.driver);
  const [busNumber, setBusNumber] = useState(route.busNumber);
  const [status, setStatus] = useState<BusStatus>(route.status);
  const [capacity, setCapacity] = useState<number>(route.capacity);
  const [vehicleType, setVehicleType] = useState<VehicleType>(route.vehicleType || 'Standard Bus');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...route,
      name,
      driver,
      busNumber,
      status,
      capacity: Number(capacity),
      vehicleType: vehicleType
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Bus size={18} /> Edit Route Details
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Route Name Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Route Name</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Sabino Canyon Express"
                    required
                />
            </div>
          </div>

          {/* Bus Number Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bus Number</label>
            <div className="relative">
                <Bus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                />
            </div>
          </div>

          {/* Vehicle Type Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Type</label>
            <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                    className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white appearance-none cursor-pointer"
                >
                    <option value="Standard Bus">Standard Bus</option>
                    <option value="Activity Bus">Activity Bus</option>
                    <option value="Shuttle">Shuttle</option>
                    <option value="Wheelchair Van">Wheelchair Van</option>
                    <option value="Electric Bus">Electric Bus</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Driver Name Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Driver Name</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                />
            </div>
          </div>

          {/* Bus Capacity Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bus Capacity</label>
            <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="number" 
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                />
            </div>
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <div className="relative">
                <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BusStatus)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white appearance-none cursor-pointer"
                >
                    {Object.values(BusStatus).map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
                <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRouteModal;
