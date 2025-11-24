
import { INITIAL_ROUTES, INITIAL_STUDENTS, INITIAL_LOGS, INITIAL_TICKETS, INITIAL_BUDGET_DATA, RECOMMENDED_HARDWARE, MOCK_TENANTS, MOCK_INVOICES, MOCK_POS, MOCK_QUOTES, INITIAL_PRICING_CONFIG } from '../constants';

// Using RAW STRING for constants to avoid any JSON.stringify issues with Enums during export
const CONSTANTS_FILE_CONTENT = `import { BusRoute, BusStatus, Student, StudentStatus, LogEntry, Tenant, Invoice, QuoteRequest, PurchaseOrder, DeviceGuide, PricingConfig, BudgetEntry, MaintenanceTicket } from "./types";

export const INITIAL_ROUTES: BusRoute[] = [
  {
    id: 'R-101',
    name: 'Sabino Canyon Express',
    driver: 'Maria Rodriguez',
    busNumber: 'B-42',
    status: BusStatus.ON_ROUTE,
    capacity: 60,
    occupancy: 45,
    nextStop: 'Sunrise & Kolb',
    estimatedArrival: '07:45',
    coordinates: { x: 20, y: 30 },
    vehicleType: 'Standard Bus',
    type: 'STANDARD'
  },
  {
    id: 'R-104',
    name: 'Downtown Connector',
    driver: 'James Smith',
    busNumber: 'B-18',
    status: BusStatus.DELAYED,
    capacity: 60,
    occupancy: 58,
    nextStop: 'Tucson High Magnet',
    estimatedArrival: '07:55',
    coordinates: { x: 55, y: 60 },
    alert: 'Heavy Traffic on Broadway',
    vehicleType: 'Electric Bus',
    type: 'STANDARD'
  },
  {
    id: 'R-202',
    name: 'Westside Loop',
    driver: 'David Chen',
    busNumber: 'B-09',
    status: BusStatus.ON_ROUTE,
    capacity: 48,
    occupancy: 12,
    nextStop: 'Pima College West',
    estimatedArrival: '07:30',
    coordinates: { x: 80, y: 20 },
    vehicleType: 'Standard Bus',
    type: 'STANDARD'
  },
  {
    id: 'R-305',
    name: 'Foothills Shuttle',
    driver: 'Sarah Johnson',
    busNumber: 'B-33',
    status: BusStatus.MAINTENANCE,
    capacity: 60,
    occupancy: 0,
    nextStop: 'Depot',
    estimatedArrival: '--:--',
    coordinates: { x: 10, y: 80 },
    vehicleType: 'Shuttle',
    type: 'STANDARD'
  },
  {
    id: 'E-501',
    name: 'Science Center Field Trip',
    driver: 'Robert Fox',
    busNumber: 'B-99',
    status: BusStatus.IDLE,
    capacity: 50,
    occupancy: 0,
    nextStop: 'Flandrau Science Center',
    estimatedArrival: '10:00',
    coordinates: { x: 40, y: 40 },
    vehicleType: 'Activity Bus',
    type: 'FIELD_TRIP',
    destination: 'Flandrau Science Center',
    eventDate: '2024-05-20'
  },
  {
    id: 'E-502',
    name: 'Varsity Football vs Mesa',
    driver: 'Coach Miller',
    busNumber: 'B-88',
    status: BusStatus.IDLE,
    capacity: 50,
    occupancy: 0,
    nextStop: 'Mesa High School',
    estimatedArrival: '16:30',
    coordinates: { x: 60, y: 60 },
    vehicleType: 'Activity Bus',
    type: 'ATHLETICS',
    destination: 'Mesa High School',
    eventDate: '2024-09-15'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 'S-1001', name: 'Leo Carter', grade: 5, school: 'Lineweaver Elementary', rfidTag: 'RF-9928', status: StudentStatus.ON_BUS, assignedBusId: 'R-101', photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop' },
  { id: 'S-1002', name: 'Mia Wallace', grade: 11, school: 'Tucson High', rfidTag: 'RF-1123', status: StudentStatus.OFF_BUS, assignedBusId: 'R-104', lastScanTime: '07:15', lastScanLocation: 'Stop #4' },
  { id: 'S-1003', name: 'Sam Bennett', grade: 3, school: 'Manzo Elementary', rfidTag: 'RF-4451', status: StudentStatus.ABSENT, assignedBusId: 'R-202' },
  { id: 'S-1004', name: 'Olivia Davis', grade: 8, school: 'Mansfeld Middle', rfidTag: 'RF-8821', status: StudentStatus.ON_BUS, assignedBusId: 'R-101' },
  { id: 'S-1005', name: 'Ethan Wright', grade: 12, school: 'Palo Verde High', rfidTag: 'RF-3321', status: StudentStatus.UNKNOWN, assignedBusId: 'R-104' },
];

export const INITIAL_LOGS: LogEntry[] = ${JSON.stringify(INITIAL_LOGS, null, 2)};
export const INITIAL_TICKETS: MaintenanceTicket[] = ${JSON.stringify(INITIAL_TICKETS, null, 2)};
export const RECOMMENDED_HARDWARE: DeviceGuide[] = ${JSON.stringify(RECOMMENDED_HARDWARE, null, 2)};
export const MOCK_TENANTS: Tenant[] = ${JSON.stringify(MOCK_TENANTS, null, 2)};
export const MOCK_INVOICES: Invoice[] = ${JSON.stringify(MOCK_INVOICES, null, 2)};
export const MOCK_QUOTES: QuoteRequest[] = ${JSON.stringify(MOCK_QUOTES, null, 2)};
export const MOCK_POS: PurchaseOrder[] = ${JSON.stringify(MOCK_POS, null, 2)};
export const INITIAL_PRICING_CONFIG: PricingConfig = ${JSON.stringify(INITIAL_PRICING_CONFIG, null, 2)};
export const INITIAL_BUDGET_DATA: BudgetEntry[] = ${JSON.stringify(INITIAL_BUDGET_DATA, null, 2)};
`;

