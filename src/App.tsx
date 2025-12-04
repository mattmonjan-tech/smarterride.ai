
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Map as MapIcon, Users, Bell, Settings, Bus, LogOut, Search, ChevronRight, Pencil, User, GitMerge, AlertTriangle, Check, Cable, Upload, X, Shield, Calendar, Lock, DollarSign, Wrench, Tag 
} from 'lucide-react';
import DashboardMetrics from './components/DashboardMetrics';
import SimulatedMap from './components/SimulatedMap';
import LiveMap from './components/LiveMap';
import LiveSearch from './components/LiveSearch';
import AiLogistics from './components/AiLogistics';
import StudentDetailsModal from './components/StudentDetailsModal';
import EditRouteModal from './components/EditRouteModal';
import RouteOptimizer from './components/RouteOptimizer';
import HardwareSetup from './components/HardwareSetup';
import FleetImportModal from './components/FleetImportModal';
import ParentPortal from './components/ParentPortal';
import LandingPage from './components/LandingPage';
import SpecialEvents from './components/SpecialEvents';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import BudgetPlanner from './components/BudgetPlanner';
import MaintenanceConsole from './components/MaintenanceConsole';
import TelematicsIntegration from './components/TelematicsIntegration';
import DriverApp from './components/DriverApp';
import RescueDeploy from './components/RescueDeploy';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MaintenanceModal from './components/MaintenanceModal';
import DriverScorecard from './components/DriverScorecard';

import { INITIAL_ROUTES, INITIAL_STUDENTS, INITIAL_LOGS, MOCK_QUOTES, INITIAL_BUDGET_DATA, INITIAL_TICKETS } from './constants';
import { BusRoute, Student, LogEntry, StudentStatus, BusStatus, SubscriptionTier, QuoteRequest, SystemSettings, MaintenanceTicket } from './types';
import { initSupabase } from './services/supabaseService';

