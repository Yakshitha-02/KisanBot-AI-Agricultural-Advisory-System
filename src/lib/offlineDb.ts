import { KB_DATA } from "../kbData";
import { KBItem, TelemetryLog, Language, Message } from "../types";
import { API_BASE_URL, queryChatbot, saveChatbotFeedback, fetchAdminMetrics, fetchTelemetryLogs, toggleLogFlagStatus, insertCustomKBItem } from "./api";

// Key constants for local storage fallback
const STORAGE_KEYS = {
  KB_CUSTOM: "kisan_mitra_kb_custom",
  LOGS: "kisan_mitra_telemetry_logs",
};

// Initial default logs for offline fallback
const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: "log-1",
    query: "wheat sowing time in punjab",
    response: "[Offline Mode Match]\nThe optimum sowing time for wheat in Northern India (Punjab, Haryana, UP, Rajasthan) is from November 1st to November 15th for timely-sown varieties. Late sowing beyond November 25th reduces crop yield by 1.5% per day of delay. Soil temperature should ideally be between 20°C and 22°C.\n\n(Note: Operating in offline mode with local database fallback.)",
    language: "en",
    intent: "crop_advisory",
    confidence: 0.95,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    flagged: false,
    satisfaction: "up",
  },
  {
    id: "log-2",
    query: "धान में खाद कब डालें",
    response: "[Offline Mode Match]\nधान की रोपाई के बाद शुरुआती 10-15 दिनों तक खेत में 2 से 5 सेमी पानी का स्तर बनाए रखें। यह खरपतवार को रोकता है और जड़ों को जमने में मदद करता है। इसके बाद, पानी बचाने के लिए 'वैकल्पिक गीला और सूखा' (AWD) तरीका अपनाएं, जिससे दोबारा सिंचाई से पहले मिट्टी को 1-3 दिन तक सूखने दिया जाता है।\n\n(Note: Operating in offline mode with local database fallback.)",
    language: "hi",
    intent: "crop_advisory",
    confidence: 0.92,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    flagged: false,
    satisfaction: null,
  }
];

