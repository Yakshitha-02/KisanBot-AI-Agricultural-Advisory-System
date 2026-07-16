import React, { useState, useEffect } from "react";
import { 
  Sprout, 
  Bot, 
  Mic, 
  CloudSun, 
  LineChart, 
  FileText, 
  History as HistoryIcon, 
  LayoutDashboard,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  LogOut
} from "lucide-react";

import Dashboard from "./components/Dashboard";
import AskAI from "./components/AskAI";
import VoiceAssistant from "./components/VoiceAssistant";
import Weather from "./components/Weather";
import MarketPrices from "./components/MarketPrices";
import CropDisease from "./components/CropDisease";
import GovernmentSchemes from "./components/GovernmentSchemes";
import History from "./components/History";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import { Message, ChatSession, Language, LoggedInUser } from "./types";

export default function App() {
  const [user, setUser] = useState<LoggedInUser | null>(() => {
    const saved = localStorage.getItem("kisan_mitra_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kisan_mitra_sessions");
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (err) {
        console.error("Error loading saved sessions", err);
      }
    }
  }, []);

  // Sync stateful theme class with root HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleAddMessage = (newMsg: Message) => {
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);

    // Save/update session history in localStorage
    if (updatedMessages.length > 0) {
      // Find or create current active session
      let currentSessionId = localStorage.getItem("kisan_mitra_current_session_id");
      let updatedSessions = [...sessions];
      
      if (!currentSessionId) {
        currentSessionId = "session-" + Date.now();
        localStorage.setItem("kisan_mitra_current_session_id", currentSessionId);
        
        const newSession: ChatSession = {
          id: currentSessionId,
          title: newMsg.text.slice(0, 30) + (newMsg.text.length > 30 ? "..." : ""),
          messages: updatedMessages,
          createdAt: new Date().toISOString()
        };
        updatedSessions.unshift(newSession);
      } else {
        const sessIndex = updatedSessions.findIndex(s => s.id === currentSessionId);
        if (sessIndex !== -1) {
          updatedSessions[sessIndex].messages = updatedMessages;
        } else {
          // fallback recreate
          const newSession: ChatSession = {
            id: currentSessionId,
            title: newMsg.text.slice(0, 30) + (newMsg.text.length > 30 ? "..." : ""),
            messages: updatedMessages,
            createdAt: new Date().toISOString()
          };
          updatedSessions.unshift(newSession);
        }
      }
      
      setSessions(updatedSessions);
      localStorage.setItem("kisan_mitra_sessions", JSON.stringify(updatedSessions));
    }
  };

  const handleSelectHistorySession = (session: ChatSession) => {
    setMessages(session.messages);
    localStorage.setItem("kisan_mitra_current_session_id", session.id);
    setActiveTab("ask");
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all stored crop advisory sessions?")) {
      setSessions([]);
      setMessages([]);
      localStorage.removeItem("kisan_mitra_sessions");
      localStorage.removeItem("kisan_mitra_current_session_id");
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Clear current session context when swapping languages to prevent confusion
    setMessages([]);
    localStorage.removeItem("kisan_mitra_current_session_id");
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleLogin = (loggedInUser: LoggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("kisan_mitra_user", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("kisan_mitra_user");
    setActiveTab("dashboard");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "ask", label: "Ask AI", icon: <span className="text-sm font-bold">🤖</span> },
    { id: "voice", label: "Voice Assistant", icon: <Mic size={18} /> },
    { id: "weather", label: "Weather", icon: <CloudSun size={18} /> },
    { id: "market", label: "Market Prices", icon: <LineChart size={18} /> },
    { id: "disease", label: "Crop Disease", icon: <Sprout size={18} /> },
    { id: "schemes", label: "Government Schemes", icon: <FileText size={18} /> },
    { id: "history", label: "History", icon: <HistoryIcon size={18} /> },
  ];

  if (!user) {
    return (
      <Login 
        onLogin={handleLogin} 
        language={language} 
        onLanguageChange={handleLanguageChange} 
        theme={theme} 
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-brand-bg text-slate-800"
    }`}>
      
      {/* HEADER BAR */}
      <header className={`sticky top-0 z-50 px-4 py-3 md:px-6 border-b flex items-center justify-between ${
        theme === "dark" 
          ? "bg-gray-950 border-gray-800" 
          : "bg-brand-primary text-white border-brand-primary-hover shadow-md"
      }`}>
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1 rounded-lg transition ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-white/10 text-white"
            }`}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${theme === "dark" ? "bg-emerald-600 text-white" : "bg-white/10 text-white"}`}>
              <Sprout size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight font-sans text-white">Kisan Mitra AI</span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-80 text-green-300">Live Advisory</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic header widgets */}
        <div className="flex items-center gap-3">
          
          {/* Internal Worker admin console button */}
          {user?.role === "admin" && (
            <button
              id="nav-to-admin-console"
              onClick={() => {
                setActiveTab("admin");
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "admin"
                  ? theme === "dark" 
                    ? "bg-emerald-950/40 text-emerald-200 border border-emerald-800" 
                    : "bg-white text-brand-primary shadow-sm"
                  : theme === "dark" 
                    ? "text-gray-400 hover:bg-gray-800" 
                    : "text-white/80 hover:bg-white/10"
              }`}
            >
              <ShieldCheck size={14} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition cursor-pointer ${
              theme === "dark" 
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User profile / Logout */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-white/20 dark:border-gray-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white dark:text-gray-100">{user.name}</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-green-300 dark:text-green-400">
                  {user.role === "admin" ? "Advisory Officer" : "Farmer Mitra"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300"
                    : "bg-white/10 hover:bg-white/20 text-white hover:text-red-200"
                }`}
                title="Logout"
              >
                <LogOut size={14} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          )}

        </div>
      </header>

      {/* BODY WRAPPER */}
      <div className="flex">
        
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className={`hidden md:block w-64 h-[calc(100vh-65px)] border-r p-4 shrink-0 overflow-y-auto ${
          theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                  activeTab === item.id
                    ? "bg-brand-primary text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className={activeTab === item.id ? "text-green-200" : "text-gray-400"}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sowing checklist card */}
          <div className="mt-8 bg-brand-bg/50 dark:bg-gray-800/30 border border-emerald-100/40 dark:border-gray-800/50 p-4 rounded-xl space-y-2">
            <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Install Kisan Mitra</h4>
            <p className="text-[10px] text-gray-500 leading-normal">
              PWA-ready for Android Chrome. Perfect for low-bandwidth farming areas.
            </p>
            <button 
              onClick={() => setActiveTab("dashboard")} 
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-1.5 rounded-lg text-[10px] transition"
            >
              Install
            </button>
          </div>
        </aside>

        {/* MOBILE OVERLAY DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <aside className={`relative w-64 max-w-xs h-full flex flex-col p-4 shadow-xl z-50 ${
              theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
            }`}>
              <div className="flex items-center justify-between mb-6">
                <span className="font-extrabold text-base tracking-tight text-emerald-600">Menu Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                      activeTab === item.id
                        ? "bg-emerald-800 text-white"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* MAIN VISUAL CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
          {activeTab === "dashboard" && <Dashboard onNavigate={setActiveTab} language={language} />}
          {activeTab === "ask" && (
            <AskAI 
              language={language} 
              onLanguageChange={handleLanguageChange} 
              messages={messages} 
              onAddMessage={handleAddMessage} 
            />
          )}
          {activeTab === "voice" && <VoiceAssistant language={language} onLanguageChange={handleLanguageChange} />}
          {activeTab === "weather" && <Weather />}
          {activeTab === "market" && <MarketPrices />}
          {activeTab === "disease" && <CropDisease />}
          {activeTab === "schemes" && <GovernmentSchemes />}
          {activeTab === "history" && (
            <History 
              sessions={sessions} 
              onSelectSession={handleSelectHistorySession} 
              onClearHistory={handleClearHistory} 
            />
          )}
          {activeTab === "admin" && user?.role === "admin" && <AdminPanel />}
        </main>

      </div>

    </div>
  );
}
