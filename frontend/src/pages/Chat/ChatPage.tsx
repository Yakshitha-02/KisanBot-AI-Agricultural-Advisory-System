import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import ChatInput from "../../components/chatbot/ChatInput";
import ChatWindow from "../../components/chatbot/ChatWindow";
import ConversationSidebar from "../../components/chatbot/ConversationSidebar";
import { voiceService } from "../../services/voice";

import { chatService } from "../../services/chat";

const CONVERSATION_STORAGE_KEY = "kisanbot-chat-conversations";

interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ConversationItem {
  id: string;
  title: string;
  preview: string;
}

interface PersistedConversationState {
  activeConversationId: string | null;
  conversations: ConversationItem[];
}

const readStoredConversations = (): PersistedConversationState => {
  if (typeof window === "undefined") {
    return { activeConversationId: null, conversations: [] };
  }

  try {
    const storedValue = window.localStorage.getItem(CONVERSATION_STORAGE_KEY);

    if (!storedValue) {
      return { activeConversationId: null, conversations: [] };
    }

    const parsed = JSON.parse(storedValue) as Partial<PersistedConversationState>;

    return {
      activeConversationId:
        typeof parsed.activeConversationId === "string"
          ? parsed.activeConversationId
          : null,
      conversations: Array.isArray(parsed.conversations)
        ? parsed.conversations
        : [],
    };
  } catch (error) {
    console.error("Unable to read saved chats", error);
    return { activeConversationId: null, conversations: [] };
  }
};

const persistConversations = (
  conversations: ConversationItem[],
  activeConversationId: string | null
) => {
  if (typeof window === "undefined") {
    return;
  }

  const persistedState: PersistedConversationState = {
    activeConversationId,
    conversations,
  };

  window.localStorage.setItem(
    CONVERSATION_STORAGE_KEY,
    JSON.stringify(persistedState)
  );
};