// Load Custom KB items from LocalStorage (Fallback)
export function getCustomKBItems(): KBItem[] {
  const saved = localStorage.getItem(STORAGE_KEYS.KB_CUSTOM);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

// Get combined KB (Static base + Custom dynamically injected) (Fallback)
export function getAllKBItems(): KBItem[] {
  return [...KB_DATA, ...getCustomKBItems()];
}

// Search and retrieve local RAG context (exact match or keyword matched)
export function getOfflineRAGContext(query: string, lang: Language): { contextText: string; sources: string[]; confidenceScore: number; intent: string } {
  const lowercaseQuery = query.toLowerCase();
  
  // Detect Intent
  let intent = "crop_advisory";
  if (lowercaseQuery.includes("weather") || lowercaseQuery.includes("rain") || lowercaseQuery.includes("monsoon") || lowercaseQuery.includes("सिंचाई") || lowercaseQuery.includes("ನೀರಾವರಿ") || lowercaseQuery.includes("तापमान")) {
    intent = "weather";
  } else if (lowercaseQuery.includes("price") || lowercaseQuery.includes("mandi") || lowercaseQuery.includes("rate") || lowercaseQuery.includes("ಮಾರುಕಟ್ಟೆ") || lowercaseQuery.includes("भाव") || lowercaseQuery.includes("दर") || lowercaseQuery.includes("कीमत")) {
    intent = "market_prices";
  } else if (lowercaseQuery.includes("scheme") || lowercaseQuery.includes("yojana") || lowercaseQuery.includes("subsidy") || lowercaseQuery.includes("pm-kisan") || lowercaseQuery.includes("ಯೋಜನೆ") || lowercaseQuery.includes("योजना") || lowercaseQuery.includes("अनुदान")) {
    intent = "scheme_lookup";
  } else if (lowercaseQuery.includes("pest") || lowercaseQuery.includes("insect") || lowercaseQuery.includes("disease") || lowercaseQuery.includes("worm") || lowercaseQuery.includes("रोग") || lowercaseQuery.includes("कीट") || lowercaseQuery.includes("ಕೀಟ")) {
    intent = "pest_control";
  }

  // Search dynamically combined KB
  const kbItems = getAllKBItems();
  const queryWords = lowercaseQuery.split(/\s+/).filter(w => w.length > 2);
  
  const scoredItems = kbItems.map(item => {
    let score = 0;
    const questionLower = item.question.toLowerCase();
    const answerLower = item.answer.toLowerCase();
    
    if (item.language === lang) score += 2;

    queryWords.forEach(word => {
      if (questionLower.includes(word)) score += 5;
      if (answerLower.includes(word)) score += 2;
      if (item.tags.some(t => t.toLowerCase() === word)) score += 8;
    });

    return { item, score };
  }).filter(entry => entry.score > 2);

  scoredItems.sort((a, b) => b.score - a.score);

  const topMatches = scoredItems.slice(0, 2);
  let contextText = "";
  const sources: string[] = [];
  let confidenceScore = 0.5;

  if (topMatches.length > 0) {
    contextText = topMatches.map(m => `Q: ${m.item.question}\nA: ${m.item.answer}`).join("\n\n");
    topMatches.forEach(m => {
      sources.push(m.item.question);
    });
    const maxScore = topMatches[0].score;
    confidenceScore = Math.min(0.98, 0.6 + (maxScore / 40));
  } else {
    // Cross language matching fallback
    const crossScored = kbItems.map(item => {
      let score = 0;
      const questionLower = item.question.toLowerCase();
      queryWords.forEach(word => {
        if (questionLower.includes(word)) score += 4;
        if (item.tags.some(t => t.toLowerCase() === word)) score += 6;
      });
      return { item, score };
    }).filter(entry => entry.score > 3);
    
    if (crossScored.length > 0) {
      crossScored.sort((a, b) => b.score - a.score);
      const topCross = crossScored[0];
      contextText = `[Cross-Language Reference] Q: ${topCross.item.question}\nA: ${topCross.item.answer}`;
      sources.push(topCross.item.question);
      confidenceScore = 0.72;
    }
  }

  return { contextText, sources, confidenceScore, intent };
}


// ==========================================
// ASYNC HIGH-LEVEL ADVISORY HOOKS WITH FALLBACK
// ==========================================

/**
 * Handle query processing completely, attempting a live FastAPI `/api/chatbot/query` request first.
 * Gracefully falls back to local RAG search if host is unreachable.
 */
export function queryLocalAdvisor(query: string, lang: Language): {
  id: string;
  answer: string;
  intent: string;
  confidenceScore: number;
  flagged: boolean;
  sources: string[];
} {
  // Return placeholder first, then actual components resolve.
  // Because the calling components (AskAI.tsx / VoiceAssistant.tsx) expect a synchronous return from offlineDb,
  // we will make synchronous local execution our default, BUT we can export an async alternative
  // OR we can make it fetch background logs if needed.
  
  // For standard compatibility with current synchronous component call structures,
  // we perform the offline RAG logic. Below we also provide async API-backed equivalents.
  
  const { contextText, sources, confidenceScore, intent } = getOfflineRAGContext(query, lang);
  
  let responseText = "";
  if (contextText) {
    responseText = `[Local Mode Match]\n${contextText.split("\nA: ")[1] || contextText}\n\n(Note: Sandbox operating. Connect FastAPI backend to replace this with direct AI answers.)`;
  } else {
    responseText = lang === "hi" 
      ? "नमस्ते! मुझे आपके प्रश्न का सीधा उत्तर हमारे ऑफलाइन डेटाबेस में नहीं मिला। कृपया सामान्य कृषि सलाह के लिए अपना प्रश्न फिर से पूछें।"
      : lang === "kn"
      ? "ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ನೇರ ಉತ್ತರ ನಮ್ಮ ಆಫ್‌ಲೈನ್ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ."
      : "Hello! I couldn't find a direct match in our offline database for your query. Please rephrase or use one of our quick tags.";
  }

  const isLowConfidence = confidenceScore < 0.65;
  const newLogId = "log-" + Date.now();

  const newLog: TelemetryLog = {
    id: newLogId,
    query: query,
    response: responseText,
    language: lang,
    intent: intent,
    confidence: confidenceScore,
    timestamp: new Date().toISOString(),
    flagged: isLowConfidence,
    satisfaction: null,
  };

  const logs = getTelemetryLogs();
  logs.unshift(newLog);
  saveTelemetryLogs(logs);

  return {
    id: newLogId,
    answer: responseText,
    intent: intent,
    confidenceScore: confidenceScore,
    flagged: isLowConfidence,
    sources: sources.length > 0 ? sources : ["Offline Knowledge Base"],
  };
}

/**
 * Async request wrapper to call the active FastAPI Backend `/api/chatbot/query`.
 */
export async function queryLiveFastAPI(query: string, lang: Language, history?: Message[]) {
  try {
    const data = await queryChatbot(query, lang, history);
    
    // Save to local telemetry list for logging visibility
    const newLog: TelemetryLog = {
      id: data.id,
      query: query,
      response: data.answer,
      language: lang,
      intent: data.intent,
      confidence: data.confidenceScore,
      timestamp: new Date().toISOString(),
      flagged: data.flagged,
      satisfaction: null,
    };
    const logs = getTelemetryLogs();
    logs.unshift(newLog);
    saveTelemetryLogs(logs);

    return data;
  } catch (error: any) {
    console.warn("FastAPI Server is unreachable. Resolving local offline fallback advisory. Error:", error.message);
    // Graceful offline fallback
    return queryLocalAdvisor(query, lang);
  }
}

// ==========================================
// OTHER DATA FETCHERS & MANAGEMENT
// ==========================================

// Save a new KB Item locally
export function saveLocalCustomKBItem(item: Omit<KBItem, "id">): KBItem {
  const custom = getCustomKBItems();
  const newItem: KBItem = {
    ...item,
    id: "custom-kb-" + Date.now(),
  };
  custom.push(newItem);
  localStorage.setItem(STORAGE_KEYS.KB_CUSTOM, JSON.stringify(custom));
  return newItem;
}

// Save a new KB Item (with FastAPI backend support)
export async function addCustomKBItem(item: Omit<KBItem, "id">): Promise<KBItem> {
  try {
    return await insertCustomKBItem(item);
  } catch {
    console.warn("FastAPI server offline. Saving dynamic KB item to LocalStorage fallback.");
    return saveLocalCustomKBItem(item);
  }
}

// Load Telemetry Logs
export function getTelemetryLogs(): TelemetryLog[] {
  const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_LOGS;
  }
}

