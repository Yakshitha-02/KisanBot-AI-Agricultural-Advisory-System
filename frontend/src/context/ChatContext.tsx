import { createContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatContextValue {
  messages: Message[];
  addMessage: (message: Message) => void;
  resetConversation: () => void;
}

export const ChatContext = createContext<ChatContextValue>({
  messages: [],
  addMessage: () => {},
  resetConversation: () => {},
});

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const resetConversation = () => {
    setMessages([]);
  };

  return <ChatContext.Provider value={{ messages, addMessage, resetConversation }}>{children}</ChatContext.Provider>;
}
