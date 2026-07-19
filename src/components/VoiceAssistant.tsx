import React, { useState, useRef, useEffect } from "react";
import { Mic, Volume2, Square, RefreshCw, HelpCircle, AlertCircle, Bot, User } from "lucide-react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { queryLocalAdvisor } from "../lib/offlineDb";

interface VoiceAssistantProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function VoiceAssistant({ language, onLanguageChange }: VoiceAssistantProps) {
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [qualityScore, setQualityScore] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
      
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setTranscript(text);
        processVoiceQuery(text);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setStatus("idle");
      };

      rec.onend = () => {
        if (status === "listening") {
          setStatus("processing");
        }
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  const startListening = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setTranscript("");
    setAiResponse("");
    setQualityScore(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setStatus("listening");
      } catch (err) {
        console.error(err);
      }
    } else {
      // Mock hold-to-speak simulation for iframe/desktop
      setStatus("listening");
      setTimeout(() => {
        setStatus("processing");
        const queries = {
          en: "What organic fertilizer can improve clay soil drainage?",
          hi: "धान की रोपाई के दौरान कितनी बार सिंचाई करनी चाहिए?",
          kn: "ನಾಟಿ ಮಾಡುವಾಗ ಭತ್ತದ ಬೆಳೆಗೆ ಎಷ್ಟು ಬಾರಿ ನೀರು ಹಾಯಿಸಬೇಕು?"
        };
        const selectedQuery = queries[language] || queries.en;
        setTranscript(selectedQuery);
        processVoiceQuery(selectedQuery);
      }, 3500);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && status === "listening") {
      recognitionRef.current.stop();
      setStatus("processing");
    }
  };

  const processVoiceQuery = async (queryText: string) => {
    setStatus("processing");
    try {
      const data = queryLocalAdvisor(queryText, language);
      setAiResponse(data.answer);
      setQualityScore(data.confidenceScore);
      speakResponse(data.answer);
    } catch (err: any) {
      setAiResponse(`Failed to process voice query: ${err.message}`);
      setStatus("idle");
    }
  };

  const speakResponse = (text: string) => {
    if (!synthRef.current) return;
    setStatus("speaking");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
    utterance.onend = () => {
      setStatus("idle");
    };
    utterance.onerror = () => {
      setStatus("idle");
    };

    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setStatus("idle");
  };

  const strings = {
    en: {
      header: "Field Voice Assistant",
      sub: "No typing required. Select language, tap the big button and talk.",
      tapToTalk: "TAP TO SPEAK",
      listening: "LISTENING...",
      processing: "UNDERSTANDING YOUR PROBLEM...",
      speaking: "SPEAKING ANSWER...",
      farmerSaid: "You asked:",
      mitraSaid: "Kisan Mitra Answer:",
      stopBtn: "Stop Speaking"
    },
    hi: {
      header: "खेत आवाज़ सहायक",
      sub: "लिखने की आवश्यकता नहीं है। भाषा चुनें, बड़े बटन पर दबाएं और बोलें।",
      tapToTalk: "बोलने के लिए दबाएं",
      listening: "आपकी बात सुन रहे हैं...",
      processing: "समस्या को समझ रहे हैं...",
      speaking: "उत्तर पढ़ रहे हैं...",
      farmerSaid: "आपने पूछा:",
      mitraSaid: "किसान मित्र का उत्तर:",
      stopBtn: "आवाज बंद करें"
    },
    kn: {
      header: "ಧ್ವನಿ ಸಹಾಯ",
      sub: "ಟೈಪ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ. ಭಾಷೆಯನ್ನು ಆರಿಸಿ, ದೊಡ್ಡ ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಿ.",
      tapToTalk: "ಮಾತನಾಡಲು ಒತ್ತಿ",
      listening: "ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...",
      processing: "ಸಮಸ್ಯೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...",
      speaking: "ಉತ್ತರವನ್ನು ಹೇಳಲಾಗುತ್ತಿದೆ...",
      farmerSaid: "ನೀವು ಕೇಳಿದ್ದು:",
      mitraSaid: "ಕಿಸಾನ್ ಮಿತ್ರ ಉತ್ತರ:",
      stopBtn: "ಮಾತನಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ"
    }
  };

  const t = strings[language] || strings.en;

  return (
    <div id="voice-assistant-view" className="max-w-2xl mx-auto space-y-6">
      
      {/* Title block */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-800 font-sans tracking-tight">{t.header}</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto font-medium">{t.sub}</p>
      </div>

      {/* Language Selector row */}
      <div className="flex justify-center gap-2">
        {(["en", "hi", "kn"] as Language[]).map((lang) => (
          <button
            key={lang}
            id={`voice-lang-${lang}`}
            onClick={() => onLanguageChange(lang)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer ${
              language === lang 
                ? "bg-brand-primary text-white ring-2 ring-brand-accent ring-offset-2 scale-105" 
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-100"
            }`}
          >
            {lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : "ಕನ್ನಡ"}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white border border-slate-200/40 rounded-3xl p-8 md:p-12 shadow-md text-center flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
        
        {/* Radar pulsing effect in active states */}
        {status === "listening" && (
          <div className="absolute inset-0 bg-red-500/5 animate-ping rounded-3xl" />
        )}
        {status === "speaking" && (
          <div className="absolute inset-0 bg-brand-accent/5 animate-pulse rounded-3xl" />
        )}

        {/* Dynamic Status Text */}
        <div className="h-8">
          <AnimatePresence mode="wait">
            <motion.span
              key={status}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className={`text-sm font-black uppercase tracking-widest ${
                status === "listening" 
                  ? "text-red-500" 
                  : status === "processing" 
                  ? "text-amber-500 animate-pulse" 
                  : status === "speaking" 
                  ? "text-brand-primary" 
                  : "text-slate-400"
              }`}
            >
              {status === "listening" ? t.listening : status === "processing" ? t.processing : status === "speaking" ? t.speaking : t.tapToTalk}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Primary Giant Microphone Button */}
        <div className="relative">
          {/* Wave ripple borders */}
          {status === "listening" && (
            <>
              <div className="absolute -inset-4 border border-red-400 rounded-full animate-ping opacity-30" />
              <div className="absolute -inset-8 border border-red-300 rounded-full animate-ping opacity-15" />
            </>
          )}
          {status === "speaking" && (
            <>
              <div className="absolute -inset-4 border border-brand-accent rounded-full animate-pulse opacity-30" />
              <div className="absolute -inset-8 border border-brand-accent/60 rounded-full animate-pulse opacity-15" />
            </>
          )}

          <button
            id="giant-voice-mic-btn"
            onClick={status === "speaking" ? stopSpeaking : status === "listening" ? stopListening : startListening}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer ${
              status === "listening"
                ? "bg-red-500 hover:bg-red-600 text-white voice-glow"
                : status === "speaking"
                ? "bg-amber-500 hover:bg-amber-600 text-white voice-glow"
                : "mic-button text-white voice-glow hover:brightness-110"
            }`}
          >
            {status === "speaking" ? (
              <Square size={48} className="fill-white" />
            ) : (
              <Mic size={48} className="fill-white/10" />
            )}
          </button>
        </div>

        {/* Interactive transcription display box */}
        <div className="w-full max-w-lg space-y-4 pt-4">
          
          {/* User speech */}
          {transcript && (
            <div id="voice-farmer-speech" className="bg-brand-bg/40 border border-emerald-100/40 rounded-2xl p-4 text-left">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-wider block mb-1">{t.farmerSaid}</span>
              <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>🎙️</span>
                "{transcript}"
              </p>
            </div>
          )}

          {/* AI generated readback */}
          {aiResponse && (
            <div id="voice-mitra-response" className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.mitraSaid}</span>
                {qualityScore && (
                  <span className="text-[9px] font-bold px-2.5 py-1 bg-brand-bg text-brand-primary rounded-full">
                    Quality score: {Math.round(qualityScore * 100)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                {aiResponse}
              </p>
              
              {status === "speaking" && (
                <div className="flex justify-between items-center pt-2">
                  <div className="h-8 bg-green-50 rounded-full flex items-center px-4 gap-3">
                    <div className="audio-wave">
                      <div className="audio-bar" style={{ height: "8px" }}></div>
                      <div className="audio-bar animate-pulse" style={{ height: "18px" }}></div>
                      <div className="audio-bar" style={{ height: "14px" }}></div>
                      <div className="audio-bar animate-pulse" style={{ height: "20px" }}></div>
                      <div className="audio-bar" style={{ height: "12px" }}></div>
                      <div className="audio-bar animate-pulse" style={{ height: "16px" }}></div>
                    </div>
                    <span className="text-[9px] text-brand-accent-dark font-extrabold uppercase tracking-widest">Playing Answer</span>
                  </div>

                  <button
                    id="stop-audio-speak-btn"
                    onClick={stopSpeaking}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer"
                  >
                    <Square size={10} />
                    {t.stopBtn}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Quick farmer advice safety hints footer */}
      <div className="bg-amber-50 border border-amber-200/40 rounded-2xl p-4 flex gap-3 text-amber-900 shadow-xs">
        <AlertCircle className="flex-shrink-0 text-amber-600 mt-0.5" size={18} />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider">Field Voice Safety Guidelines</h4>
          <p className="text-[11px] mt-1 leading-relaxed font-medium">
            Ensure you hold the phone close to your mouth in windy field conditions. Kisan Mitra uses advanced Sarvam AI noise-mitigation layer fallback to detect farming vocabulary like 'AWD', 'YMV', or 'Sowing'.
          </p>
        </div>
      </div>

    </div>
  );
}
