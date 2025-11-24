import { GoogleGenAI, Type } from "@google/genai";
import { BusRoute, LogEntry, AiInsight, RouteOptimizationResponse, BudgetEntry, FinancialInsight, MaintenanceTicket } from "../types";

const apiKey = process.env.API_KEY || '';
// Using the new GoogleGenAI class as per guidelines
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
    ] as any; // Fallback
  }

  try {
    const modelId = 'gemini-2.5-flash';
    
    const prompt = `
      You are an AI Logistics Analyst for the Tucson Unified School District (TUSD).
      Analyze the following current bus fleet status, recent event logs, and active maintenance tickets.
      Identify potential safety risks, efficiency optimizations, or maintenance needs.
      
      Current Fleet Status:
      ${JSON.stringify(routes.map(r => ({id: r.id, number: r.busNumber, status: r.status})), null, 2)}

      Active Maintenance Tickets:
      ${JSON.stringify(tickets, null, 2)}

      Recent Logs:
      ${JSON.stringify(logs.slice(0, 10), null, 2)}

      Provide 3 concise, actionable insights. If there are critical maintenance issues, prioritize those.
    `;

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

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as AiInsight[];
  } catch (error) {
    console.error("Error analyzing logistics:", error);
    return [
      {
        title: "Analysis Failed",
        description: "Unable to generate insights at this time due to a connection error.",
        type: "maintenance",
        confidence: 0
      }
    ];
  }
};

export const generateRouteOptimizations = async (routes: BusRoute[]): Promise<RouteOptimizationResponse> => {
  if (!apiKey) {
    return {
      overview: "API Key Missing",
      insights: [],
      estimatedSavings: "$0"
    };
  }

  try {
    const prompt = `
      Act as a Senior Transportation Planner for TUSD. 
      Analyze the following bus routes and student occupancy data.
      Assume historical traffic data shows congestion on 'road-1' (Sabino Canyon) at 07:45 and light traffic on 'road-2'.
      
      Routes:
      ${JSON.stringify(routes, null, 2)}

      Propose specific optimizations to consolidate underutilized routes or reroute around traffic.
      Focus on reducing total mileage and fuel consumption while ensuring student safety.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING, description: "A high-level summary of the optimization strategy." },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  routeId: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  newPathDescription: { type: Type.STRING, description: "Short description of the new path visual." }
                },
                required: ["routeId", "suggestion", "impact"]
              }
            },
            estimatedSavings: { type: Type.STRING, description: "Projected monthly savings (e.g. '$12,000')" }
          },
          required: ["overview", "insights", "estimatedSavings"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as RouteOptimizationResponse;
  } catch (error) {
    console.error("Optimization Error:", error);
    return {
      overview: "Optimization Analysis Unavailable",
      insights: [],
      estimatedSavings: "N/A"
    };
  }
};

export const draftParentCommunication = async (topic: string, busId: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot generate draft.";

  try {
    const prompt = `
      You are the Communications Director for Tucson Unified School District (TUSD).
      Draft a short, reassuring SMS/Notification to a parent regarding their child's bus.
      
      Bus ID: ${busId}
      Situation: ${topic}

      Tone: Professional, Calm, Informative.
      Length: Under 200 characters suitable for SMS.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate draft.";
  } catch (error) {
    console.error("Error drafting message:", error);
    return "Unable to generate message at this time.";
  }
};

export const analyzeBudget = async (budgetEntries: BudgetEntry[]): Promise<FinancialInsight[]> => {
  if (!apiKey) return [];

  try {
    const prompt = `
      You are a CFO for a School District Transportation Department.
      Analyze the following budget ledger entries comparing Year over Year spend.
      Look for anomalies, inflation, or areas where route optimization technology could save money (e.g. fuel, maintenance).
      
      Budget Ledger:
      ${JSON.stringify(budgetEntries, null, 2)}

      Provide 3 specific financial insights with estimated savings calculations if efficiency measures were applied.
    `;

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
              potentialSavings: { type: Type.NUMBER, description: "Estimated savings in dollars" }
            },
            required: ["title", "finding", "recommendation", "potentialSavings"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as FinancialInsight[];

  } catch (error) {
    console.error("Budget Analysis Error:", error);
    return [];
  }
};
