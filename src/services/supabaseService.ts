
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BusRoute, Student, MaintenanceTicket, BudgetEntry } from '../types';

let supabase: SupabaseClient | null = null;

export const initSupabase = (url: string, key: string) => {
    if (!url || !key) return null;
    try {
        supabase = createClient(url, key);
        console.log("Supabase client initialized");
        return supabase;
    } catch (e) {
        console.error("Supabase init failed", e);
        return null;
    }
};

export const getSupabase = () => supabase;

export const testConnection = async (url: string, key: string): Promise<{ success: boolean; message: string }> => {
     if (!url || !key) return { success: false, message: "Missing credentials" };
     if (!url.startsWith('http')) return { success: false, message: "Invalid URL format" };

     try {
         const client = createClient(url, key);
         
         // Try explicit auth check first
         const { data, error } = await client.auth.getSession();
         
         if (error) {
             console.warn("Auth check failed, trying table check fallback:", error.message);
         }
         
         // Check for districts table to confirm connectivity and schema
         const tableCheck = await client.from('districts').select('count', { count: 'exact', head: true });
         
         if (tableCheck.error) {
             if (tableCheck.error.code === '42P01') {
                return { success: true, message: "Connected! (Tables missing - Run Wizard)" };
             }
             // If specific table access fails but we are here, auth might be weird or RLS is blocking.
             // But if we got a code, we talked to the DB.
             return { success: false, message: `DB Error: ${tableCheck.error.message}` };
         }
         
         return { success: true, message: "Connection Verified & Active" };
     } catch (error: any) {
         console.error(error);
         return { success: false, message: `Network Error: ${error.message || 'Unknown'}` };
     }
};

// --- Data Seeding & Verification ---

export const verifyData = async (): Promise<{ students: number, buses: number, tickets: number, success: boolean }> => {
    if (!supabase) {
        console.error("Supabase client not initialized");
        return { students: 0, buses: 0, tickets: 0, success: false };
    }
    
    try {
        const { count: sCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
        const { count: bCount } = await supabase.from('buses').select('*', { count: 'exact', head: true });
        const { count: tCount } = await supabase.from('maintenance_tickets').select('*', { count: 'exact', head: true });
        
        return {
            students: sCount || 0,
            buses: bCount || 0,
            tickets: tCount || 0,
            success: true
        };
    } catch (e) {
        console.error("Verification failed", e);
        return { students: 0, buses: 0, tickets: 0, success: false };
    }
};

export const seedDatabase = async (
    distId: string, 
    routes: BusRoute[], 
    students: Student[], 
    tickets: MaintenanceTicket[]
): Promise<{ success: boolean, message: string }> => {
    console.log("Starting Seed Process...");
    
    if (!supabase) {
        console.error("Seed failed: Client not connected");
        return { success: false, message: "Supabase not connected. Save credentials first." };
    }

    try {
        // 1. Ensure District Exists
        console.log("Upserting District...");
        const { error: distError } = await supabase.from('districts').upsert({
            id: distId,
            name: 'Tucson Unified School District',
            contact_email: 'admin@tusd1.org',
            subscription_tier: 'ENTERPRISE'
        });
        if (distError) throw new Error(`District Error: ${distError.message}`);

        // 2. Clean up existing demo data to prevent duplicates/conflicts
        console.log("Cleaning old data...");
        await supabase.from('maintenance_tickets').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        await supabase.from('students').delete().eq('district_id', distId);
        await supabase.from('buses').delete().eq('district_id', distId);

        // 3. Upload Buses
        console.log(`Uploading ${routes.length} buses...`);
        const busData = routes.map(r => ({
            district_id: distId,
            bus_number: r.busNumber,
            driver_name: r.driver,
            status: r.status,
            capacity: r.capacity,
            vin: r.vin || null,
            license_plate: r.licensePlate || null
            // Removed metadata_temp_id to prevent schema errors
        }));

        const { data: insertedBuses, error: busError } = await supabase
            .from('buses')
            .insert(busData)
            .select();
        
        if (busError) throw new Error(`Bus Insert Error: ${busError.message}`);
        if (!insertedBuses) throw new Error("No buses returned after insert");

        // Create Map: Bus Number -> New UUID
        const busMap: Record<string, string> = {};
        insertedBuses.forEach((b: any) => {
            // Map the bus number back to the generated UUID
            // This allows us to link students to the correct bus in the DB
            if (b.bus_number) {
                // Find original route ID for this bus number
                const originalRoute = routes.find(r => r.busNumber === b.bus_number);
                if (originalRoute) {
                    busMap[originalRoute.id] = b.id;
                }
            }
        });

        // 4. Upload Students
        console.log(`Uploading ${students.length} students...`);
        const studentData = students.map(s => {
            const nameParts = s.name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';
            
            return {
                id: s.id,
                district_id: distId,
                first_name: firstName,
                last_name: lastName,
                grade: s.grade,
                school_name: s.school,
                rfid_tag: s.rfidTag,
                assigned_bus_id: busMap[s.assignedBusId] || null, // Link using the map we just built
                status: s.status,
                last_scan_location: s.lastScanLocation || null
            };
        });

        const { error: stuError } = await supabase.from('students').insert(studentData);
        if (stuError) throw new Error(`Student Insert Error: ${stuError.message}`);

        console.log("Seed Complete!");
        return { success: true, message: `Success! Synced ${routes.length} buses and ${students.length} students.` };

    } catch (error: any) {
        console.error("Seeding Exception:", error);
        return { success: false, message: `Sync Failed: ${error.message}` };
    }
};