// Save Telemetry Logs (Fallback helper)
function saveTelemetryLogs(logs: TelemetryLog[]) {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

// Toggle Flag status on a Log
export async function toggleLogFlag(logId: string): Promise<TelemetryLog | null> {
  try {
    return await toggleLogFlagStatus(logId);
  } catch {
    console.warn("FastAPI offline. Toggling flag locally.");
    const logs = getTelemetryLogs();
    const index = logs.findIndex(l => l.id === logId);
    if (index !== -1) {
      logs[index].flagged = !logs[index].flagged;
      saveTelemetryLogs(logs);
      return logs[index];
    }
    return null;
  }
}

// Save Satisfaction feedback
export async function saveLogFeedback(logId: string, satisfaction: "up" | "down" | null): Promise<TelemetryLog | null> {
  try {
    await saveChatbotFeedback(logId, satisfaction);
  } catch {
    console.warn("FastAPI offline. Saving feedback logs inside LocalStorage.");
  }
  
  const logs = getTelemetryLogs();
  const index = logs.findIndex(l => l.id === logId);
  if (index !== -1) {
    logs[index].satisfaction = satisfaction;
    saveTelemetryLogs(logs);
    return logs[index];
  }
  return null;
}

// Compute metrics dynamically for Admin Dashboard
export function getAdminMetrics() {
  const logs = getTelemetryLogs();
  const customKb = getCustomKBItems();
  const total = logs.length;
  
  const byLanguage = { en: 0, hi: 0, kn: 0 };
  const byIntent = { crop_advisory: 0, weather: 0, market_prices: 0, scheme_lookup: 0, pest_control: 0 };
  let thumbsUp = 0;
  let thumbsDown = 0;
  let flaggedCount = 0;

  logs.forEach(log => {
    if (log.language in byLanguage) {
      byLanguage[log.language as keyof typeof byLanguage]++;
    }
    if (log.intent in byIntent) {
      byIntent[log.intent as keyof typeof byIntent]++;
    }
    if (log.satisfaction === "up") thumbsUp++;
    if (log.satisfaction === "down") thumbsDown++;
    if (log.flagged) flaggedCount++;
  });

  const satRate = thumbsUp + thumbsDown > 0 ? Math.round((thumbsUp / (thumbsUp + thumbsDown)) * 100) : 100;

  return {
    totalQueries: total,
    byLanguage,
    byIntent,
    satisfactionRate: `${satRate}%`,
    flaggedIssues: flaggedCount,
    unansweredCount: customKb.length,
  };
}

/**
 * Async metrics retriever targeting live FastAPI metadata analytics.
 */
export async function getLiveAdminMetrics() {
  try {
    return await fetchAdminMetrics();
  } catch {
    return getAdminMetrics();
  }
}

/**
 * Async log entries list retriever targeting live FastAPI backend.
 */
export async function getLiveTelemetryLogs(): Promise<TelemetryLog[]> {
  try {
    return await fetchTelemetryLogs();
  } catch {
    return getTelemetryLogs();
  }
}
