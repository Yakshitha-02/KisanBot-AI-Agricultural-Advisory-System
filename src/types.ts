export type Language = "en" | "hi" | "kn";

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  translatedText?: string;
  audioUrl?: string;
  timestamp: string;
  language: Language;
  intent?: string;
  confidenceScore?: number;
  flagged?: boolean;
  satisfaction?: "up" | "down" | null;
  sources?: string[];
}

export interface KBItem {
  id: string;
  category: "crop" | "weather" | "price" | "scheme" | "pest";
  question: string;
  answer: string;
  language: Language;
  tags: string[];
}

export interface MandiPrice {
  cropName: string;
  market: string;
  state: string;
  price: number; // in INR per quintal
  previousPrice: number;
  arrivalDate: string;
  trend: "up" | "down" | "stable";
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  benefits: string;
  eligibility: string[];
  documentsRequired: string[];
  link: string;
}

export interface CropDisease {
  name: string;
  crop: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  imagePrompt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export interface FeedbackLog {
  id: string;
  messageId: string;
  query: string;
  response: string;
  feedback: "up" | "down";
  timestamp: string;
}

export interface TelemetryLog {
  id: string;
  query: string;
  response: string;
  language: Language;
  intent: string;
  confidence: number;
  timestamp: string;
  flagged: boolean;
  satisfaction: "up" | "down" | null;
}

export interface LoggedInUser {
  username: string;
  role: "user" | "admin";
  name: string;
}