export const getProjectFiles = () => {
    return {
        'vercel.json': `{
  "installCommand": "npm install --no-package-lock --force",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}`,
        'package.json': `{
  "name": "ridesmart-app",
  "private": true,
  "version": "31.0.0",
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
}`,
        'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#0f172a" />
    <title>TUSD RideSmart</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/index.tsx"></script>
  </body>
</html>`,
        'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
        'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,
        'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})`,
        'src/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6;
}
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}`,
        'src/types.ts': `// Exported Types
export enum BusStatus {
  ON_ROUTE = 'On Route',
  IDLE = 'Idle',
  DELAYED = 'Delayed',
  MAINTENANCE = 'Maintenance',
  COMPLETED = 'Completed'
}

export enum StudentStatus {
  ON_BUS = 'On Bus',
  OFF_BUS = 'Off Bus',
  ABSENT = 'Absent',
  UNKNOWN = 'Unknown'
}

export type SubscriptionTier = 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';

export type VehicleType = 'Standard Bus' | 'Activity Bus' | 'Shuttle' | 'Wheelchair Van' | 'Electric Bus';

export interface Student {
  id: string;
  name: string;
  grade: number;
  school: string;
  rfidTag: string;
  status: StudentStatus;
  lastScanTime?: string;
  lastScanLocation?: string;
  assignedBusId: string;
  photoUrl?: string;
}

export interface BusHealth {
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    batteryVoltage: number;
    tirePressure: number; // PSI
    oilLevel: number; // percentage
}

export interface BusRoute {
  id: string;
  name: string;
  driver: string;
  busNumber: string;
  status: BusStatus;
  capacity: number; // Maximum student capacity
  occupancy: number;
  nextStop: string;
  estimatedArrival: string; // HH:MM format
  coordinates: { x: number; y: number }; // For schematic map (0-100)
  alert?: string;
  vehicleType: VehicleType;
  health?: BusHealth;
  
  // Detailed Vehicle Info
  vin?: string;
  licensePlate?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;

  // Event fields
  type?: 'STANDARD' | 'FIELD_TRIP' | 'ATHLETICS';
  destination?: string;
  eventDate?: string;
}

