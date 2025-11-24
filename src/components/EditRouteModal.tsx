
import React, { useState } from 'react';
import { BusRoute, BusStatus } from '../types';
import { X, Save, Bus } from 'lucide-react';

interface EditRouteModalProps {
  route: BusRoute;
  onSave: (updatedRoute: BusRoute) => void;
  onClose: () => void;
}

const EditRouteModal: React.FC<EditRouteModalProps> = ({ route, onSave, onClose }) => {
  const [name, setName] = useState(route.name);
  const [driver, setDriver] = useState(route.driver);
  const [status, setStatus] = useState<BusStatus>(route.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...route, name, driver, status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2"><Bus size={18} /> Edit Route</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Route Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Driver</label>
            <input type="text" value={driver} onChange={e => setDriver(e.target.value)} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as BusStatus)} className="w-full border rounded-lg p-2 bg-white">
                {Object.values(BusStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Save size={16}/> Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRouteModal;