// RfidLogList Component
const RfidLogList: React.FC<{ logs: LogEntry[] }> = ({ logs }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Live RFID Events</h3>
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Live Stream</span>
        </div>
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {logs.map((log) => (
                <div key={log.id} className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-3 animate-in slide-in-from-left-2 duration-300 ${log.type === 'WRONG_BUS' ? 'bg-red-50' : ''}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        log.severity === 'warning' ? 'bg-orange-500' : 
                        log.severity === 'critical' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div>
                        <p className={`text-sm ${log.severity === 'critical' ? 'text-red-700 font-bold' : 'text-slate-800'}`}>
                            {log.type === 'WRONG_BUS' && <span className="uppercase mr-1">[Safety Alert]</span>}
                            {log.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-mono">{log.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function App() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'CLIENT' | 'ADMIN' | 'DRIVER' | 'MAINTENANCE'>('CLIENT');
  const [tier, setTier] = useState<SubscriptionTier>('ENTERPRISE');
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);

  // Super Admin State (Lifted up with Persistence)
  const [adminQuotes, setAdminQuotes] = useState<QuoteRequest[]>(() => {
      const saved = localStorage.getItem('rideSmartQuotes');
      return saved ? JSON.parse(saved) : MOCK_QUOTES;
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
      const saved = localStorage.getItem('rideSmartSettings');
      return saved ? JSON.parse(saved) : { mapProvider: 'SIMULATED' };
  });

  // Initialize Supabase on load if settings exist, and whenever settings change
  useEffect(() => {
      if (systemSettings.supabaseUrl && systemSettings.supabaseKey) {
          initSupabase(systemSettings.supabaseUrl, systemSettings.supabaseKey);
      }
  }, [systemSettings.supabaseUrl, systemSettings.supabaseKey]); 

  // Tenants State
  const [tenants, setTenants] = useState(() => {
      return []; 
  });

  useEffect(() => {
      localStorage.setItem('rideSmartQuotes', JSON.stringify(adminQuotes));
  }, [adminQuotes]);

  useEffect(() => {
      localStorage.setItem('rideSmartSettings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet' | 'students' | 'optimizer' | 'hardware' | 'parent' | 'events' | 'budget' | 'maintenance'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingRoute, setEditingRoute] = useState<BusRoute | null>(null);
  const [showFleetImport, setShowFleetImport] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  
  // Notification State (Search moved to LiveSearch component)
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock State
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);

  // Refs for click-outside handling
  const notificationRef = useRef<HTMLDivElement>(null);

  // Feature Flags based on Provisioned Tier
  const features = {
    aiLogistics: tier === 'ENTERPRISE',
    optimizer: tier === 'ENTERPRISE',
    events: tier === 'ENTERPRISE',
    budget: tier === 'ENTERPRISE',
    parentPortal: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE',
    hardware: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE',
    maintenance: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE'
  };

  const handleLogin = (role: 'CLIENT' | 'ADMIN' | 'DRIVER' | 'MAINTENANCE', simulatedTier: SubscriptionTier = 'ENTERPRISE') => {
      setUserRole(role);
      setTier(simulatedTier);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      if (role !== 'ADMIN') {
          setActiveTenantId('TUSD-882'); 
      }
  };

  const handleNewQuote = (newQuote: QuoteRequest) => {
      setAdminQuotes(prev => [newQuote, ...prev]);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fleet Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRoutes(currentRoutes => currentRoutes.map(bus => {
        if (bus.status === BusStatus.MAINTENANCE) return bus; 

        let newCoords = bus.coordinates;
        if (bus.status === BusStatus.ON_ROUTE || bus.status === BusStatus.DELAYED) {
            const dx = (Math.random() - 0.5) * 2;
            const dy = (Math.random() - 0.5) * 2;
            newCoords = {
                x: Math.max(5, Math.min(95, bus.coordinates.x + dx)),
                y: Math.max(5, Math.min(95, bus.coordinates.y + dy))
            };
        }
        let newAlert = bus.alert;
        let newStatus = bus.status;
        if (!newAlert && (bus.status === BusStatus.ON_ROUTE) && Math.random() < 0.02) {
            const alerts = ["Traffic Jam on I-10", "Mechanical Issue: Engine Light", "Driver Report: Road Blocked", "Late Departure", "Minor Accident Nearby"];
            newAlert = alerts[Math.floor(Math.random() * alerts.length)];
            newStatus = BusStatus.DELAYED;
        }
        return { ...bus, coordinates: newCoords, alert: newAlert, status: newStatus };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Student RFID Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents(currentStudents => {
        const activeStudents = currentStudents.filter(s => s.status !== StudentStatus.ABSENT && s.status !== StudentStatus.UNKNOWN);
        if (activeStudents.length === 0) return currentStudents;
        const randomIndex = Math.floor(Math.random() * activeStudents.length);
        const targetStudentId = activeStudents[randomIndex].id;

        return currentStudents.map(student => {
            if (student.id !== targetStudentId) return student;
            const now = new Date().toLocaleTimeString('en-US', { hour12: false });
            let newStatus = student.status;
            let newLocation = student.lastScanLocation;
            let logMessage = '';
            let logType: 'BOARDING' | 'DISEMBARKING' | 'WRONG_BUS' = 'BOARDING';
            let severity: 'info' | 'critical' = 'info';
            const isWrongBusEvent = Math.random() < 0.05;

            if (isWrongBusEvent && student.status === StudentStatus.OFF_BUS) {
                logType = 'WRONG_BUS';
                severity = 'critical';
                logMessage = `ALERT: ${student.name} attempted to board WRONG BUS (R-999). Driver Notified.`;
            } else if (student.status === StudentStatus.ON_BUS) {
                newStatus = StudentStatus.OFF_BUS;
                newLocation = 'School Drop-off'; 
                logType = 'DISEMBARKING';
                logMessage = `${student.name} (${student.id}) disembarked Bus ${student.assignedBusId} at ${newLocation}`;
            } else {
                newStatus = StudentStatus.ON_BUS;
                newLocation = `Stop #${Math.floor(Math.random() * 10) + 1}`; 
                logType = 'BOARDING';
                logMessage = `${student.name} (${student.id}) boarded Bus ${student.assignedBusId} at ${newLocation}`;
            }
            const newLog: LogEntry = { id: `L-${Date.now()}`, timestamp: now, type: logType, message: logMessage, severity: severity };
            setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 50)); 
            if (logType === 'WRONG_BUS') return student;
            return { ...student, status: newStatus, lastScanTime: now, lastScanLocation: newLocation };
        });
      });
    }, 3500); 
    return () => clearInterval(interval);
  }, []);

  const handleSaveRoute = (updatedRoute: BusRoute) => {
    setRoutes(currentRoutes => currentRoutes.map(r => r.id === updatedRoute.id ? updatedRoute : r));
    setEditingRoute(null);
  };

  const handleDismissAlert = (busId: string) => {
      setRoutes(currentRoutes => currentRoutes.map(r => {
            if (r.id === busId) {
                return { ...r, alert: undefined, status: r.status === BusStatus.DELAYED ? BusStatus.ON_ROUTE : r.status };
            }
            return r;
        })
      );
      setLogs(prev => [{ id: `L-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), type: 'SYSTEM', message: `Alert dismissed for bus ${busId}`, severity: 'info' }, ...prev]);
  };

  const handleReportMechanicalIssue = (busId: string, busNumber: string) => {
      const newTicket: MaintenanceTicket = {
          id: `M-${Date.now()}`,
          busId,
          busNumber,
          issue: 'Driver Reported Mechanical Issue',
          reportedBy: 'Driver App (Simulated)',
          reportedAt: new Date().toLocaleString(),
          status: 'OPEN',
          priority: 'MEDIUM',
          progress: 0,
          estimatedCompletion: 'TBD',
          notes: []
      };
      setMaintenanceTickets(prev => [newTicket, ...prev]);
      setRoutes(prev => prev.map(r => r.id === busId ? { ...r, status: BusStatus.MAINTENANCE, alert: undefined } : r));
      setLogs(prev => [{
          id: `L-MAINT-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'MAINTENANCE',
          message: `Bus ${busNumber} marked for maintenance. Ticket #${newTicket.id} created.`,
          severity: 'warning'
      }, ...prev]);
  };

  const handleUpdateTicket = (updatedTicket: MaintenanceTicket) => {
      setMaintenanceTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const handleResolveTicket = (ticketId: string, busId: string) => {
      setRoutes(prev => prev.map(r => r.id === busId ? { ...r, status: BusStatus.IDLE } : r));
      setLogs(prev => [{
          id: `L-RESOLVE-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'SYSTEM',
          message: `Maintenance Ticket #${ticketId} resolved. Bus returned to fleet.`,
          severity: 'info'
      }, ...prev]);
  };

  const handleStudentUpdate = (updatedStudent: Student) => {
      setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      setSelectedStudent(updatedStudent); 
  };

  const handleStudentImport = (newStudents: Student[]) => {
    setStudents(prev => [...prev, ...newStudents]);
  };

  const handleFleetImport = (newRoutes: BusRoute[]) => {
      setRoutes(prev => [...prev, ...newRoutes]);
  };

  const handleAddEvent = (newRoute: BusRoute) => {
      setRoutes(prev => [...prev, newRoute]);
  };

  const handleImpersonate = (tenantId: string) => {
      setUserRole('CLIENT');
      setActiveTab('dashboard');
  };
  
  const handleUpdateSystemSettings = (newSettings: SystemSettings) => {
      setSystemSettings(newSettings);
      if (newSettings.supabaseUrl && newSettings.supabaseKey) {
          initSupabase(newSettings.supabaseUrl, newSettings.supabaseKey);
      }
  };

  const handleUpdateDriverStatus = (busId: string, status: BusStatus, alertMsg?: string) => {
      setRoutes(prev => prev.map(r => {
          if (r.id === busId) {
              return { ...r, status, alert: typeof alertMsg === 'string' ? alertMsg : undefined };
          }
          return r;
      }));

      const route = routes.find(r => r.id === busId);
      if (route) {
          const newLog: LogEntry = {
              id: `L-DRIVER-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              type: alertMsg ? 'ALERT' : 'SYSTEM',
              message: alertMsg ? `Bus ${route.busNumber} Alert: ${alertMsg}` : `Bus ${route.busNumber} status updated to ${status}`,
              severity: alertMsg ? (alertMsg.includes('EMERGENCY') ? 'critical' : 'warning') : 'info'
          };
          setLogs(prev => [newLog, ...prev].slice(0, 50)); 
      }
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} onQuoteRequest={handleNewQuote} />;
  }

  if (userRole === 'ADMIN') {
      return <SuperAdminDashboard onImpersonate={handleImpersonate} quotes={adminQuotes} systemSettings={systemSettings} onUpdateSettings={handleUpdateSystemSettings} />;
  }

  if (userRole === 'DRIVER') {
      return <DriverApp routes={routes} onUpdateStatus={handleUpdateDriverStatus} />;
  }

  if (userRole === 'MAINTENANCE') {
      return (
          <div className="h-screen bg-slate-50 flex flex-col">
               <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-orange-500 rounded-lg">
                             <Wrench size={24} />
                         </div>
                         <div>
                             <h1 className="text-xl font-bold">Shop Portal</h1>
                             <p className="text-xs text-slate-400">Mechanic Access • TUSD-882</p>
                         </div>
                    </div>
                    <button onClick={() => setIsLoggedIn(false)} className="p-2 hover:bg-slate-800 rounded-full">
                        <LogOut size={20} />
                    </button>
               </div>
               <div className="flex-1 p-6 overflow-y-auto">
                   <div className="max-w-6xl mx-auto h-full">
                       <MaintenanceConsole 
                            tickets={maintenanceTickets} 
                            routes={routes}
                            onUpdateTicket={handleUpdateTicket}
                            onResolveTicket={handleResolveTicket}
                            onCreateTicket={(t) => setMaintenanceTickets(prev => [t, ...prev])}
                            onImportFleet={() => setShowFleetImport(true)}
                        />
                   </div>
               </div>
               {showFleetImport && (
                  <FleetImportModal 
                    onImport={handleFleetImport}
                    onClose={() => setShowFleetImport(false)}
                  />
                )}
                {showMaintenanceModal && (
                    <MaintenanceModal 
                        isOpen={showMaintenanceModal}
                        onClose={() => setShowMaintenanceModal(false)}
                        onSubmit={(ticket) => setMaintenanceTickets(prev => [ticket, ...prev])}
                        routes={routes}
                    />
                )}
          </div>
      );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans animate-in fade-in duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-yellow-500 p-2 rounded-lg text-slate-900">
            <Bus size={24} />
          </div>
          <div>
            <h1 className="font-bold text-white leading-tight">TUSD<br/><span className="text-yellow-500 font-normal">RideSmart</span></h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('fleet')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'fleet' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <MapIcon size={20} />
            <span className="font-medium">Fleet Map</span>
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Users size={20} />
            <span className="font-medium">Students</span>
          </button>
          
          {/* Feature: Special Events (Enterprise Only) */}
          {features.events ? (
            <button 
                onClick={() => setActiveTab('events')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
            >
                <Calendar size={20} />
                <span className="font-medium">Special Events</span>
            </button>
          ) : (
            <div className="px-4 py-2 text-slate-600 flex items-center gap-3 opacity-50 cursor-not-allowed" title="Upgrade to The Best Bus Plan">
                <Calendar size={20} />
                <span className="font-medium">Special Events</span>
                <Lock size={12} className="ml-auto" />
            </div>
          )}

          {features.optimizer ? (
            <button 
                onClick={() => setActiveTab('optimizer')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'optimizer' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-slate-800'}`}
            >
                <GitMerge size={20} />
                <span className="font-medium">Route Optimizer</span>
            </button>
          ) : (
             <div className="px-4 py-2 text-slate-600 flex items-center gap-3 opacity-50 cursor-not-allowed" title="Upgrade to The Best Bus Plan">
                <GitMerge size={20} />
                <span className="font-medium">Optimizer</span>
                <Lock size={12} className="ml-auto" />
            </div>
          )}

          <div className="pt-4 mt-4 border-t border-slate-800">
             <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-4">Administration</p>
             
             {features.maintenance ? (
                <button 
                    onClick={() => setActiveTab('maintenance')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'maintenance' ? 'bg-orange-600 text-white' : 'hover:bg-slate-800'}`}
                >
                    <Wrench size={20} />
                    <span className="font-medium">Maintenance</span>
                </button>
             ) : (
                <div className="px-4 py-2 text-slate-600 flex items-center gap-3 opacity-50 cursor-not-allowed" title="Upgrade to The Better Bus Plan">
                    <Wrench size={20} />
                    <span className="font-medium">Maintenance</span>
                    <Lock size={12} className="ml-auto" />
                </div>
             )}

             {features.budget ? (
                <button 
                    onClick={() => setActiveTab('budget')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'budget' ? 'bg-green-600 text-white' : 'hover:bg-slate-800'}`}
                >
                    <DollarSign size={20} />
                    <span className="font-medium">Budget & Finance</span>
                </button>
             ) : (
                <div className="px-4 py-2 text-slate-600 flex items-center gap-3 opacity-50 cursor-not-allowed" title="Upgrade to The Best Bus Plan">
                    <DollarSign size={20} />
                    <span className="font-medium">Budget & Finance</span>
                    <Lock size={12} className="ml-auto" />
                </div>
             )}

             {features.hardware ? (
                <button 
                    onClick={() => setActiveTab('hardware')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'hardware' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
                >
                    <Cable size={20} />
                    <span className="font-medium">District Settings</span>
                </button>
             ) : (
                <div className="px-4 py-2 text-slate-600 flex items-center gap-3 opacity-50 cursor-not-allowed" title="Upgrade to The Better Bus Plan">
                    <Cable size={20} />
                    <span className="font-medium">District Settings</span>
                    <Lock size={12} className="ml-auto" />
                </div>
             )}

            {features.parentPortal ? (
                <button 
                    onClick={() => setActiveTab('parent')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'parent' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
                >
                    <Shield size={20} />
                    <span className="font-medium">Parent Portal</span>
                </button>
             ) : (
                <div className="px-4 py-2 text-slate-600 flex items-center gap-3 opacity-50 cursor-not-allowed" title="Upgrade to The Better Bus Plan">
                    <Shield size={20} />
                    <span className="font-medium">Parent Portal</span>
                    <Lock size={12} className="ml-auto" />
                </div>
             )}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Active Plan</p>
                <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${
                        tier === 'ENTERPRISE' ? 'text-purple-400' :
                        tier === 'PROFESSIONAL' ? 'text-blue-400' : 'text-yellow-400'
                    }`}>
                        {tier === 'ENTERPRISE' ? 'The Best Bus' :
                         tier === 'PROFESSIONAL' ? 'The Better Bus' : 'The Basic Bus'}
                    </span>
                    {tier !== 'ENTERPRISE' && (
                        <span className="text-[10px] underline cursor-pointer text-slate-400 hover:text-white">Upgrade</span>
                    )}
                </div>
            </div>
        </div>

        <div className="p-4 space-y-2">
           <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 text-sm">
            <Settings size={18} />
            <span>Settings</span>
          </button>
           <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 text-sm text-red-400 hover:text-red-300"
           >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm relative">
            <div>
                <h2 className="text-xl font-bold text-slate-800 capitalize flex items-center gap-2">
                    {activeTab === 'dashboard' ? 'Transportation Command Center' : 
                    activeTab === 'fleet' ? 'Fleet Operations' : 
                    activeTab === 'students' ? 'Student Ridership' : 
                    activeTab === 'events' ? 'Field Trips & Athletics' :
                    activeTab === 'hardware' ? 'System Configuration' : 
                    activeTab === 'parent' ? 'Guardian Services' : 
                    activeTab === 'maintenance' ? 'Fleet Maintenance Console' :
                    activeTab === 'budget' ? 'Budget & Finance' : 'Route Optimization Intelligence'}
                </h2>
                <p className="text-[10px] text-slate-400 font-mono">RFI Reference: 26-044-TUSD1</p>
            </div>
            
            <div className="flex items-center gap-4">
                {/* UPDATED LIVE SEARCH */}
                <LiveSearch 
                    students={students}
                    routes={routes}
                    onSelectStudent={(s) => {
                        setActiveTab('students');
                        setSelectedStudent(s);
                    }}
                    onSelectRoute={(r) => {
                        setActiveTab('fleet');
                        setEditingRoute(r);
                    }}
                />

                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <Bell size={20} />
                        {logs.filter(l => l.severity !== 'info').length > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                    </button>
                    
                    {showNotifications && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2">
                            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h4 className="font-bold text-sm text-slate-700">System Alerts</h4>
                                <button className="text-xs text-blue-600 font-medium hover:underline">Mark all read</button>
                            </div>
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {logs.filter(l => l.severity !== 'info').length === 0 ? (
                                    <div className="p-4 text-center text-slate-500 text-sm">No active alerts.</div>
                                ) : (
                                    logs.filter(l => l.severity !== 'info').map(log => (
                                        <div key={log.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3">
                                            <div className={`mt-1 shrink-0 ${log.severity === 'critical' ? 'text-red-500' : 'text-orange-500'}`}>
                                                <AlertTriangle size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">{log.timestamp}</p>
                                                <p className="text-sm font-medium text-slate-800">{log.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                             <div className="p-2 bg-slate-50 text-center">
                                <button onClick={() => setShowNotifications(false)} className="text-xs text-slate-500 hover:text-slate-800 font-medium">Close</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-800">TUSD Admin</p>
                        <p className="text-xs text-slate-500">Transport Director</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
                        TD
                    </div>
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-6 h-full">
                
                {activeTab === 'dashboard' && (
                    <>
                        <DashboardMetrics routes={routes} students={students} />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 h-[500px] bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <MapIcon size={18} className="text-blue-600"/> 
                                        Live Fleet Tracking
                                    </h3>
                                    <button 
                                        onClick={() => setShowMaintenanceModal(true)}
                                        className="text-xs font-bold text-slate-500 hover:text-slate-800"
                                    >
                                        Report Problem
                                    </button>
                                </div>
                                <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-100">
                                    {/* UPDATED LIVE MAP */}
                                    <LiveMap 
                                        routes={routes} 
                                        onDismissAlert={handleDismissAlert} 
                                        onReportIssue={handleReportMechanicalIssue}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                {/* Feature: AI Logistics (Enterprise Only) */}
                                {features.aiLogistics ? (
                                    <AiLogistics routes={routes} logs={logs} tickets={maintenanceTickets} />
                                ) : (
                                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center h-64 opacity-75">
                                        <div className="bg-slate-100 p-3 rounded-full mb-3">
                                            <Lock size={24} className="text-slate-400" />
                                        </div>
                                        <h3 className="font-bold text-slate-700 mb-2">AI Logistics Disabled</h3>
                                        <p className="text-sm text-slate-500 max-w-xs">
                                            Advanced AI analysis is available in <strong>The Best Bus</strong> plan.
                                        </p>
                                        <button className="mt-4 text-xs font-bold text-blue-600 hover:underline">Upgrade Plan</button>
                                    </div>
                                )}
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-slate-800 text-sm">Operational Efficiency</h3>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">+12% YTD</span>
                                    </div>
                                    <AnalyticsDashboard routes={routes} />
                                </div>
                                <RfidLogList logs={logs} />
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <DriverScorecard routes={routes} />
                        </div>
                    </>
                )}

                {activeTab === 'fleet' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Live System Map</h3>
                                 <div className="flex gap-2">
                                     <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded"><div className="w-2 h-2 bg-green-500 rounded-full"></div> On Time</span>
                                     <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Delayed</span>
                                     <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-orange-100 text-orange-700 rounded"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Maintenance</span>
                                 </div>
                            </div>
                            <div className="flex-1 min-h-[400px] p-4">
                                    {/* UPDATED LIVE MAP */}
                                    <LiveMap 
                                        routes={routes} 
                                        onDismissAlert={handleDismissAlert} 
                                        onReportIssue={handleReportMechanicalIssue}
                                    />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                             <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-800">Fleet Management</h3>
                                <button 
                                    onClick={() => setShowFleetImport(true)}
                                    className="text-xs bg-slate-800 text-white px-2 py-1.5 rounded hover:bg-slate-700 flex items-center gap-1 transition-colors"
                                >
                                    <Upload size={12} /> Import CSV
                                </button>
                            </div>
                            <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar flex-1">
                                {routes.map(route => (
                                    <div key={route.id} className={`p-4 border rounded-xl transition-all group relative ${
                                        route.alert 
                                            ? 'border-red-200 bg-red-50 shadow-md' 
                                            : route.status === 'Maintenance'
                                                ? 'border-orange-200 bg-orange-50'
                                                : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'
                                    }`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                    {route.busNumber}
                                                    {route.alert && (
                                                        <span className="relative flex h-3 w-3">
                                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                        </span>
                                                    )}
                                                </h4>
                                                <p className="text-xs text-slate-500">{route.name}</p>
                                                {route.vehicleType && (
                                                    <span className="text-[10px] text-slate-400 uppercase font-medium tracking-wide border border-slate-200 rounded px-1 py-0.5 mt-1 inline-block">
                                                        {route.vehicleType}
                                                    </span>
                                                )}
                                            </div>
                                             <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                route.status === 'On Route' ? 'bg-green-100 text-green-700' :
                                                route.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                                                route.status === 'Maintenance' ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                                {route.status}
                                            </span>
                                        </div>
                                        
                                        {route.alert && (
                                            <div className="mb-3 bg-white border border-red-100 rounded-lg p-3 shadow-sm animate-in slide-in-from-top-2">
                                                <div className="flex items-start gap-2">
                                                    <div className="text-red-500 mt-0.5 shrink-0">
                                                        <AlertTriangle size={16} /> 
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-red-700 font-bold uppercase mb-1">Active Alert</p>
                                                        <p className="text-sm text-slate-700 mb-2 leading-tight">{route.alert}</p>
                                                        <button 
                                                            onClick={() => handleDismissAlert(route.id)}
                                                            className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors flex items-center justify-center gap-1 shadow-sm"
                                                        >
                                                            <Check size={12} /> Acknowledge & Dismiss
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {route.status === 'Maintenance' && (
                                            <div className="mb-3 text-xs text-orange-700 bg-orange-100/50 p-2 rounded border border-orange-200">
                                                See Maintenance Console for repair details.
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User size={12} />
                                            </div>
                                            {route.driver}
                                        </div>

                                        <button 
                                            onClick={() => setEditingRoute(route)}
                                            className="w-full py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Pencil size={14} /> Edit Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Student Roster</h3>
                            <div className="flex gap-2">
                                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                                    {students.filter(s => s.status === 'On Bus').length} On Bus
                                </span>
                                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                    {students.length} Total
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {students.map(student => (
                                    <div 
                                        key={student.id}
                                        onClick={() => setSelectedStudent(student)}
                                        className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white group"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors overflow-hidden">
                                                {student.photoUrl ? (
                                                    <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{student.name}</h4>
                                                <p className="text-xs text-slate-500">{student.school}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Grade {student.grade}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                student.status === 'On Bus' ? 'bg-green-100 text-green-700' :
                                                student.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <SpecialEvents routes={routes} onAddEvent={handleAddEvent} />
                )}

                {activeTab === 'optimizer' && (
                    <RouteOptimizer routes={routes} />
                )}

                {activeTab === 'hardware' && (
                    <HardwareSetup onImportStudents={handleStudentImport} />
                )}

                {activeTab === 'parent' && (
                    <ParentPortal 
                        student={selectedStudent || students[0]} 
                        routes={routes} 
                    />
                )}

                {activeTab === 'budget' && (
                    <BudgetPlanner initialData={INITIAL_BUDGET_DATA} />
                )}

                {activeTab === 'maintenance' && (
                    <MaintenanceConsole 
                        tickets={maintenanceTickets} 
                        routes={routes} 
                        onUpdateTicket={handleUpdateTicket}
                        onResolveTicket={handleResolveTicket}
                        onCreateTicket={(t) => setMaintenanceTickets(prev => [t, ...prev])}
                        onImportFleet={() => setShowFleetImport(true)}
                    />
                )}
            </div>
        </div>
      </main>
      
      {/* Modals */}
      {selectedStudent && (
          <StudentDetailsModal 
            student={selectedStudent} 
            routes={routes}
            onClose={() => setSelectedStudent(null)} 
            onUpdate={handleStudentUpdate}
          />
      )}

      {editingRoute && (
          <EditRouteModal 
            route={editingRoute} 
            onSave={handleSaveRoute} 
            onClose={() => setEditingRoute(null)} 
          />
      )}

      {showFleetImport && (
          <FleetImportModal 
            onImport={handleFleetImport}
            onClose={() => setShowFleetImport(false)}
          />
      )}

      {showMaintenanceModal && (
          <MaintenanceModal 
            isOpen={showMaintenanceModal}
            onClose={() => setShowMaintenanceModal(false)}
            onSubmit={(ticket) => setMaintenanceTickets(prev => [ticket, ...prev])}
            routes={routes}
          />
      )}

    </div>
  );
}
`;

    return files;
};--- START OF FILE vite.config.ts ---


import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Vital: This replaces process.env.API_KEY in your code with the actual string during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': {} // Polyfill to prevent "process is not defined" crash
    },
    resolve: {
      alias: {
        // Correctly resolve '@' to the project root 'src' folder
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})--- START OF FILE package.json ---

{
  "name": "ridesmart-app",
  "private": true,
  "version": "52.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "*",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.3",
    "file-saver": "^2.0.5",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "@types/file-saver": "^2.0.7",
    "@types/node": "^20.10.0"
  }
}--- START OF FILE src/components/LandingPage.tsx ---


import React, { useState, useEffect } from 'react';
import { Bus, CheckCircle2, ArrowRight, Upload, X, FileText, Tablet, Scan, Cable, Check, Zap, Navigation, Printer, Mail, Map, Brain, DollarSign, Wrench, Lock, LayoutDashboard, User, AlertCircle } from 'lucide-react';
import { RECOMMENDED_HARDWARE } from '../constants';
import { SubscriptionTier, QuoteRequest } from '../types';

interface LandingPageProps {
  onLogin: (role: 'CLIENT' | 'ADMIN' | 'DRIVER' | 'MAINTENANCE', tier?: SubscriptionTier) => void;
  onQuoteRequest?: (quote: QuoteRequest) => void;
}

// Interactive Demo Component
const InteractiveHeroDemo = () => {
  const [progress, setProgress] = useState(65);
  const [eta, setEta] = useState(5);
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
        setProgress(p => {
            if (p >= 100) return 0;
            return p + 0.2;
        });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const alertTimer = setInterval(() => {
        setShowAlert(prev => !prev);
    }, 5000);
    return () => clearInterval(alertTimer);
  }, []);
  
  useEffect(() => {
      setEta(Math.max(1, Math.ceil(8 * (1 - progress/100))));
  }, [progress]);

  return (
    <div className="relative h-[450px] lg:h-[600px] w-full flex items-center justify-center">
       <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M10,10 Q40,40 60,10 T90,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-600" />
               <path d="M10,80 Q40,50 60,80 T90,40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-600" />
               <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" className="text-slate-400" />
           </svg>
       </div>

       <div className="relative z-20 w-72 md:w-80 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-5 transform transition-all hover:scale-105 duration-500 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                        <Bus size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 leading-tight">Bus #42</p>
                        <p className="text-xs text-slate-500 font-medium">Route 101 • AM Run</p>
                    </div>
                </div>
                <div className="animate-pulse">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-green-100"></span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wide">
                    <span>Route Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Navigation size={16} className="text-blue-500" />
                        <span className="font-medium">Next: Oak St</span>
                    </div>
                    <div className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        {eta} min away
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="text-center p-2 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Speed</p>
                    <p className="text-lg font-bold text-slate-700">42 <span className="text-xs font-normal text-slate-400">mph</span></p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Occupancy</p>
                    <p className="text-lg font-bold text-slate-700">48<span className="text-slate-400 text-sm">/60</span></p>
                </div>
            </div>
       </div>

       <div className={`absolute top-10 -left-2 md:left-0 w-64 bg-slate-800 text-white rounded-xl shadow-2xl p-4 z-30 transition-all duration-700 transform border border-slate-700 ${showAlert ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
            <div className="flex items-start gap-3">
                <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500 shrink-0">
                    <Zap size={18} />
                </div>
                <div>
                    <p className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">AI Optimization <span className="text-[9px] bg-amber-500 text-slate-900 px-1 rounded">NEW</span></p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Traffic detected on I-10. Rerouting via Skyline Dr saved 12 minutes.
                    </p>
                </div>
            </div>
       </div>

       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-3xl -z-10 opacity-60"></div>
    </div>
  );
};

const FEATURES = [
    {
        icon: Map,
        title: "Real-time GPS Fleet Tracking",
        desc: "Live location updates with 1-second latency. Visualize your entire district fleet on a single dashboard with traffic overlays."
    },
    {
        icon: Brain,
        title: "AI Route Optimization",
        desc: "Gemini-powered algorithms analyze traffic patterns and ridership data to suggest more efficient routes, saving fuel and time."
    },
    {
        icon: Shield,
        title: "RFID Student Ridership",
        desc: "Know exactly when and where students board and disembark. Automated notifications sent to parents for peace of mind."
    },
    {
        icon: Wrench,
        title: "Maintenance Console",
        desc: "Digital ticketing system for mechanics. Drivers can report issues from the app, and shop crews can track repair progress."
    },
    {
        icon: DollarSign,
        title: "Budget & Financial Intelligence",
        desc: "Track operational expenses and project ROI. Use our sandbox tools to simulate savings from electrification and efficiency."
    },
    {
        icon: Tablet,
        title: "Legacy Fleet Retrofit",
        desc: "Turn older buses into smart vehicles with our Driver Kiosk App and cost-effective hardware integration kits."
    }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onQuoteRequest }) => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showHardwareModal, setShowHardwareModal] = useState(false);
  const [simulatedTier, setSimulatedTier] = useState<SubscriptionTier>('ENTERPRISE');
  const [showToast, setShowToast] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Login Modal State
  const [loginTab, setLoginTab] = useState<'OFFICE' | 'DRIVER' | 'SHOP' | 'ADMIN'>('OFFICE');
  const [districtId, setDistrictId] = useState('');

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
      district: '',
      contact: '',
      role: '',
      email: '',
      students: '',
      buses: '',
      legacyBuses: '',
      tier: 'PROFESSIONAL' as SubscriptionTier
  });
  const [generatedQuote, setGeneratedQuote] = useState<QuoteRequest | null>(null);
  const [discountDetails, setDiscountDetails] = useState({ perBus: 0, totalDiscount: 0 });
  const [hardwareCost, setHardwareCost] = useState(0);

  // PO Form State
  const [poForm, setPoForm] = useState({
      district: '',
      contact: '',
      email: '',
      file: null as File | null
  });
  const [poSubmitted, setPoSubmitted] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Calculate Quote
      const busCount = parseInt(quoteForm.buses) || 0;
      const legacyCount = parseInt(quoteForm.legacyBuses) || 0;
      
      let basePrice = 0;
      let perBusPrice = 0;

      switch(quoteForm.tier) {
          case 'BASIC': basePrice = 3000; perBusPrice = 200; break;
          case 'PROFESSIONAL': basePrice = 5000; perBusPrice = 400; break;
          case 'ENTERPRISE': basePrice = 10000; perBusPrice = 600; break;
      }

      // Volume Discount Logic (Tiered Pricing)
      let discountPerBus = 0;
      if (busCount > 1000) discountPerBus = 5.00;
      else if (busCount > 750) discountPerBus = 4.00;
      else if (busCount > 500) discountPerBus = 3.50;
      else if (busCount > 250) discountPerBus = 3.00;
      else if (busCount > 100) discountPerBus = 2.50;

      const adjustedPerBusPrice = perBusPrice - discountPerBus;
      
      // Hardware Cost Calculation (15% Margin)
      // Base Cost assumed $150. Margin 15% -> 150 * 1.15 = 172.50
      const hardwareTotal = legacyCount * 172.50;
      
      const totalAnnual = basePrice + (busCount * adjustedPerBusPrice);
      
      // Quote Amount is usually the Annual Subscription + One-Time Hardware
      const grandTotal = totalAnnual + hardwareTotal;

      setDiscountDetails({
          perBus: discountPerBus,
          totalDiscount: busCount * discountPerBus
      });
      setHardwareCost(hardwareTotal);

      const newQuote: QuoteRequest = {
          id: `Q-${Date.now()}`,
          districtName: quoteForm.district,
          contactName: quoteForm.contact,
          contactRole: quoteForm.role,
          email: quoteForm.email,
          studentCount: parseInt(quoteForm.students) || 0,
          busCount: busCount,
          legacyBusCount: legacyCount,
          tier: quoteForm.tier,
          amount: grandTotal, // Total value of the deal
          hardwareCost: hardwareTotal,
          status: 'PENDING',
          submittedDate: new Date().toLocaleDateString()
      };
      
      setGeneratedQuote(newQuote);
      if (onQuoteRequest) {
          onQuoteRequest(newQuote);
      }

      // Show Notification Toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 8000);
  };

  const handleLoginSubmit = () => {
      if (loginTab === 'OFFICE') {
          // Simulate admin check (if district ID is 'admin' go to super admin)
          const cleanId = districtId.trim().toLowerCase();
          if (['admin', 'super', 'root', 'matt'].includes(cleanId)) {
              onLogin('ADMIN');
          } else {
              onLogin('CLIENT', simulatedTier);
          }
      } else if (loginTab === 'DRIVER') {
          onLogin('DRIVER');
      } else if (loginTab === 'SHOP') {
          onLogin('MAINTENANCE');
      } else if (loginTab === 'ADMIN') {
          onLogin('ADMIN');
      }
      setShowLoginModal(false);
  };

  // Robust Print Function
  const handlePrint = () => {
    const printContent = document.getElementById('quote-document');
    if (!printContent) return;

    // Open a new window to ensure clean print environment
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>RideSmart Quote #${generatedQuote?.id}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Poppins', sans-serif; padding: 40px; -webkit-print-color-adjust: exact; }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }
  };

  // Send Real Email via Mailto
  const handleMailto = () => {
      if (!generatedQuote) return;
      const subject = `RideSmart Quote #${generatedQuote.id} for ${generatedQuote.districtName}`;
      const body = `Hello ${generatedQuote.contactName},\n\nHere is the generated pricing estimate for ${generatedQuote.districtName}.\n\nPlan: ${generatedQuote.tier}\nFleet Size: ${generatedQuote.busCount}\nTotal Proposal Value: $${generatedQuote.amount.toLocaleString()}\n\nPlease review the details attached or visiting our portal.\n\nBest regards,\nRideSmart AI Team`;
      
      // Using window.open with _blank to prevent "refused to connect" errors within iframes/previews
      const mailtoUrl = `mailto:${quoteForm.email}?bcc=matt.monjan@infusedu.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl, '_blank');
  };

  const handlePOSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTimeout(() => {
          setPoSubmitted(true);
          console.log(`[System Notification] New PO Uploaded by ${poForm.district}. Notification sent to matt.monjan@infusedu.com`);
      }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setPoForm({...poForm, file: e.target.files[0]});
      }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 relative">
      {/* Notification Toast */}
      {showToast && (
          <div className="fixed top-24 right-6 z-[60] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-300 border border-slate-800 max-w-md">
            <div className="bg-green-500 rounded-full p-1.5 shadow-lg shadow-green-500/20">
              <Check size={18} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-white">Quote Generated Successfully</p>
              <p className="text-xs text-slate-400 mt-1">Ready to send to: {quoteForm.email}</p>
              <p className="text-xs text-slate-400 mt-0.5">BCC: matt.monjan@infusedu.com</p>
              <button 
                onClick={() => setShowEmailPreview(true)}
                className="text-[10px] font-bold text-blue-300 hover:text-blue-200 underline mt-2"
              >
                  View Internal Notification
              </button>
            </div>
            <button onClick={() => setShowToast(false)} className="ml-2 text-slate-500 hover:text-white self-start">
                <X size={16} />
            </button>
          </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Bus size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">RideSmart<span className="text-blue-600">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}>Features</a>
            <button onClick={() => setShowHardwareModal(true)} className="hover:text-blue-600 transition-colors">Hardware Guide</button>
            <a href="#pricing" className="hover:text-blue-600 transition-colors" onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}>Pricing</a>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowPOModal(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Upload size={16} /> Upload PO
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                Login
              </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-20 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-70"></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide animate-in fade-in slide-in-from-bottom-4">
              <Zap size={12} /> Now serving K-12 Districts Nationwide
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              The Intelligent Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Student Safety.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Replace paper manifests with AI-powered logistics. RideSmart provides real-time RFID tracking, automated parent notifications, and route optimization for modern school districts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setShowQuoteModal(true)} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                Request Pricing <ArrowRight size={18} />
              </button>
              <button onClick={() => setShowHardwareModal(true)} className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                View Hardware Guide
              </button>
            </div>
            <div className="pt-8 flex items-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> FERPA Compliant</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> SOC2 Certified</span>
            </div>
          </div>
          
          {/* Hero Graphic */}
          <div className="w-full">
             <InteractiveHeroDemo />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative z-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to run a smarter fleet.</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">
                      From the depot to the drop-off zone, RideSmart integrates every aspect of student transportation into one cohesive platform.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {FEATURES.map((feature, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:bg-white transition-all duration-300 group">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <feature.icon size={24} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                          <p className="text-slate-500 leading-relaxed">
                              {feature.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Competitive Education Pricing</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">
                      Transparent, flat-rate pricing designed for K-12 budgets. Compare against legacy providers like Samsara, Zonar, and Transfinder.
                  </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                  {/* The Basic Bus */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
                      <div className="mb-6">
                          <h3 className="text-xl font-bold text-slate-900">The Basic Bus</h3>
                          <p className="text-slate-500 text-sm mt-2">Essential GPS tracking & student safety.</p>
                      </div>
                      <div className="mb-6">
                          <p className="text-2xl font-bold text-slate-900">Contact for Pricing</p>
                          <p className="text-xs text-slate-400 mt-1">Tailored to your district size</p>
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> Live GPS Tracking</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> Real-time Ridership (RFID)</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-500" /> Speeding & Safety Alerts</li>
                      </ul>
                      <button onClick={() => setShowQuoteModal(true)} className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">Request Quote</button>
                  </div>

                   {/* The Better Bus */}
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
                      <div className="mb-6">
                          <h3 className="text-xl font-bold text-slate-900">The Better Bus</h3>
                          <p className="text-slate-500 text-sm mt-2">Full parent communication suite.</p>
                      </div>
                      <div className="mb-6">
                          <p className="text-2xl font-bold text-slate-900">Contact for Pricing</p>
                          <p className="text-xs text-slate-400 mt-1">Tailored to your district size</p>
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> <strong>Everything in Basic Bus</strong></li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> Parent Mobile App</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> Automated Delay Notifications</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> Tablet Kiosk Mode</li>
                          <li className="flex items-center gap-2 text-sm text-slate-700"><Check size={16} className="text-blue-600" /> Hardware Configuration</li>
                      </ul>
                      <button onClick={() => setShowQuoteModal(true)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Request Quote</button>
                  </div>

                  {/* The Best Bus */}
                  <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 flex flex-col text-white relative transform scale-105 z-10">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/30">
                          Best Value
                      </div>
                      <div className="mb-6">
                          <h3 className="text-xl font-bold text-white">The Best Bus</h3>
                          <p className="text-slate-400 text-sm mt-2">Total fleet automation & AI logistics.</p>
                      </div>
                      <div className="mb-6">
                          <p className="text-2xl font-bold text-white">Contact for Pricing</p>
                          <p className="text-xs text-slate-500 mt-1">Tailored to your district size</p>
                      </div>
                      <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> <strong>Everything in Better Bus</strong></li>
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> AI Route Optimization</li>
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> Special Events & Field Trips</li>
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> Logistics Analysis</li>
                          <li className="flex items-center gap-2 text-sm text-slate-300"><Check size={16} className="text-purple-500" /> Dedicated Success Manager</li>
                      </ul>
                      <button onClick={() => setShowQuoteModal(true)} className="w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20">Request Quote</button>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-600 p-1.5 rounded text-white">
                        <Bus size={20} />
                    </div>
                    <span className="text-lg font-bold">RideSmart.ai</span>
                </div>
                <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
                    Empowering school districts with next-generation logistics and safety tools.
                </p>
            </div>
            <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-white">Ridership Tracking</a></li>
                    <li><a href="#" className="hover:text-white">Fleet Management</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-white">About Us</a></li>
                    <li><button onClick={() => setShowLoginModal(true)} className="hover:text-white">Admin Portal</button></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            © 2024 RideSmart AI Technologies. All rights reserved.
        </div>
      </footer>

      {/* Email Simulation Modal */}
      {showEmailPreview && generatedQuote && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-300">
                  {/* Mock Email Window Header */}
                  <div className="bg-slate-100 border-b border-slate-300 p-3 flex items-center justify-between">
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Inbox — matt.monjan@infusedu.com</span>
                      <button onClick={() => setShowEmailPreview(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={16} />
                      </button>
                  </div>
                  
                  {/* Mock Email Body */}
                  <div className="p-8 bg-white">
                      <div className="border-b border-slate-100 pb-6 mb-6">
                          <h2 className="text-xl font-bold text-slate-900 mb-2">New Quote Request: {generatedQuote.districtName}</h2>
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">RS</div>
                              <div>
                                  <p className="text-sm font-bold text-slate-800">RideSmart Auto-Mailer (noreply@ridesmart.ai)</p>
                                  <p className="text-xs text-slate-400">To: {quoteForm.email}</p>
                                  <p className="text-xs text-slate-400">BCC: matt.monjan@infusedu.com</p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                          <p>Hello Matt & {quoteForm.contact},</p>
                          <p>A new pricing estimate has been generated for <strong>{quoteForm.district}</strong>.</p>
                          
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 my-4">
                              <p className="font-bold mb-2">Quote Summary</p>
                              <ul className="list-disc list-inside space-y-1 text-slate-600">
                                  <li><strong>Plan:</strong> {quoteForm.tier}</li>
                                  <li><strong>Students:</strong> {quoteForm.students}</li>
                                  <li><strong>Fleet Size:</strong> {quoteForm.buses} vehicles</li>
                                  <li><strong>Legacy Retrofits:</strong> {quoteForm.legacyBuses || 0} units</li>
                                  <li><strong>Total Value:</strong> ${generatedQuote.amount.toLocaleString()}</li>
                              </ul>
                          </div>

                          <p>The official quote PDF is attached to this email.</p>
                          <p>Best regards,<br/>The RideSmart Team</p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3">
                           <div className="h-12 w-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                               <FileText size={24} />
                           </div>
                           <div>
                               <p className="text-sm font-bold text-slate-800">Quote-{generatedQuote.id}.pdf</p>
                               <p className="text-xs text-slate-400">145 KB</p>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
                  <div className="bg-blue-600 p-4 flex justify-between items-center text-white shrink-0">
                      <h3 className="font-bold text-lg">Request Pricing Quote</h3>
                      <button onClick={() => setShowQuoteModal(false)}><X size={20} /></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                      {!generatedQuote ? (
                          <form onSubmit={handleQuoteSubmit} className="space-y-4">
                              {/* Contact Info */}
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">District Name</label>
                                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                    value={quoteForm.district} onChange={e => setQuoteForm({...quoteForm, district: e.target.value})} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Contact Name</label>
                                      <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                        value={quoteForm.contact} onChange={e => setQuoteForm({...quoteForm, contact: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                      <select required className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                                        value={quoteForm.role} onChange={e => setQuoteForm({...quoteForm, role: e.target.value})}>
                                            <option value="">Select...</option>
                                            <option value="Superintendent">Superintendent</option>
                                            <option value="Transportation Director">Transportation Director</option>
                                            <option value="IT Director">IT Director</option>
                                            <option value="Business Manager">Business Manager</option>
                                            <option value="Other">Other</option>
                                      </select>
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                  <input required type="email" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                    value={quoteForm.email} onChange={e => setQuoteForm({...quoteForm, email: e.target.value})} />
                              </div>

                              {/* Plan Selection */}
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Select Plan</label>
                                  <select required className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                                    value={quoteForm.tier} onChange={e => setQuoteForm({...quoteForm, tier: e.target.value as SubscriptionTier})}>
                                      <option value="BASIC">The Basic Bus</option>
                                      <option value="PROFESSIONAL">The Better Bus</option>
                                      <option value="ENTERPRISE">The Best Bus</option>
                                  </select>
                              </div>

                              {/* Metrics */}
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Total Students</label>
                                      <input required type="number" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                        value={quoteForm.students} onChange={e => setQuoteForm({...quoteForm, students: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Total Buses</label>
                                      <input required type="number" className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                        value={quoteForm.buses} onChange={e => setQuoteForm({...quoteForm, buses: e.target.value})} />
                                  </div>
                              </div>
                              
                              {/* Hardware Retrofit Question */}
                              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                  <label className="block text-sm font-bold text-slate-800 mb-1">Pre-2015 Buses (Legacy)</label>
                                  <p className="text-xs text-slate-500 mb-2">These vehicles require a hardware retrofit kit (USB/Dongle) for connectivity.</p>
                                  <div className="flex items-center gap-2">
                                      <Cable size={16} className="text-orange-600"/>
                                      <input 
                                        type="number" 
                                        placeholder="0"
                                        className="w-full border border-orange-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                                        value={quoteForm.legacyBuses} 
                                        onChange={e => setQuoteForm({...quoteForm, legacyBuses: e.target.value})} 
                                      />
                                  </div>
                              </div>

                              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg mt-2">
                                  Generate Instant Quote
                              </button>
                          </form>
                      ) : (
                          <div className="animate-in fade-in slide-in-from-bottom-4">
                              <div id="quote-document" className="bg-white p-8 border border-slate-200 shadow-sm mb-6 font-poppins text-slate-800">
                                  {/* Invoice Header */}
                                  <div className="flex justify-between items-start mb-8 border-b-2 border-slate-900 pb-6">
                                      <div>
                                          <div className="flex items-center gap-2 text-blue-600 mb-2">
                                              <Bus size={24} />
                                              <span className="text-xl font-bold text-slate-900">RideSmart.ai</span>
                                          </div>
                                          <p className="text-xs text-slate-500">123 Innovation Drive<br/>Tech Valley, CA 94043</p>
                                      </div>
                                      <div className="text-right">
                                          <h2 className="text-2xl font-bold text-slate-900">QUOTE</h2>
                                          <p className="text-sm text-slate-500">#{generatedQuote.id}</p>
                                          <p className="text-sm text-slate-500">Date: {generatedQuote.submittedDate}</p>
                                      </div>
                                  </div>

                                  {/* Client Info */}
                                  <div className="mb-8">
                                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Prepared For</p>
                                      <p className="font-bold text-lg">{generatedQuote.districtName}</p>
                                      <p className="text-sm">{generatedQuote.contactName}</p>
                                      <p className="text-sm text-slate-500">{generatedQuote.email}</p>
                                  </div>

                                  {/* Line Items */}
                                  <table className="w-full mb-8">
                                      <thead>
                                          <tr className="border-b border-slate-200 text-left text-xs font-bold text-slate-500 uppercase">
                                              <th className="py-2">Description</th>
                                              <th className="py-2 text-right">Qty</th>
                                              <th className="py-2 text-right">Total</th>
                                          </tr>
                                      </thead>
                                      <tbody className="text-sm">
                                          <tr className="border-b border-slate-100">
                                              <td className="py-4">
                                                  <p className="font-bold text-slate-900">{generatedQuote.tier === 'ENTERPRISE' ? 'The Best Bus' : generatedQuote.tier === 'PROFESSIONAL' ? 'The Better Bus' : 'The Basic Bus'} Subscription</p>
                                                  <p className="text-xs text-slate-500">Annual Platform License & Support</p>
                                              </td>
                                              <td className="py-4 text-right">1</td>
                                              <td className="py-4 text-right font-mono">
                                                  ${(generatedQuote.amount - hardwareCost).toLocaleString()}
                                              </td>
                                          </tr>
                                          
                                          {generatedQuote.legacyBusCount && generatedQuote.legacyBusCount > 0 && (
                                              <tr className="border-b border-slate-100">
                                                  <td className="py-4">
                                                      <p className="font-bold text-slate-900">RideSmart Retrofit Kit</p>
                                                      <p className="text-xs text-slate-500">Hardware for pre-2015 vehicles (USB/Dongle)</p>
                                                  </td>
                                                  <td className="py-4 text-right">{generatedQuote.legacyBusCount}</td>
                                                  <td className="py-4 text-right font-mono">
                                                      ${hardwareCost.toLocaleString()}
                                                  </td>
                                              </tr>
                                          )}

                                          {discountDetails.perBus > 0 && (
                                             <tr className="border-b border-slate-100 bg-green-50/50">
                                                <td className="py-4 pl-2">
                                                    <p className="font-bold text-green-700">Volume Discount Applied</p>
                                                    <p className="text-xs text-green-600">Tiered savings for fleet > 100 buses</p>
                                                </td>
                                                <td className="py-4 text-right"></td>
                                                <td className="py-4 text-right font-mono text-green-700">
                                                    -${discountDetails.totalDiscount.toLocaleString()}
                                                </td>
                                            </tr>
                                          )}
                                      </tbody>
                                  </table>

                                  {/* Total */}
                                  <div className="flex justify-end border-t-2 border-slate-900 pt-4">
                                      <div className="text-right">
                                          <p className="text-sm font-bold text-slate-500 uppercase">Total Estimate</p>
                                          <p className="text-3xl font-bold text-blue-600">${generatedQuote.amount.toLocaleString()}</p>
                                          <p className="text-xs text-slate-400 mt-1">Valid for 30 days</p>
                                      </div>
                                  </div>
                              </div>

                              <div className="flex gap-3 print:hidden">
                                  <button 
                                    onClick={handlePrint}
                                    className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                  >
                                      <Printer size={18} /> Print / Save PDF
                                  </button>
                                  <button 
                                    onClick={handleMailto}
                                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                  >
                                      <Mail size={18} /> Draft Email
                                  </button>
                              </div>
                              <button onClick={() => { setGeneratedQuote(null); setShowQuoteModal(false); }} className="w-full mt-3 text-slate-500 text-sm hover:underline">Close</button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* PO Upload Modal */}
      {showPOModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Upload size={18} /> Upload Purchase Order</h3>
                      <button onClick={() => setShowPOModal(false)}><X size={20} /></button>
                  </div>
                  <div className="p-6">
                      {!poSubmitted ? (
                          <form onSubmit={handlePOSubmit} className="space-y-4">
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">District</label>
                                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={poForm.district} onChange={e => setPoForm({...poForm, district: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Contact Person</label>
                                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={poForm.contact} onChange={e => setPoForm({...poForm, contact: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                  <input required type="email" className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={poForm.email} onChange={e => setPoForm({...poForm, email: e.target.value})} />
                              </div>
                              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                  <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                                  <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                                  <p className="text-sm font-bold text-slate-600">{poForm.file ? poForm.file.name : "Click to upload PDF"}</p>
                              </div>
                              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg">Submit PO</button>
                          </form>
                      ) : (
                          <div className="text-center py-8">
                              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Check size={32} />
                              </div>
                              <h3 className="text-xl font-bold text-slate-800">PO Uploaded!</h3>
                              <p className="text-slate-500 text-sm mt-2">Our team has been notified and will process your order shortly.</p>
                              <button onClick={() => { setPoSubmitted(false); setShowPOModal(false); }} className="mt-6 text-blue-600 font-bold text-sm hover:underline">Close</button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Login Modal - Multi Tab */}
      {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                  {/* Header */}
                  <div className="bg-slate-900 p-6 text-center relative">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/50">
                          <Bus size={32} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                      <p className="text-slate-400 text-sm">Sign in to your RideSmart account</p>
                      <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex border-b border-slate-200">
                      <button 
                        onClick={() => setLoginTab('OFFICE')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${loginTab === 'OFFICE' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                          Office
                      </button>
                      <button 
                        onClick={() => setLoginTab('DRIVER')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${loginTab === 'DRIVER' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                          Driver
                      </button>
                      <button 
                        onClick={() => setLoginTab('SHOP')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${loginTab === 'SHOP' ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                          Shop
                      </button>
                      <button 
                        onClick={() => setLoginTab('ADMIN')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${loginTab === 'ADMIN' ? 'border-red-600 text-red-600 bg-red-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                          Admin
                      </button>
                  </div>

                  {/* Body */}
                  <div className="p-8">
                      <div className="space-y-4">
                          {loginTab === 'OFFICE' && (
                              <>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">District ID / Tenant Code</label>
                                      <div className="relative">
                                          <LayoutDashboard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                          <input 
                                            type="text" 
                                            placeholder="e.g. TUSD-882 or 'admin'" 
                                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                            value={districtId}
                                            onChange={(e) => setDistrictId(e.target.value)}
                                          />
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-slate-700 mb-1">Simulation Plan</label>
                                      <select 
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 bg-white cursor-pointer"
                                        value={simulatedTier}
                                        onChange={(e) => setSimulatedTier(e.target.value as SubscriptionTier)}
                                      >
                                          <option value="BASIC">The Basic Bus (Core)</option>
                                          <option value="PROFESSIONAL">The Better Bus (Mid-Tier)</option>
                                          <option value="ENTERPRISE">The Best Bus (Full Suite)</option>
                                      </select>
                                      <p className="text-xs text-slate-500 mt-1">Selects which features are unlocked for the demo.</p>
                                  </div>
                              </>
                          )}

                          {loginTab === 'DRIVER' && (
                              <div className="text-center py-4">
                                  <p className="text-sm text-slate-600 mb-4">
                                      Launch the simplified Driver App interface designed for in-vehicle tablets.
                                  </p>
                                  <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 inline-block">
                                      <Tablet size={48} className="mx-auto text-slate-400 mb-2" />
                                      <p className="text-xs font-bold text-slate-500 uppercase">Kiosk Mode Ready</p>
                                  </div>
                              </div>
                          )}

                          {loginTab === 'SHOP' && (
                              <div className="text-center py-4">
                                  <p className="text-sm text-slate-600 mb-4">
                                      Access the Maintenance Console to view work orders and update vehicle status.
                                  </p>
                                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 inline-block mb-4">
                                      <Wrench size={48} className="mx-auto text-orange-500 mb-2" />
                                      <p className="text-xs font-bold text-orange-600 uppercase">Mechanic Portal</p>
                                  </div>
                                  <input 
                                    type="text" 
                                    placeholder="Enter Mechanic ID" 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-orange-500 text-center"
                                  />
                              </div>
                          )}

                          {loginTab === 'ADMIN' && (
                              <div className="text-center py-4">
                                  <div className="bg-red-50 p-4 rounded-lg border border-red-100 inline-block mb-4">
                                      <Shield size={48} className="mx-auto text-red-500 mb-2" />
                                      <p className="text-xs font-bold text-red-600 uppercase">Super Admin Console</p>
                                  </div>
                                  <input 
                                    type="password" 
                                    placeholder="Enter Master Key" 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 text-center mb-4"
                                  />
                                  <p className="text-xs text-slate-500 mb-4">Restricted access for RideSmart Controller only.</p>
                              </div>
                          )}

                          <button 
                            onClick={handleLoginSubmit}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transform transition-transform active:scale-95 ${
                                loginTab === 'SHOP' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20' : 
                                loginTab === 'ADMIN' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 
                                'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                            }`}
                          >
                              {loginTab === 'DRIVER' ? 'Launch Driver App' : 
                               loginTab === 'SHOP' ? 'Enter Shop Portal' : 
                               loginTab === 'ADMIN' ? 'Enter Controller Mode' : 
                               'Sign In to Dashboard'}
                          </button>

                           {/* Global Bypass Link (Always visible in footer) */}
                           <div className="text-center pt-4 border-t border-slate-100 mt-4">
                                <button 
                                    onClick={() => {
                                        onLogin('ADMIN');
                                        setShowLoginModal(false);
                                    }}
                                    className="text-xs text-slate-400 hover:text-blue-600 font-bold tracking-wide flex items-center justify-center gap-1 mx-auto transition-colors"
                                >
                                    <Lock size={10} /> Demo: Bypass Login (Super Admin)
                                </button>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Hardware Guide Modal (Simple Viewer) */}
      {showHardwareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                  <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                          <Tablet /> Recommended Hardware
                      </h2>
                      <button onClick={() => setShowHardwareModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      <div className="grid md:grid-cols-2 gap-8">
                          {RECOMMENDED_HARDWARE.map((item) => (
                              <div key={item.id} className="flex gap-4 p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                                      item.category === 'tablet' ? 'bg-purple-100 text-purple-600' : 
                                      item.category === 'scanner' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                  }`}>
                                      {item.category === 'tablet' ? <Tablet size={32} /> : item.category === 'scanner' ? <Scan size={32} /> : <Cable size={32} />}
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded mb-2">{item.priceRange}</span>
                                      <p className="text-slate-600 text-sm mb-3">{item.description}</p>
                                      <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                                          <CheckCircle2 size={14} /> Verified Compatible
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default LandingPage;
