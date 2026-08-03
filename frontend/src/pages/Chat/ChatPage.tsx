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
    return {
      activeConversationId: null,
      conversations: [],
    };
  }

  try {
    const stored = localStorage.getItem(CONVERSATION_STORAGE_KEY);

    if (!stored) {
      return {
        activeConversationId: null,
        conversations: [],
      };
    }

    return JSON.parse(stored);
  } catch {
    return {
      activeConversationId: null,
      conversations: [],
    };
  }
};

const persistConversations = (
  conversations: ConversationItem[],
  activeConversationId: string | null
) => {
  localStorage.setItem(
    CONVERSATION_STORAGE_KEY,
    JSON.stringify({
      conversations,
      activeConversationId,
    })
  );
};

function ChatPage() {
  const stored = readStoredConversations();

  const [conversations, setConversations] =
    useState<ConversationItem[]>(stored.conversations);

  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(stored.activeConversationId);

  const [messages, setMessages] =
    useState<ChatMessageItem[]>([]);

  const [sessionId, setSessionId] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isRecording, setIsRecording] =
    useState(false);

  const [mediaRecorder, setMediaRecorder] =
    useState<MediaRecorder | null>(null);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (c) => c.id === activeConversationId
      ) ?? null,
    [conversations, activeConversationId]
  );

  useEffect(() => {
    persistConversations(
      conversations,
      activeConversationId
    );
  }, [conversations, activeConversationId]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response =
        await chatService.getSessions();

      const chats: ConversationItem[] =
        response.data.map((chat: any) => ({
          id: String(chat.id),
          title: chat.title,
          preview: "",
        }));

      setConversations(chats);

      if (chats.length === 0) {
        setMessages([]);
        return;
      }

      const firstId = chats[0].id;

      setActiveConversationId(firstId);
      setSessionId(Number(firstId));

      const msg =
        await chatService.getMessages(
          Number(firstId)
        );

      setMessages(
        msg.data.map((m: any) => ({
          id: String(m.id),
          role:
            m.sender === "user"
              ? "user"
              : "assistant",
          content: m.message,
          timestamp: "",
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };
    /*
   * Create a completely new chat
   */
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

    setConversations((prev) => [
      newConversation,
      ...prev,
    ]);

    setActiveConversationId(
      String(response.data.id)
    );

    setSessionId(response.data.id);

    setMessages([]);
  } catch (err) {
    console.error(err);
  }
};

/*
 * Open an existing conversation
 */
const handleSelectConversation = async (
  id: string
) => {
  try {
    setActiveConversationId(id);
    setSessionId(Number(id));

    const response =
      await chatService.getMessages(Number(id));

    const loadedMessages: ChatMessageItem[] =
      response.data.map((message: any) => ({
        id: String(message.id),
        role:
          message.sender === "user"
            ? "user"
            : "assistant",
        content: message.message,
        timestamp: "",
      }));

    setMessages(loadedMessages);
  } catch (err) {
    console.error(err);
  }
};

/*
 * Rename conversation
 */
const handleRenameConversation = async (
  id: string,
  currentTitle: string
) => {
  const nextTitle = window
    .prompt("Rename this chat", currentTitle)
    ?.trim();

  if (!nextTitle || nextTitle === currentTitle)
    return;

  try {
    await chatService.renameSession(
      Number(id),
      nextTitle
    );

    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              title: nextTitle,
            }
          : chat
      )
    );
  } catch (err) {
    console.error(err);
    alert("Unable to rename chat.");
  }
};

/*
 * Delete conversation
 */
const handleDeleteConversation = async (
  id: string
) => {
  try {
    await chatService.deleteSession(Number(id));

    const remaining =
      conversations.filter(
        (chat) => chat.id !== id
      );

    setConversations(remaining);

    if (activeConversationId === id) {
      if (remaining.length === 0) {
        setMessages([]);
        setSessionId(null);
        setActiveConversationId(null);
        return;
      }

      const next = remaining[0];

      setActiveConversationId(next.id);
      setSessionId(Number(next.id));

      const response =
        await chatService.getMessages(
          Number(next.id)
        );

      setMessages(
        response.data.map((m: any) => ({
          id: String(m.id),
          role:
            m.sender === "user"
              ? "user"
              : "assistant",
          content: m.message,
          timestamp: "",
        }))
      );
    }
  } catch (err) {
    console.error(err);
    alert("Unable to delete chat.");
  }
};

/*
 * Send message
 */
const handleSendMessage = async (
  content: string
) => {
  if (!sessionId) return;

  const userMessage: ChatMessageItem = {
    id: Date.now() + "-user",
    role: "user",
    content,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // Show user message immediately
  setMessages((prev) => [
    ...prev,
    userMessage,
  ]);

  setIsLoading(true);

  try {
    const response = await chatService.ask(
      sessionId,
      content
    );

    const botMessage: ChatMessageItem = {
<<<<<<< HEAD
    id: String(response.data.message_id),
    role: "assistant",
    content: response.data.answer ?? "No response generated.",
    timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    }),
};
=======
      id: Date.now() + "-bot",
      role: "assistant",
      content:
        response.data.answer ??
        "No response generated.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
>>>>>>> origin/reema-backend

    setMessages((prev) => [
      ...prev,
      botMessage,
    ]);

    // Update sidebar preview
    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === String(sessionId)
          ? {
              ...chat,
              title:
                content.length > 30
                  ? content.substring(0, 30) + "..."
                  : content,
              preview: botMessage.content,
            }
          : chat
      )
    );
  } catch (err: any) {
    console.error(err);

    let errorMessage = "Something went wrong.";

    if (err.response?.data?.detail) {
      errorMessage = err.response.data.detail;
    } else if (err.message) {
      errorMessage = err.message;
    }

    const errorBotMessage: ChatMessageItem = {
      id: Date.now() + "-error",
      role: "assistant",
      content: `❌ ${errorMessage}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [
      ...prev,
      errorBotMessage,
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

    const file = new File([blob], "voice.wav", {
      type: "audio/wav",
    });

    try {
      setIsLoading(true);

      const response =
        await voiceService.sendVoice(file);

      const userMessage: ChatMessageItem = {
        id: Date.now() + "-user",
        role: "user",
        content: response.transcript,
        timestamp: "",
      };

      const botMessage: ChatMessageItem = {
        id: Date.now() + "-bot",
        role: "assistant",
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
    }catch (err: any) {
  console.error(err);

  let errorMessage = "Something went wrong.";

  if (err.response?.data?.detail) {
    errorMessage = err.response.data.detail;
  }

  const botMessage: ChatMessageItem = {
    id: Date.now() + "-error",
    role: "assistant",
    content: `❌ ${errorMessage}`,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [
    ...prev,
    botMessage,
  ]);
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

    <div className="flex min-h-[80vh] flex-col">


      {/* Empty State */}

      {messages.length === 0 ? (

        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">

          <div className="text-7xl">
            🌾
          </div>

          <h2 className="mt-6 text-3xl font-bold">

            Start a New Conversation

          </h2>

          <p className="mt-3 max-w-md text-center text-slate-500">

            Click <strong>New Chat</strong> on the
            left or type your first farming question
            below.

          </p>

        </div>

      ) : (

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
        />

      )}

      <div className="mt-5">

        <ChatInput
  onSend={handleSendMessage}
  onVoice={handleVoice}
  onStopRecording={() => mediaRecorder?.stop()}
  isLoading={isLoading}
  isRecording={isRecording}
/>

      </div>

    </div>

  </motion.div>
);

}

export default ChatPage;