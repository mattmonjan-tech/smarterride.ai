
import React, { useState } from 'react';
import { BusRoute, BusStatus } from '../types';
import { X, Calendar, MapPin, Bus, User, Flag } from 'lucide-react';

interface CreateEventModalProps {
  onSave: (newRoute: BusRoute) => void;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onSave, onClose }) => {
  const [eventName, setEventName] = useState('');
  const [destination, setDestination] = useState('');
  const [eventType, setEventType] = useState<'FIELD_TRIP' | 'ATHLETICS'>('FIELD_TRIP');
  const [date, setDate] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [driver, setDriver] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute: BusRoute = {
      id: `E-${Date.now()}`,
      name: eventName,
      driver: driver || 'TBD',
      busNumber: busNumber || 'TBD',
      status: BusStatus.IDLE,
      capacity: 50,
      occupancy: 0,
      nextStop: destination,
      estimatedArrival: '10:00',
      coordinates: { x: 50, y: 50 }, // Default center start
      type: eventType,
      destination: destination,
      eventDate: date,
      vehicleType: 'Activity Bus'
    };
    onSave(newRoute);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Calendar size={18} /> Schedule Special Event
          </h3>
          <button onClick={onClose} className="text-indigo-100 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Science Museum Trip"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                    <option value="FIELD_TRIP">Field Trip</option>
                    <option value="ATHLETICS">Athletics</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    required
                    placeholder="Address or Venue Name"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bus #</label>
                <div className="relative">
                    <Bus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="B-101"
                        value={busNumber}
                        onChange={e => setBusNumber(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Driver</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Driver Name"
                        value={driver}
                        onChange={e => setDriver(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
            >
                Schedule Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
