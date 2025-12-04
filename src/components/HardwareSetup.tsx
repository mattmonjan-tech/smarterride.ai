import React, { useState, useEffect, useRef } from 'react';
import { RECOMMENDED_HARDWARE } from '../constants';
import { Student, StudentStatus } from '../types';
import { 
  Tablet, 
  Scan, 
  Cable, 
  CheckCircle2, 
  Upload, 
  Zap, 
  Keyboard,
  Image as ImageIcon,
  Settings,
  FileText,
  Download,
  Check,
  AlertCircle
} from 'lucide-react';

interface HardwareSetupProps {
    onImportStudents?: (newStudents: Student[]) => void;
}

const HardwareSetup: React.FC<HardwareSetupProps> = ({ onImportStudents }) => {
  const [activeTab, setActiveTab] = useState<'devices' | 'simulator' | 'provision' | 'district'>('devices');
  
  // Simulator State
  const [scanInput, setScanInput] = useState('');
  const [lastScan, setLastScan] = useState<{code: string, mode: 'MANUAL' | 'SCANNER'} | null>(null);
  const [keyTimes, setKeyTimes] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Provisioning State
  const provisioningFileRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // District Settings State
  const [districtName, setDistrictName] = useState('Tucson Unified School District');
  const [districtCode, setDistrictCode] = useState('TUSD-882');
  const [brandColor, setBrandColor] = useState('#2563eb'); // Default Blue
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const objectUrl = URL.createObjectURL(file);
        setLogoPreview(objectUrl);
    }
  };

  // Logic to detect scanner vs human
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const now = Date.now();
    setKeyTimes(prev => [...prev, now]);

    if (e.key === 'Enter') {
      processInput();
    }
  };

  const processInput = () => {
    if (scanInput.length === 0) return;
    let isScanner = false;
    if (keyTimes.length > 1) {
      let totalDiff = 0;
      for (let i = 1; i < keyTimes.length; i++) {
        totalDiff += keyTimes[i] - keyTimes[i-1];
      }
      const avgSpeed = totalDiff / (keyTimes.length - 1);
      // If average time between keystrokes is very low (< 60ms), it's likely a scanner
      if (avgSpeed < 70) isScanner = true;
    }
    setLastScan({
      code: scanInput,
      mode: isScanner ? 'SCANNER' : 'MANUAL'
    });
    setScanInput('');
    setKeyTimes([]);
    // Keep focus on the input
    if (inputRef.current) {
        inputRef.current.focus();
    }
  };

  const handleProvisioningFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          processProvisioningFile(e.target.files[0]);
      }
  };

  const processProvisioningFile = (file: File) => {
      setIsImporting(true);
      setImportSuccess(false);
      
      // Simulate parsing delay
      setTimeout(() => {
          // Mock generation of students based on file
          const newStudents: Student[] = [];
          const count = Math.floor(Math.random() * 15) + 5; // 5-20 random students
          
          for (let i = 0; i < count; i++) {
              const id = Math.floor(Math.random() * 90000) + 10000;
              newStudents.push({
                  id: `S-${id}`,
                  name: `Student Imported ${i + 1}`,
                  grade: Math.floor(Math.random() * 12) + 1,
                  school: 'Tucson High Magnet',
                  rfidTag: `RF-${Math.floor(Math.random() * 9999)}`,
                  status: StudentStatus.OFF_BUS,
                  assignedBusId: 'R-101',
                  photoUrl: undefined
              });
          }

          if (onImportStudents) {
              onImportStudents(newStudents);
          }

          setIsImporting(false);
          setImportedCount(count);
          setImportSuccess(true);
      }, 1500);
  };

  const handleDownloadTemplate = () => {
      const headers = "StudentID,FirstName,LastName,Grade,School,RFID_UID";
      const rows = [
          "S-1009,Jane,Doe,10,Tucson High,RF-8821",
          "S-1010,John,Smith,11,Palo Verde,RF-9921"
      ];
      const csvContent = [headers, ...rows].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "rfid_provisioning_template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Cable className="text-blue-600" /> Hardware & Setup Guide
        </h2>
        <p className="text-slate-500 mt-1">
          Configure reading devices, test scanner integration, and manage system architecture.
        </p>

        <div className="flex gap-2 mt-6 border-b border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'devices' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Device Compatibility
          </button>
          <button
             onClick={() => setActiveTab('simulator')}
             className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'simulator' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Scanner Simulator
          </button>
          <button
             onClick={() => setActiveTab('provision')}
             className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'provision' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Bulk Provisioning
          </button>
          <button
             onClick={() => setActiveTab('district')}
             className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'district' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            District Settings
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Tab: Device Compatibility */}
        {activeTab === 'devices' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RECOMMENDED_HARDWARE.map((dev) => (
              <div key={dev.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    dev.category === 'tablet' ? 'bg-purple-100 text-purple-600' :
                    dev.category === 'scanner' ? 'bg-blue-100 text-blue-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {dev.category === 'tablet' && <Tablet size={24} />}
                    {dev.category === 'scanner' && <Scan size={24} />}
                    {dev.category === 'connector' && <Cable size={24} />}
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {dev.priceRange}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{dev.name}</h3>
                <p className="text-sm text-slate-600 mb-4 min-h-[40px]">{dev.description}</p>
                
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Compatible: {dev.compatibility}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Scanner Simulator */}
        {activeTab === 'simulator' && (
          <div className="max-w-2xl mx-auto space-y-6">
             <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
                <h3 className="font-bold text-slate-800 mb-2">Kiosk Input Test</h3>
                <p className="text-slate-500 text-sm mb-6">
                    Click inside the box below and scan a card (or type rapidly) to test the detection logic.
                </p>

                <div 
                    className="relative max-w-md mx-auto mb-8 group"
                    onClick={() => inputRef.current?.focus()}
                >
                    <div className={`absolute inset-0 rounded-xl transition-all opacity-20 group-hover:opacity-30 pointer-events-none ${lastScan ? (lastScan.mode === 'SCANNER' ? 'bg-green-500' : 'bg-orange-500') : 'bg-blue-500'}`}></div>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Waiting for input..."
                        className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-center font-mono tracking-widest uppercase relative z-10 bg-transparent"
                        autoFocus
                    />
                    <Scan className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-20" size={24} />
                </div>

                {lastScan && (
                    <div className={`p-4 rounded-lg border animate-in zoom-in duration-300 ${
                        lastScan.mode === 'SCANNER' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                        <div className="flex flex-col items-center gap-2">
                            {lastScan.mode === 'SCANNER' ? (
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-1">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-1">
                                    <Keyboard size={24} />
                                </div>
                            )}
                            <h4 className={`font-bold text-lg ${
                                lastScan.mode === 'SCANNER' ? 'text-green-700' : 'text-orange-700'
                            }`}>
                                {lastScan.mode === 'SCANNER' ? 'Scanner Hardware Detected' : 'Manual Entry Detected'}
                            </h4>
                            <p className="font-mono text-slate-800 bg-white/50 px-3 py-1 rounded border border-slate-200/50">
                                ID: {lastScan.code}
                            </p>
                        </div>
                    </div>
                )}
             </div>
          </div>
        )}

        {/* Tab: Provisioning */}
        {activeTab === 'provision' && (
             <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Bulk Import RFID Associations</h3>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto">
                        Upload a CSV file to link Student IDs to RFID Card UIDs in bulk. This will instantly update the real-time database.
                    </p>
                </div>

                {!importSuccess ? (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <button 
                                onClick={handleDownloadTemplate}
                                className="text-blue-600 text-sm font-bold flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                            >
                                <Download size={16} /> Download CSV Template
                            </button>
                        </div>

                        <div 
                            onClick={() => provisioningFileRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    processProvisioningFile(e.dataTransfer.files[0]);
                                }
                            }}
                            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                                isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                            }`}
                        >
                            <input 
                                type="file" 
                                ref={provisioningFileRef}
                                onChange={handleProvisioningFileChange}
                                className="hidden"
                                accept=".csv"
                            />
                            {isImporting ? (
                                <div className="flex flex-col items-center animate-pulse">
                                    <FileText size={40} className="text-blue-500 mb-3" />
                                    <p className="font-bold text-slate-800">Processing Data...</p>
                                    <p className="text-xs text-slate-400">Syncing with backend...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center group">
                                    <Upload size={32} className="text-slate-400 group-hover:text-blue-600 mb-3 transition-colors" />
                                    <p className="font-bold text-slate-700">Click to Browse or Drag CSV</p>
                                    <p className="text-xs text-slate-400 mt-1">Supports .csv (Max 5MB)</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex gap-3 text-left">
                            <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-xs text-orange-800">
                                <strong>System Note:</strong> Duplicate Student IDs will be overwritten. Invalid RFID tags will be rejected.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 animate-in zoom-in">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Import Successful</h3>
                        <p className="text-slate-500 mt-1">
                            Successfully provisioned <strong>{importedCount}</strong> students with new RFID credentials.
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                            <button 
                                onClick={() => setImportSuccess(false)}
                                className="text-slate-500 font-medium text-sm hover:text-slate-800"
                            >
                                Upload Another
                            </button>
                             <button 
                                onClick={() => setActiveTab('devices')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
             </div>
        )}

        {/* Tab: District Settings */}
        {activeTab === 'district' && (
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Configuration Form */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                                <Settings size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">District Configuration</h3>
                                <p className="text-slate-500 text-sm">Customize the Parent App experience.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">School District Name</label>
                                <input 
                                    type="text"
                                    value={districtName}
                                    onChange={(e) => setDistrictName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Brand Color</label>
                                <div className="flex gap-3">
                                    {['#2563eb', '#ea580c', '#16a34a', '#9333ea', '#dc2626'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setBrandColor(color)}
                                            className={`w-10 h-10 rounded-full transition-all ${brandColor === color ? 'ring-4 ring-offset-2 ring-slate-300 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <input 
                                        type="text"
                                        value={brandColor}
                                        onChange={(e) => setBrandColor(e.target.value)}
                                        className="w-24 px-2 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">District Logo</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-purple-300 transition-colors cursor-pointer relative overflow-hidden"
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                    />
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="h-20 object-contain" />
                                    ) : (
                                        <>
                                            <ImageIcon size={32} className="mb-2 text-slate-400" />
                                            <span className="text-xs font-medium">Click to upload PNG or SVG</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Preview Simulator */}
                    <div className="flex flex-col items-center">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-purple-600" /> Live App Preview
                        </h4>
                         <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[540px] w-[280px] shadow-xl">
                            <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                            <div className={`rounded-[2rem] overflow-hidden w-full h-full bg-slate-50 flex flex-col transition-colors duration-500`}>
                                {/* Dynamic Header */}
                                <div 
                                    className="p-4 pt-10 text-white transition-colors duration-300"
                                    style={{ backgroundColor: brandColor }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-sm truncate pr-2">{districtName}</span>
                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-mono">LC</div>
                                    </div>
                                    <p className="text-[10px] opacity-80 mt-1 uppercase tracking-wider font-medium">Official App</p>
                                </div>
                                
                                {/* Dynamic Content */}
                                <div className="flex-1 p-4 space-y-3 bg-slate-50">
                                    {logoPreview && (
                                        <div className="flex justify-center mb-2">
                                            <img src={logoPreview} className="h-8 object-contain" />
                                        </div>
                                    )}
                                    <div className="bg-white p-3 rounded-xl shadow-sm">
                                        <p className="text-xs text-slate-400 mb-1">Next Stop</p>
                                        <p className="font-bold text-slate-800">Home (Stop #4)</p>
                                    </div>
                                    <div 
                                        className="p-3 rounded-xl shadow-sm border-l-4 bg-white"
                                        style={{ borderLeftColor: brandColor }}
                                    >
                                        <p className="text-xs font-bold uppercase mb-1" style={{ color: brandColor }}>Status</p>
                                        <p className="text-sm text-slate-800">Bus En Route</p>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default HardwareSetup;
