import api from "./api";

export interface Session {
  id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: number;
  sender: "user" | "assistant";
  message: string;
  language: string;
  created_at?: string;
}

export const chatService = {
  createSession() {
    return api.post<Session>("/chatbot/session");
  },

  ask(sessionId: number, question: string) {
    return api.post("/chatbot/ask", {
      session_id: sessionId,
      question,
    });
  },

  getSessions() {
    return api.get<Session[]>("/chatbot/sessions");
  },

  getMessages(sessionId: number) {
    return api.get<Message[]>(`/chatbot/session/${sessionId}`);
  },

  renameSession(sessionId: number, title: string) {
    return api.patch(`/chatbot/session/${sessionId}`, { title });
  },

  deleteSession(sessionId: number) {
    return api.delete(`/chatbot/session/${sessionId}`);
  },

  feedback(payload: {
  message_id: number;
  rating: "positive" | "negative";
  comment?: string;
}) {
  return api.post("/feedback", payload);
}
};