function ChatPage() {

  const [conversations, setConversations] = useState<ConversationItem[]>(() => readStoredConversations().conversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => readStoredConversations().activeConversationId);

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);

  const [sessionId, setSessionId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] =
  useState<MediaRecorder | null>(null);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId
      ) ?? null,
    [activeConversationId, conversations]
  );

  useEffect(() => {
    persistConversations(conversations, activeConversationId);
  }, [conversations, activeConversationId]);

  /*
   * Load all previous chat sessions
   * whenever user opens chatbot
   */
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await chatService.getSessions();
        const storedState = readStoredConversations();
        const savedConversations = storedState.conversations;
        const savedConversationMap = new Map(
          savedConversations.map((conversation) => [conversation.id, conversation])
        );

        const chats: ConversationItem[] = response.data.map((chat: any) => {
          const savedConversation = savedConversationMap.get(String(chat.id));

          return {
            id: String(chat.id),
            title: savedConversation?.title ?? chat.title,
            preview: savedConversation?.preview ?? "",
          };
        });

        setConversations(chats);

        const restoredActiveId =
          storedState.activeConversationId &&
          chats.some((conversation) => conversation.id === storedState.activeConversationId)
            ? storedState.activeConversationId
            : chats[0]?.id ?? null;

        setActiveConversationId(restoredActiveId);

        if (restoredActiveId) {
          setSessionId(Number(restoredActiveId));

          const messageResponse = await chatService.getMessages(
            Number(restoredActiveId)
          );

          const loadedMessages: ChatMessageItem[] =
            messageResponse.data.map((msg: any) => ({
              id: String(msg.id),
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.message,
              timestamp: "",
            }));

          setMessages(loadedMessages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadSessions();
  }, []);

  /*
   * If no session exists,
   * automatically create one
   */
  useEffect(() => {
    if (sessionId) return;

    const createSession = async () => {
      try {
        const response = await chatService.createSession();

        setSessionId(response.data.id);

        const newConversation: ConversationItem = {
          id: String(response.data.id),
          title: response.data.title,
          preview: "",
        };

        setConversations((prev) => [newConversation, ...prev]);

        setActiveConversationId(String(response.data.id));
      } catch (err) {
        console.error(err);
      }
    };

    createSession();
  }, [sessionId]);
    /*
   * Create a completely new chat
   */
  const handleNewChat = async () => {
    try {
      const response = await chatService.createSession();

      const newConversation: ConversationItem = {
        id: String(response.data.id),
        title: response.data.title,
        preview: "",
      };

      setConversations((prev) => [newConversation, ...prev]);

      setSessionId(response.data.id);

      setActiveConversationId(String(response.data.id));

      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  /*
   * Open an old conversation
   */
  const handleSelectConversation = async (id: string) => {
    try {
      setActiveConversationId(id);

      setSessionId(Number(id));

      const response = await chatService.getMessages(Number(id));

      const loadedMessages: ChatMessageItem[] = response.data.map(
        (message: any) => ({
          id: String(message.id),
          role: message.sender === "user" ? "user" : "assistant",
          content: message.message,
          timestamp: "",
        })
      );

      setMessages(loadedMessages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameConversation = async (id: string, currentTitle: string) => {
    const nextTitle = window.prompt("Rename this chat", currentTitle)?.trim();

    if (!nextTitle || nextTitle === currentTitle) {
      return;
    }

    try {
      await chatService.renameSession(Number(id), nextTitle);

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === id
            ? { ...conversation, title: nextTitle }
            : conversation
        )
      );
    } catch (err) {
      console.error(err);
      window.alert("Unable to rename the chat right now.");
    }
  };

  const handleDeleteConversation = async (id: string) => {
    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
      return;
    }

    try {
      await chatService.deleteSession(numericId);

      const remainingConversations = conversations.filter(
        (conversation) => conversation.id !== id
      );

      setConversations(remainingConversations);

      if (activeConversationId === id) {
        const nextConversationId = remainingConversations[0]?.id ?? null;

        setActiveConversationId(nextConversationId);
        setSessionId(nextConversationId ? Number(nextConversationId) : null);

        if (nextConversationId) {
          try {
            const response = await chatService.getMessages(Number(nextConversationId));

            const loadedMessages: ChatMessageItem[] = response.data.map(
              (message: any) => ({
                id: String(message.id),
                role: message.sender === "user" ? "user" : "assistant",
                content: message.message,
                timestamp: "",
              })
            );

            setMessages(loadedMessages);
          } catch (err) {
            console.error(err);
          }
        } else {
          setMessages([]);
        }
      }
    } catch (err) {
      console.error(err);
      window.alert("Unable to delete the chat right now.");
    }
  };

  /*
   * Send message
   */
  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

    const userMessage: ChatMessageItem = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      const response = await chatService.ask(sessionId, content);

      const assistantMessage: ChatMessageItem = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content:
          response.data.answer ??
          "Sorry, I couldn't generate a response.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      /*
       * Update sidebar title after first question
       */
      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === String(sessionId)
            ? {
                ...chat,
                title:
                  content.length > 30
                    ? content.substring(0, 30) + "..."
                    : content,
                preview: assistantMessage.content,
              }
            : chat
        )
      );
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content:
            "The assistant is currently unavailable. Please try again shortly.",
          timestamp: "",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVoice = async () => {

  if (isRecording) {

    mediaRecorder?.stop();

    return;

  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  const recorder = new MediaRecorder(stream);

  const chunks: Blob[] = [];

  recorder.ondataavailable = (event) => {
    chunks.push(event.data);
  };

  recorder.onstop = async () => {

    setIsRecording(false);

    const blob = new Blob(chunks, {
      type: "audio/wav",
    });

    const file = new File(
      [blob],
      "voice.wav",
      {
        type: "audio/wav",
      }
    );

    try {

      setIsLoading(true);

      const response =
        await voiceService.sendVoice(file);

      const userMessage = {
        id: Date.now() + "-user",
        role: "user" as const,
        content: response.transcript,
        timestamp: "",
      };

      const botMessage = {
        id: Date.now() + "-bot",
        role: "assistant" as const,
        content: response.answer,
        timestamp: "",
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
        botMessage,
      ]);

      if (response.audio_file) {

        new Audio(
          "http://127.0.0.1:8000/" +
          response.audio_file
        ).play();

      }

    } catch (err) {

      console.error(err);

    } finally {

      setIsLoading(false);

    }

  };

  recorder.start();

  setMediaRecorder(recorder);

  setIsRecording(true);

};
    return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="space-y-4">

        <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">

          <h1 className="text-2xl font-semibold text-slate-900">
            🌾 KisanBot
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            AI Powered Agricultural Assistant
          </p>

        </div>

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
        />

        <ChatInput
  onSend={handleSendMessage}
  onVoice={handleVoice}
  isLoading={isLoading}
/>

        {activeConversation && (

          <div className="rounded-xl bg-green-50 px-3 py-2 text-xs text-green-700">

            Current Chat :

            <strong className="ml-2">

              {activeConversation.title}

            </strong>

          </div>

        )}

      </div>

    </motion.div>
  );
}

export default ChatPage;