export interface MaintenanceTicket {
  id: string;
  busId: string;
  busNumber: string;
  issue: string;
  reportedBy: string;
  reportedAt: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  progress: number;
  estimatedCompletion: string;
  notes: string[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'BOARDING' | 'DISEMBARKING' | 'ALERT' | 'SYSTEM' | 'WRONG_BUS' | 'MAINTENANCE';
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface AiInsight {
  title: string;
  description: string;
  type: 'optimization' | 'safety' | 'maintenance';
  confidence: number;
}

export interface OptimizationInsight {
  routeId: string;
  suggestion: string;
  impact: string;
  newPathDescription?: string;
}

export interface RouteOptimizationResponse {
  overview: string;
  insights: OptimizationInsight[];
  estimatedSavings: string;
}

export interface DeviceGuide {
  id: string;
  name: string;
  category: 'tablet' | 'scanner' | 'connector';
  description: string;
  priceRange: string;
  compatibility: string;
  imageUrl?: string;
}

export interface ParentNotification {
  id: string;
  topic: string;
  message: string;
  timestamp: string;
  read: boolean;
  aiGenerated: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  contactEmail: string;
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED';
  studentCount: number;
  busCount: number;
  joinedDate: string;
  logoUrl?: string;
  databaseSchema: string;
}

export interface QuoteRequest {
  id: string;
  districtName: string;
  contactName: string;
  contactRole: string;
  email: string;
  studentCount: number;
  busCount: number;
  legacyBusCount?: number;
  tier: SubscriptionTier;
  amount: number;
  hardwareCost?: number;
  status: 'PENDING' | 'REVIEWED' | 'APPROVED';
  submittedDate: string;
}

export interface PurchaseOrder {
  id: string;
  districtName: string;
  contactName: string;
  email: string;
  fileName: string;
  uploadDate: string;
  status: 'PROCESSING' | 'VERIFIED';
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  status: 'PAID' | 'OVERDUE' | 'SENT';
  dueDate: string;
}

export interface YearlyStats {
  totalMiles: number;
  safeTrips: number;
  onTimeRate: number;
  fuelSavedGal: number;
  topDriver: string;
  topDestination: string;
}
export interface PricingConfig {
    basePrice: number;
    perBusPrice: number;
}
export interface SystemSettings {
    mapProvider: 'SIMULATED' | 'GOOGLE_MAPS';
    googleMapsApiKey?: string;
    supabaseUrl?: string;
    supabaseKey?: string;
}

export type BudgetCategory = 
  | 'Fuel/Gas' 
  | 'Staff Salaries' 
  | 'Maintenance' 
  | 'Leases/Purchases' 
  | 'Insurance' 
  | 'Technology' 
  | 'Facilities';

export interface BudgetEntry {
  id: string;
  category: BudgetCategory;
  description: string;
  amount: number;
  date: string;
  fiscalYear: number;
}

export interface FinancialInsight {
  title: string;
  finding: string;
  recommendation: string;
  potentialSavings: number;
}

export type TelematicsProvider = 'GEOTAB' | 'SAMSARA' | 'ZONAR' | 'NATIVE';

export interface TelematicsConfig {
  provider: TelematicsProvider;
  apiKey?: string;
  refreshRateSeconds: number;
  isConnected: boolean;
}

export interface TelemetryData {
  busId: string;
  speed: number;
  rpm: number;
  fuelLevel: number;
  odometer: number;
  engineTemp: number;
  timestamp: string;
  faultCodes: string[];
}`,
        'src/constants.ts': CONSTANTS_FILE_CONTENT,
        'src/services/geminiService.ts': `import { GoogleGenAI, Type } from "@google/genai";
import { BusRoute, LogEntry, AiInsight, RouteOptimizationResponse, BudgetEntry, FinancialInsight, MaintenanceTicket } from "../types";

const apiKey = process.env.VITE_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeLogistics = async (routes: BusRoute[], logs: LogEntry[], tickets: MaintenanceTicket[] = []): Promise<AiInsight[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return [
      {
        title: "API Key Missing",
        description: "Please provide a valid API key to enable AI logistics analysis.",
        type: "system",
        confidence: 0
      }
    ] as any;
  }

  try {
    const modelId = 'gemini-2.5-flash';
    const prompt = \`
      You are an AI Logistics Analyst for the Tucson Unified School District (TUSD).
      Analyze the following current bus fleet status, recent event logs, and active maintenance tickets.
      Identify potential safety risks, efficiency optimizations, or maintenance needs.
      
      Current Fleet Status:
      \${JSON.stringify(routes.map(r => ({id: r.id, number: r.busNumber, status: r.status})), null, 2)}

      Active Maintenance Tickets:
      \${JSON.stringify(tickets, null, 2)}

      Recent Logs:
      \${JSON.stringify(logs.slice(0, 10), null, 2)}

      Provide 3 concise, actionable insights. If there are critical maintenance issues, prioritize those.
    \`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["optimization", "safety", "maintenance"] },
              confidence: { type: Type.NUMBER, description: "A number between 0 and 100" }
            },
            required: ["title", "description", "type", "confidence"]
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (error) {
    console.error("Error analyzing logistics:", error);
    return [];
  }
};

export const generateRouteOptimizations = async (routes: BusRoute[]): Promise<RouteOptimizationResponse> => {
  if (!apiKey) return { overview: "API Key Missing", insights: [], estimatedSavings: "$0" };

  try {
    const prompt = \`
      Act as a Senior Transportation Planner for TUSD. 
      Analyze the following bus routes and student occupancy data.
      Routes: \${JSON.stringify(routes, null, 2)}
      Propose optimizations to consolidate routes or avoid traffic.
    \`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  routeId: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  newPathDescription: { type: Type.STRING }
                },
                required: ["routeId", "suggestion", "impact"]
              }
            },
            estimatedSavings: { type: Type.STRING }
          },
          required: ["overview", "insights", "estimatedSavings"]
        }
      }
    });
    return response.text ? JSON.parse(response.text) : { overview: "No data", insights: [], estimatedSavings: "$0" };
  } catch (error) {
    return { overview: "Error", insights: [], estimatedSavings: "$0" };
  }
};

export const draftParentCommunication = async (topic: string, busId: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  try {
    const prompt = \`Draft a short SMS for parents about Bus \${busId}. Topic: \${topic}.\`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text || "Error generating draft.";
  } catch (e) { return "Error."; }
};

export const analyzeBudget = async (budgetEntries: BudgetEntry[]): Promise<FinancialInsight[]> => {
  if (!apiKey) return [];
  try {
    const prompt = \`Analyze budget for savings: \${JSON.stringify(budgetEntries)}\`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              finding: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              potentialSavings: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (e) { return []; }
};
`,
       'src/App.tsx': `import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Users, 
  Bell, 
  Settings, 
  Bus, 
  LogOut, 
  Search, 
  ChevronRight, 
  Pencil, 
  User, 
  GitMerge, 
  AlertTriangle, 
  Check, 
  Cable, 
  Upload, 
  X, 
  Shield, 
  Calendar, 
  Lock, 
  DollarSign, 
  Wrench, 
  Tag 
} from 'lucide-react';
import DashboardMetrics from './components/DashboardMetrics';
import SimulatedMap from './components/SimulatedMap';
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
import FinalDeploymentManager from './components/FinalDeploymentManager'; // Changed import
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MaintenanceModal from './components/MaintenanceModal';

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
                <div key={log.id} className={\`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-3 animate-in slide-in-from-left-2 duration-300 \${log.type === 'WRONG_BUS' ? 'bg-red-50' : ''}\`}>
                    <div className={\`mt-1 w-2 h-2 rounded-full shrink-0 \${
                        log.severity === 'warning' ? 'bg-orange-500' : 
                        log.severity === 'critical' ? 'bg-red-500' : 'bg-blue-500'
                    }\`} />
                    <div>
                        <p className={\`text-sm \${log.severity === 'critical' ? 'text-red-700 font-bold' : 'text-slate-800'}\`}>
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
  }, [systemSettings.supabaseUrl, systemSettings.supabaseKey]); // Added dependencies to ensure re-init on change

  // Tenants State
  const [tenants, setTenants] = useState(() => {
      // Mock logic for tenants persistence could go here
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
  
  // Search & Notification State
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState<{ students: Student[], routes: BusRoute[] }>({ students: [], routes: [] });

  // Mock State
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);

  // Refs for click-outside handling
  const searchRef = useRef<HTMLDivElement>(null);
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
  };

  const handleNewQuote = (newQuote: QuoteRequest) => {
      // 1. Update Super Admin State
      setAdminQuotes(prev => [newQuote, ...prev]);
      
      // 2. Simulate Email Notification to Matt Monjan
      console.log(\`
        [EMAIL SENT]
        To: matt.monjan@infusedu.com
        Subject: New Quote Request - \${newQuote.districtName}
        Body: A new quote for \${newQuote.amount.toLocaleString()} (Tier: \${newQuote.tier}) was generated for \${newQuote.contactName}.
        Check Dashboard.
      \`);
  };

  // Effects
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
        setSearchResults({ students: [], routes: [] });
        return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const matchedStudents = students.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) || 
        s.id.toLowerCase().includes(lowerQuery) ||
        s.school.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
    const matchedRoutes = routes.filter(r => 
        r.name.toLowerCase().includes(lowerQuery) ||
        r.busNumber.toLowerCase().includes(lowerQuery) ||
        r.driver.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
    setSearchResults({ students: matchedStudents, routes: matchedRoutes });
  }, [searchQuery, students, routes]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery(''); 
      }
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
        if (bus.status === 'Maintenance') return bus; // Don't move buses in maintenance

        let newCoords = bus.coordinates;
        if (bus.status === 'On Route' || bus.status === 'Delayed') {
            const dx = (Math.random() - 0.5) * 2;
            const dy = (Math.random() - 0.5) * 2;
            newCoords = {
                x: Math.max(5, Math.min(95, bus.coordinates.x + dx)),
                y: Math.max(5, Math.min(95, bus.coordinates.y + dy))
            };
        }
        let newAlert = bus.alert;
        let newStatus = bus.status;
        if (!newAlert && (bus.status === 'On Route') && Math.random() < 0.02) {
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
                logMessage = \`ALERT: \${student.name} attempted to board WRONG BUS (R-999). Driver Notified.\`;
            } else if (student.status === StudentStatus.ON_BUS) {
                newStatus = StudentStatus.OFF_BUS;
                newLocation = 'School Drop-off'; 
                logType = 'DISEMBARKING';
                logMessage = \`\${student.name} (\${student.id}) disembarked Bus \${student.assignedBusId} at \${newLocation}\`;
            } else {
                newStatus = StudentStatus.ON_BUS;
                newLocation = \`Stop #\${Math.floor(Math.random() * 10) + 1}\`; 
                logType = 'BOARDING';
                logMessage = \`\${student.name} (\${student.id}) boarded Bus \${student.assignedBusId} at \${newLocation}\`;
            }
            const newLog: LogEntry = { id: \`L-\${Date.now()}\`, timestamp: now, type: logType, message: logMessage, severity: severity };
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
      setLogs(prev => [{ id: \`L-\${Date.now()}\`, timestamp: new Date().toLocaleTimeString(), type: 'SYSTEM', message: \`Alert dismissed for bus \${busId}\`, severity: 'info' }, ...prev]);
  };

  const handleReportMechanicalIssue = (busId: string, busNumber: string) => {
      const newTicket: MaintenanceTicket = {
          id: \`M-\${Date.now()}\`,
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
      
      // Set Bus Status to Maintenance
      setRoutes(prev => prev.map(r => r.id === busId ? { ...r, status: BusStatus.MAINTENANCE, alert: undefined } : r));
      
      // Log it
      setLogs(prev => [{
          id: \`L-MAINT-\${Date.now()}\`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'MAINTENANCE',
          message: \`Bus \${busNumber} marked for maintenance. Ticket #\${newTicket.id} created.\`,
          severity: 'warning'
      }, ...prev]);
  };

  const handleUpdateTicket = (updatedTicket: MaintenanceTicket) => {
      setMaintenanceTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const handleResolveTicket = (ticketId: string, busId: string) => {
      // Set Bus back to IDLE (Ready for route)
      setRoutes(prev => prev.map(r => r.id === busId ? { ...r, status: BusStatus.IDLE } : r));
      
      // Log it
      setLogs(prev => [{
          id: \`L-RESOLVE-\${Date.now()}\`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'SYSTEM',
          message: \`Maintenance Ticket #\${ticketId} resolved. Bus returned to fleet.\`,
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
      // Mock Impersonation: Switch role to CLIENT and pretend we loaded their data
      setUserRole('CLIENT');
      setActiveTab('dashboard');
  };
  
  const handleUpdateSystemSettings = (newSettings: SystemSettings) => {
      setSystemSettings(newSettings);
      if (newSettings.supabaseUrl && newSettings.supabaseKey) {
          initSupabase(newSettings.supabaseUrl, newSettings.supabaseKey);
      }
  };

  const handleUpdateDriverStatus = (busId: string, status: BusStatus, alert?: string) => {
      setRoutes(prev => prev.map(r => {
          if (r.id === busId) {
              return { ...r, status, alert };
          }
          return r;
      }));
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
               {/* Allow Fleet Import in Maintenance Mode too */}
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
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800'}\`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('fleet')}
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'fleet' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}\`}
          >
            <MapIcon size={20} />
            <span className="font-medium">Fleet Map</span>
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'students' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}\`}
          >
            <Users size={20} />
            <span className="font-medium">Students</span>
          </button>
          
          {/* Feature: Special Events (Enterprise Only) */}
          {features.events ? (
            <button 
                onClick={() => setActiveTab('events')}
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'events' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}\`}
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

          {/* Feature: Optimizer (Enterprise Only) */}
          {features.optimizer ? (
            <button 
                onClick={() => setActiveTab('optimizer')}
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'optimizer' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-slate-800'}\`}
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
             
             {/* Feature: Maintenance (Professional+) */}
             {features.maintenance ? (
                <button 
                    onClick={() => setActiveTab('maintenance')}
                    className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'maintenance' ? 'bg-orange-600 text-white' : 'hover:bg-slate-800'}\`}
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

             {/* Feature: Budget (Enterprise Only) */}
             {features.budget ? (
                <button 
                    onClick={() => setActiveTab('budget')}
                    className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'budget' ? 'bg-green-600 text-white' : 'hover:bg-slate-800'}\`}
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

             {/* Feature: Hardware (Professional+) */}
             {features.hardware ? (
                <button 
                    onClick={() => setActiveTab('hardware')}
                    className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'hardware' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}\`}
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

            {/* Feature: Parent Portal (Professional+) */}
            {features.parentPortal ? (
                <button 
                    onClick={() => setActiveTab('parent')}
                    className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'parent' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}\`}
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

        {/* Subscription Badge */}
        <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Active Plan</p>
                <div className="flex items-center justify-between">
                    <span className={\`text-xs font-bold \${
                        tier === 'ENTERPRISE' ? 'text-purple-400' :
                        tier === 'PROFESSIONAL' ? 'text-blue-400' : 'text-yellow-400'
                    }\`}>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
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
                {/* Search Input */}
                <div className="relative hidden md:block" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search bus, student, or route..." 
                        className="pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full text-sm w-64 transition-all outline-none border"
                    />
                    {/* Search Results */}
                    {searchQuery.trim().length >= 2 && (
                         <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-2 z-50">
                            {searchResults.students.length === 0 && searchResults.routes.length === 0 ? (
                                <div className="p-4 text-center text-slate-500 text-sm">No matches found.</div>
                            ) : (
                                <div>
                                    {searchResults.students.length > 0 && (
                                        <div>
                                            <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">Students</div>
                                            {searchResults.students.map(s => (
                                                <div 
                                                    key={s.id}
                                                    onClick={() => {
                                                        setActiveTab('students');
                                                        setSelectedStudent(s);
                                                        setSearchQuery('');
                                                    }}
                                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center gap-3"
                                                >
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><User size={14}/></div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{s.name}</p>
                                                        <p className="text-xs text-slate-400">{s.school}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {searchResults.routes.length > 0 && (
                                        <div>
                                            <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">Routes</div>
                                            {searchResults.routes.map(r => (
                                                <div 
                                                    key={r.id}
                                                    onClick={() => {
                                                        setActiveTab('fleet');
                                                        setEditingRoute(r);
                                                        setSearchQuery('');
                                                    }}
                                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center gap-3"
                                                >
                                                    <div className="bg-orange-100 text-orange-600 p-2 rounded-full"><Bus size={14}/></div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{r.busNumber} - {r.name}</p>
                                                        <p className="text-xs text-slate-400">{r.driver}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                         </div>
                    )}
                </div>

                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={\`relative p-2 rounded-full transition-colors \${showNotifications ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-100'}\`}
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
                                            <div className={\`mt-1 shrink-0 \${log.severity === 'critical' ? 'text-red-500' : 'text-orange-500'}\`}>
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

        {/* Scrollable Content Area */}
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
                                    <SimulatedMap 
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
                    </>
                )}

                {/* ... rest of the tabs remain the same but just ensured they are correctly placed in the return */}
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
                                    <SimulatedMap 
                                        routes={routes} 
                                        onDismissAlert={handleDismissAlert} 
                                        onReportIssue={handleReportMechanicalIssue}
                                    />
                            </div>
                        </div>

                        {/* Fleet List Side Panel */}
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
                                    <div key={route.id} className={\`p-4 border rounded-xl transition-all group relative \${
                                        route.alert 
                                            ? 'border-red-200 bg-red-50 shadow-md' 
                                            : route.status === 'Maintenance'
                                                ? 'border-orange-200 bg-orange-50'
                                                : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-md'
                                    }\`}>
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
                                             <span className={\`px-2 py-1 rounded text-xs font-bold \${
                                                route.status === 'On Route' ? 'bg-green-100 text-green-700' :
                                                route.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                                                route.status === 'Maintenance' ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-100 text-slate-700'
                                            }\`}>
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
                                            <span className={\`px-2 py-0.5 rounded text-xs font-bold \${
                                                student.status === 'On Bus' ? 'bg-green-100 text-green-700' :
                                                student.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                                'bg-slate-100 text-slate-600'
                                            }\`}>
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
`
    };
};
