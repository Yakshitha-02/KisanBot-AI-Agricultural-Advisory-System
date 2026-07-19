/**
 * api.ts - Central API Service layer for KisanBot AI Agricultural Advisory System
 * 
 * Provides production-ready typed async fetch endpoints to connect the React frontend
 * to the FastAPI high-performance backend.
 */

import { Language, Message, KBItem, TelemetryLog, MandiPrice, Scheme } from "../types";

// 1. Configure the API base URL (Defaulting to teammate's local network / localhost FastAPI default)
export const API_BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:8000";

// Helper function to handle response verification cleanly
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson?.detail) {
        errorMessage = typeof errorJson.detail === "string" ? errorJson.detail : JSON.stringify(errorJson.detail);
      }
    } catch {
      // JSON parsing failed, proceed with generic message
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

// ==========================================
// 1. CHATBOT API (Prefix: /api/chatbot)
// ==========================================

export interface ChatbotQueryRequest {
  query: string;
  language: Language;
  history?: Message[];
}

export interface ChatbotQueryResponse {
  id: string;
  answer: string;
  intent: string;
  confidenceScore: number;
  flagged: boolean;
  sources: string[];
}

export interface FeedbackRequest {
  logId: string;
  feedback: "up" | "down" | null;
}

/**
 * Sends a user query to the AI Chatbot backend with language and conversation context.
 */
export async function queryChatbot(
  query: string, 
  language: Language, 
  history?: Message[]
): Promise<ChatbotQueryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chatbot/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      language,
      history: history?.map(m => ({ sender: m.sender, text: m.text })) // strip unnecessary client properties
    }),
  });
  return handleResponse<ChatbotQueryResponse>(response);
}

/**
 * Saves thumbs-up or thumbs-down user satisfaction rating.
 */
export async function saveChatbotFeedback(
  logId: string, 
  feedback: "up" | "down" | null
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/chatbot/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ logId, feedback }),
  });
  return handleResponse<{ success: boolean; message: string }>(response);
}


// ==========================================
// 2. WEATHER ADVISORY API (Prefix: /api/weather)
// ==========================================

export interface WeatherAdvisoryResponse {
  temperature: string;
  humidity: string;
  windSpeed: string;
  precipitationProbability: string;
  condition: string;
  sprayingVerdict: "Safe" | "Unsafe";
  sprayingAdvisory: string;
  irrigationAdvisory: string;
}

/**
 * Fetches region-specific meteorological data and agricultural recommendations.
 */
export async function fetchWeatherAdvisory(
  region: string, 
  language: Language = "en"
): Promise<WeatherAdvisoryResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/weather/advisory?region=${encodeURIComponent(region)}&lang=${language}`
  );
  return handleResponse<WeatherAdvisoryResponse[]>(response);
}


// ==========================================
// 3. MANDI MARKET RATES API (Prefix: /api/market)
// ==========================================

/**
 * Retrieves official AGMARKNET commodity pricing details and pricing history logs.
 */
export async function fetchMandiPrices(
  cropName?: string, 
  state?: string
): Promise<MandiPrice[]> {
  const params = new URLSearchParams();
  if (cropName) params.append("crop", cropName);
  if (state) params.append("state", state);

  const response = await fetch(`${API_BASE_URL}/api/market/prices?${params.toString()}`);
  return handleResponse<MandiPrice[]>(response);
}


// ==========================================
// 4. GOVERNMENT SCHEMES API (schemes_router)
// ==========================================

/**
 * Fetches available central and state government agricultural subsidies.
 */
export async function fetchGovernmentSchemes(
  language: Language = "en"
): Promise<Scheme[]> {
  // If schemes_router is mounted directly or with api prefix
  const response = await fetch(`${API_BASE_URL}/api/schemes?lang=${language}`);
  return handleResponse<Scheme[]>(response);
}


// ==========================================
// 5. FIELD VOICE ASSISTANT API (Prefix: /api/voice or /api)
// ==========================================

export interface VoiceProcessResponse {
  transcript: string;
  answer: string;
  audioUrl?: string; // URL path of synthesized voice output on FastAPI
  confidenceScore: number;
}

/**
 * Uploads a recorded voice memo stream (PCM / WAV / WebM) to the FastAPI speech pipeline.
 */
export async function processVoiceAdvisory(
  audioBlob: Blob, 
  language: Language
): Promise<VoiceProcessResponse> {
  const formData = new FormData();
  formData.append("file", audioBlob, "farmer_speech.wav");
  formData.append("language", language);

  const response = await fetch(`${API_BASE_URL}/api/voice/process`, {
    method: "POST",
    body: formData, // browser automatically computes boundaries
  });
  return handleResponse<VoiceProcessResponse>(response);
}


// ==========================================
// 6. ADMIN TELEMETRY PANEL API (Prefix: /api/admin)
// ==========================================

export interface AdminMetricsResponse {
  totalQueries: number;
  byLanguage: {
    en: number;
    hi: number;
    kn: number;
  };
  byIntent: {
    crop_advisory: number;
    weather: number;
    market_prices: number;
    scheme_lookup: number;
    pest_control: number;
  };
  satisfactionRate: string;
  flaggedIssues: number;
  unansweredCount: number;
}

/**
 * Gets high-level analytics for telemetry dashboard views.
 */
export async function fetchAdminMetrics(): Promise<AdminMetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/metrics`);
  return handleResponse<AdminMetricsResponse>(response);
}

/**
 * Lists all queries, RAG results, confidence indicators, and feedback flagged lists.
 */
export async function fetchTelemetryLogs(): Promise<TelemetryLog[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/logs`);
  return handleResponse<TelemetryLog[]>(response);
}

/**
 * Flags or unflags a low-confidence response item inside the admin database records.
 */
export async function toggleLogFlagStatus(logId: string): Promise<TelemetryLog> {
  const response = await fetch(`${API_BASE_URL}/api/admin/logs/flag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ logId }),
  });
  return handleResponse<TelemetryLog>(response);
}

/**
 * Submits custom agricultural facts to ground the RAG pipeline dynamically.
 */
export async function insertCustomKBItem(item: Omit<KBItem, "id">): Promise<KBItem> {
  const response = await fetch(`${API_BASE_URL}/api/admin/kb/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  return handleResponse<KBItem>(response);
}
