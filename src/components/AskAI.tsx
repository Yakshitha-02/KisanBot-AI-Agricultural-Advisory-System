import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Volume2, VolumeX, ThumbsUp, ThumbsDown, Info, Bot, User, CornerDownRight } from "lucide-react";
import { Message, Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { queryLiveFastAPI, saveLogFeedback } from "../lib/offlineDb";

interface AskAIProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  messages: Message[];
  onAddMessage: (msg: Message) => void;
}

export default function AskAI({ language, onLanguageChange, messages, onAddMessage }: AskAIProps) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
      
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      // Fallback if SpeechRecognition not supported in iframe/browser
      setIsRecording(!isRecording);
      if (!isRecording) {
        setTimeout(() => {
          const simulatedText = language === "hi" 
            ? "गेहूं की बुआई कब करनी चाहिए?" 
            : language === "kn"
            ? "ಗೋಧಿ ಬಿತ್ತನೆಗೆ ಸೂಕ್ತ ಸಮಯ ಯಾವುದು?"
            : "What is the best time to sow wheat in Punjab?";
          setInputText(simulatedText);
          setIsRecording(false);
        }, 3000);
      }
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Add user message
    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language
    };
    onAddMessage(userMsg);
    setInputText("");
    setIsLoading(true);

    try {
      const data = await queryLiveFastAPI(text, language, messages);
      const botMsg: Message = {
        id: data.id,
        sender: "bot",
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        intent: data.intent,
        confidenceScore: data.confidenceScore,
        flagged: data.flagged,
        sources: data.sources || []
      };
      onAddMessage(botMsg);
      setIsLoading(false);
      
      // Auto read-aloud response for voice-first experience!
      handleSpeak(data.answer, botMsg.id);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: "err-" + Date.now(),
        sender: "bot",
        text: `Error processing query: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language
      };
      onAddMessage(errorMsg);
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string, msgId: string) => {
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose voice language code
    utterance.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
    
    utterance.onend = () => {
      setSpeakingMsgId(null);
    };
    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleFeedback = async (msgId: string, type: "up" | "down") => {
    try {
      saveLogFeedback(msgId, type);
      alert("Thank you for your feedback! This helps agricultural extension workers improve the system.");
      // Modify local message feedback
      const msgIndex = messages.findIndex(m => m.id === msgId);
      if (msgIndex !== -1) {
        messages[msgIndex].satisfaction = type;
      }
    } catch (err) {
      console.error("Feedback submission failed", err);
    }
  };

  const quickQuestions = {
    en: [
      "When should I sow Wheat?",
      "How to treat Yellow Rust?",
      "Tell me about PM-KISAN benefits",
      "Maize armyworm remedy"
    ],
    hi: [
      "गेहूं बोने का समय कब है?",
      "पीला रतुआ का इलाज क्या है?",
      "पीएम किसान के क्या फायदे हैं?",
      "मक्के में कीड़े का नियंत्रण कैसे करें?"
    ],
    kn: [
      "ಗೋಧಿ ಬಿತ್ತನೆ ಸಮಯ ಯಾವುದು?",
      "ಹಳದಿ ತುಕ್ಕು ರೋಗದ ಚಿಕಿತ್ಸೆ ಏನು?",
      "ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆಯ ವಿವರ ಕೊಡಿ",
      "ಸೈನಿಕ ಹುಳು ಹತೋಟಿ ವಿಧಾನ ಹೇಳಿ"
    ]
  };

  const curQuickQuestions = quickQuestions[language as keyof typeof quickQuestions] || quickQuestions.en;

  return (
    <div id="ask-ai-view" className="flex flex-col h-[calc(100vh-140px)] bg-brand-canvas rounded-3xl overflow-hidden border border-slate-200/50 shadow-md">
      
      {/* Top Header Controls */}
      <div id="ai-chat-header" className="bg-white border-b border-slate-100 p-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Kisan Mitra AI Chat</h3>
            <p className="text-xs text-brand-primary font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-brand-accent rounded-full animate-pulse"></span>
              Indic NLP Active
            </p>
          </div>
        </div>

        {/* Language selector buttons */}
        <div className="flex items-center gap-1 bg-brand-bg p-1 rounded-xl">
          {(["en", "hi", "kn"] as Language[]).map((lang) => (
            <button
              key={lang}
              id={`lang-sel-${lang}`}
              onClick={() => onLanguageChange(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === lang ? "bg-brand-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/50"
              }`}
            >
              {lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : "ಕನ್ನಡ"}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div id="messages-container" className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4 max-w-md mx-auto">
            <div className="p-4 bg-brand-bg text-brand-primary rounded-full animate-bounce">
              <Bot size={36} />
            </div>
            <h4 className="font-extrabold text-slate-800">
              {language === "hi" 
                ? "नमस्ते किसान भाई! मैं किसान मित्र हूँ।" 
                : language === "kn"
                ? "ನಮಸ್ಕಾರ ರೈತ ಬಂಧುಗಳೇ! ನಾನು ಕಿಸಾನ್ ಮಿತ್ರ ಎಐ."
                : "Hello, Farmer Friend! I am Kisan Mitra."}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {language === "hi"
                ? "आप मुझसे गेहूं की बुआई, कीट नियंत्रण, सरकारी योजनाओं और मंडी भाव के बारे में अपनी भाषा में पूछ सकते हैं।"
                : language === "kn"
                ? "ನೀವು ನನ್ನೊಂದಿಗೆ ಗೋಧಿ ಬಿತ್ತನೆ, ಕೀಟ ನಿಯಂತ್ರಣ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು."
                : "You can ask me questions about crop management, soil health, subsidies, or pest control. Try clicking a sample query below:"}
            </p>

            {/* Quick Suggestions */}
            <div className="grid grid-cols-2 gap-2 w-full pt-4">
              {curQuickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  id={`quick-q-${idx}`}
                  onClick={() => handleSend(q)}
                  className="bg-white hover:bg-brand-bg hover:border-brand-primary/20 border border-slate-100 text-[11px] font-bold text-left text-slate-700 px-3 py-2.5 rounded-xl transition shadow-xs leading-relaxed cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                id={`msg-bubble-${msg.id}`}
                className={`flex gap-3 max-w-xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* Avatar icon */}
                <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center text-xs flex-shrink-0 ${
                  msg.sender === "user" ? "bg-brand-bg text-brand-primary font-bold" : "bg-white border border-slate-100 text-slate-700 shadow-xs"
                }`}>
                  {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble Body */}
                <div className="space-y-1">
                  <div className={`p-4 shadow-xs ${
                    msg.sender === "user" 
                      ? "chat-bubble-user" 
                      : "chat-bubble-bot border border-slate-100 text-slate-800"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                    
                    {/* Timestamp & Voice action row */}
                    <div className="flex items-center justify-between gap-6 mt-3 text-[10px] opacity-75">
                      <span className="font-medium">{msg.timestamp}</span>
                      
                      {msg.sender === "bot" && (
                        <div className="flex items-center gap-2">
                          {/* Speak Response */}
                          <button
                            id={`btn-speak-${msg.id}`}
                            onClick={() => handleSpeak(msg.text, msg.id)}
                            className="p-1.5 hover:bg-brand-bg rounded-full transition text-brand-primary cursor-pointer"
                            title="Read answer aloud"
                          >
                            {speakingMsgId === msg.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RAG sources or advisory info if present */}
                  {msg.sender === "bot" && msg.sources && msg.sources.length > 0 && (
                    <div className="bg-brand-bg/40 border border-emerald-100/40 rounded-2xl p-3.5 text-[10px] text-brand-primary space-y-1.5 ml-1 max-w-sm">
                      <p className="font-bold flex items-center gap-1 text-slate-800">
                        <Info size={11} className="text-brand-primary" /> Grounded Reference Sources:
                      </p>
                      {msg.sources.map((src, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-1 text-slate-700 font-medium">
                          <CornerDownRight size={10} className="mt-0.5 text-brand-primary" />
                          <span>{src}</span>
                        </div>
                      ))}
                      {msg.confidenceScore && (
                        <div className="pt-1 flex items-center justify-between text-[9px] text-slate-500 font-semibold">
                          <span>Quality Score: {Math.round(msg.confidenceScore * 100)}%</span>
                          {msg.flagged && <span className="text-amber-600 font-bold">⚠️ Flagged for Expert Review</span>}
                        </div>
                      )}

                      {/* Feedback buttons */}
                      <div className="pt-2 flex items-center gap-3 border-t border-slate-200/30">
                        <span className="text-slate-500 font-semibold">Helpful answer?</span>
                        <button 
                          onClick={() => handleFeedback(msg.id, "up")}
                          className="p-1 hover:bg-brand-bg rounded-md transition text-brand-primary cursor-pointer"
                        >
                          <ThumbsUp size={11} />
                        </button>
                        <button 
                          onClick={() => handleFeedback(msg.id, "down")}
                          className="p-1 hover:bg-rose-50 rounded-md transition text-rose-700 cursor-pointer"
                        >
                          <ThumbsDown size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Waiting/Typing loader indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-xl">
                <div className="p-2 bg-white border border-slate-100 rounded-full h-8 w-8 flex items-center justify-center">
                  <Bot size={14} className="animate-spin text-brand-primary" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-xs text-slate-400 text-xs flex items-center gap-2 font-medium">
                  <span className="animate-pulse">Consulting Kisan Mitra agricultural knowledge base...</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Input Bar */}
      <div id="ai-input-bar" className="bg-white border-t border-slate-100 p-3 md:p-4">
        <div className="flex items-center gap-2">
          {/* Microphone Hold-To-Speak Button */}
          <button
            id="mic-button-textbar"
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition flex-shrink-0 cursor-pointer ${
              isRecording 
                ? "bg-red-500 text-white animate-pulse voice-glow" 
                : "bg-brand-bg hover:bg-brand-bg/80 text-brand-primary"
            }`}
            title="Speak query"
          >
            <Mic size={20} />
          </button>

          {/* Form input */}
          <input
            id="query-text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              language === "hi" 
                ? "यहां अपनी कृषि समस्या लिखें..." 
                : language === "kn"
                ? "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                : "Ask about seeds, weather, schemes, market rates..."
            }
            className="flex-1 bg-brand-canvas border border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800"
          />

          {/* Send text button */}
          <button
            id="send-query-button"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="p-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>

        {/* Recording active soundwaves */}
        <AnimatePresence>
          {isRecording && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex justify-center items-center gap-1.5 py-2 mt-2 bg-red-50 rounded-lg"
            >
              <span className="text-[10px] font-bold text-red-600 mr-2 uppercase animate-pulse">Recording voice in {language === "hi" ? "Hindi" : language === "kn" ? "Kannada" : "English"}...</span>
              <div className="w-1 h-3 bg-red-500 rounded-full animate-bounce delay-100" />
              <div className="w-1 h-5 bg-red-500 rounded-full animate-bounce delay-200" />
              <div className="w-1 h-4 bg-red-500 rounded-full animate-bounce delay-300" />
              <div className="w-1 h-2 bg-red-500 rounded-full animate-bounce delay-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
