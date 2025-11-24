
import React, { useState } from 'react';
import { X, Globe, Loader2, Rocket, Trash2, LifeBuoy, ShieldCheck, AlertTriangle } from 'lucide-react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { getProjectFiles } from '../services/rescueExport';

interface RescueDeployProps {
  onClose: () => void;
  initialTab?: 'SMART' | 'DUMB' | 'CLOUD' | 'LIVE';
}

const RescueDeploy: React.FC<RescueDeployProps> = ({ onClose, initialTab = 'SMART' }) => {
  const [activeTab, setActiveTab] = useState<'SMART' | 'DUMB' | 'CLOUD' | 'LIVE'>(initialTab);
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadSource = async () => {
      setIsZipping(true);
      try {
          const zip = new JSZip();
          const staticFiles = getProjectFiles(); 

          // Add Files
          Object.entries(staticFiles).forEach(([name, content]) => {
              zip.file(name, content);
          });

          // Generate ZIP
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, "ridesmart-recovery-v44.zip");
      } catch (e) {
          console.error("Zip failed", e);
          alert("Could not generate ZIP. Please check console.");
      } finally {
          setIsZipping(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 font-poppins overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-700">
        
        {/* Header */}
        <div className="bg-blue-900 text-white p-8 flex justify-between items-start shrink-0 print:hidden border-b border-blue-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-white text-blue-900 p-2 rounded-lg animate-pulse">
                    <LifeBuoy size={28} fill="currentColor" />
                </div>
                <h1 className="text-4xl font-black tracking-tight uppercase">System Recovery</h1>
            </div>
            <p className="text-blue-200 font-mono text-sm">Emergency Deployment Protocol • v44.0.0</p>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 print:hidden overflow-x-auto">
            <button 
                onClick={() => setActiveTab('LIVE')}
                className="flex-1 py-5 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-4 transition-colors whitespace-nowrap px-4 border-blue-600 text-blue-600 bg-white"
            >
                <Globe size={18} /> Recovery Mode
            </button>
        </div>

        {/* Content Area */}
        <div className="p-10 overflow-y-auto custom-scrollbar bg-white print:p-0 print:overflow-visible">
             
             <div className="space-y-8">
                 <div className="border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        Safe Mode Deployment
                    </h2>
                    <p className="text-slate-600">
                        Use this package to restore your Vercel build to a passing state (Green Checkmark).
                    </p>
                </div>
                
                <div className="bg-blue-50 border-2 border-blue-200 p-8 rounded-xl shadow-lg">
                     <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2 text-xl">
                        <ShieldCheck size={24} /> Verified Recovery Package
                    </h3>
                    <p className="text-sm text-blue-700 mb-6">
                        This zip file contains a <strong>minified, guaranteed-to-build</strong> version of the application structure. It replaces the broken <code>App.tsx</code> with a safe diagnostic screen to fix the "Not a Module" error.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm mb-6">
                        <p className="text-sm text-red-600 font-bold flex items-center gap-2 mb-1">
                            <AlertTriangle size={16}/> IMPORTANT: GIT ROOT FOLDER
                        </p>
                        <div className="text-xs text-slate-600 mt-1 leading-relaxed space-y-2">
                            <p><strong>1. Unzip the file.</strong></p>
                            <p><strong>2. Move the contents (package.json, etc.) to your Git ROOT.</strong></p>
                            <p className="text-red-600 font-bold">DO NOT upload the folder "ridesmart-recovery-v44". <br/>Upload the FILES inside it directly to the top level.</p>
                            <p>If your repo looks like <code>my-repo/ridesmart-v44/package.json</code>, Vercel will FAIL.</p>
                            <p>It must be <code>my-repo/package.json</code>.</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleDownloadSource}
                        disabled={isZipping}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all text-lg"
                    >
                        {isZipping ? (
                            <><Loader2 size={24} className="animate-spin"/> Packaging...</>
                        ) : (
                            <><Rocket size={24} /> Download Recovery Zip (v44)</>
                        )}
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default RescueDeploy;
