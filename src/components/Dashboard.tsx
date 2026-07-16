import React, { useState, useEffect } from "react";
import { Sprout, PhoneCall, CloudSun, LineChart, FileText, History as HistoryIcon, Download } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  language: string;
}

export default function Dashboard({ onNavigate, language }: DashboardProps) {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("kisan_mitra_user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.name) {
          setUserName(u.name);
        }
      } catch (e) {}
    }
  }, []);

  // Multilingual translations for dashboard static text
  const strings = {
    en: {
      welcome: "Welcome back, farmer.",
      sub: "Ask crop questions, check mock market and weather data, and review advisory history from a mobile-first PWA.",
      askBtn: "Ask AI",
      voiceBtn: "Open Voice",
      offlineNotice: "Offline shell ready: static UI and last-session mock state can load without backend.",
      installText: "Install Kisan Mitra",
      installSub: "PWA-ready for Android Chrome.",
      installBtn: "Install",
      shortcuts: "Quick Shortcuts",
      cropAdvisory: "Crop Disease",
      cropAdvisorySub: "Symptoms, treatment, and prevention cards.",
      marketPrices: "Market Prices",
      marketPricesSub: "Sample mandi rates and price movement.",
      govtSchemes: "Government Schemes",
      govtSchemesSub: "Eligibility snapshots and required documents.",
      weatherTitle: "Weather",
      weatherSub: "Mock crop-safe forecast and irrigation hints.",
      historyTitle: "History",
      historySub: "Recent conversations and saved responses.",
    },
    hi: {
      welcome: "स्वागत है, किसान भाई।",
      sub: "फसल से संबंधित प्रश्न पूछें, मंडी भाव और मौसम की जानकारी लें, और पिछले परामर्श देखें।",
      askBtn: "एआई से पूछें",
      voiceBtn: "आवाज़ सहायक",
      offlineNotice: "ऑफ़लाइन मोड तैयार: बिना इंटरनेट के भी पिछला इतिहास और बुनियादी जानकारी उपलब्ध है।",
      installText: "किसान मित्र इंस्टॉल करें",
      installSub: "एंड्रॉइड क्रोम के लिए सीधे इंस्टॉल करें।",
      installBtn: "इंस्टॉल",
      shortcuts: "त्वरित विकल्प",
      cropAdvisory: "फसल रोग",
      cropAdvisorySub: "लक्षण, उपचार और बचाव संबंधी जानकारी।",
      marketPrices: "मंडी के भाव",
      marketPricesSub: "विभिन्न फसलों की मंडी दरें और मूल्य रुझान।",
      govtSchemes: "सरकारी योजनाएं",
      govtSchemesSub: "पात्रता मानदंड और आवश्यक दस्तावेज सूची।",
      weatherTitle: "मौसम की जानकारी",
      weatherSub: "सिंचाई और छिड़काव के लिए उपयुक्त समय की जानकारी।",
      historyTitle: "इतिहास",
      historySub: "पिछली बातचीत और सुरक्षित किए गए उत्तर।",
    },
    kn: {
      welcome: "ಸ್ವಾಗತ, ರೈತ ಬಾಂಧವರೇ.",
      sub: "ಬೆಳೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ, ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು ಹವಾಮಾನ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
      askBtn: "ಎಐ ಗೆ ಕೇಳಿ",
      voiceBtn: "ಧ್ವನಿ ಸಹಾಯ",
      offlineNotice: "ಆಫ್‌ಲೈನ್ ಶೆಲ್ ಸಿದ್ಧವಾಗಿದೆ: ಹಿಂದಿನ ಸಂಭಾಷಣೆ ಮತ್ತು ಮಾಹಿತಿ ಲೋಡ್ ಆಗಬಹುದು.",
      installText: "ಕಿಸಾನ್ ಮಿತ್ರ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ",
      installSub: "ಆಂಡ್ರಾಯ್ಡ್ ಕ್ರೋಮ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ.",
      installBtn: "ಇನ್‌ಸ್ಟಾಲ್",
      shortcuts: "ತ್ವರಿತ ಶಾರ್ಟ್‌ಕಟ್‌ಗಳು",
      cropAdvisory: "ಬೆಳೆ ರೋಗ",
      cropAdvisorySub: "ಲಕ್ಷಣಗಳು, ಚಿಕಿತ್ಸೆ ಮತ್ತು ತಡೆಗಟ್ಟುವಿಕೆ ಕಾರ್ಡ್‌ಗಳು.",
      marketPrices: "ಮಾರುಕಟ್ಟೆ ದರಗಳು",
      marketPricesSub: "ಮಂಡಿ ದರಗಳು ಮತ್ತು ಬೆಲೆ ಏರಿಳಿತಗಳು.",
      govtSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      govtSchemesSub: "ಅರ್ಹತೆ ಮತ್ತು ಅಗತ್ಯ ದಾಖಲೆಗಳ ವಿವರಗಳು.",
      weatherTitle: "ಹವಾಮಾನ",
      weatherSub: "ನೀರಾವರಿ ಸುಳಿವುಗಳು ಮತ್ತು ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ.",
      historyTitle: "ಇತಿಹಾಸ",
      historySub: "ಹಿಂದಿನ ಸಂಭಾಷಣೆಗಳು ಮತ್ತು ಉಳಿಸಿದ ಉತ್ತರಗಳು.",
    }
  };

  const t = strings[language as keyof typeof strings] || strings.en;

  const handleFakeInstall = () => {
    alert("Kisan Mitra is PWA-capable! On Android Chrome, tap the 3-dots menu -> 'Add to Home screen' or 'Install App' to use it offline.");
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Welcome Banner */}
      <motion.div 
        id="welcome-banner"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-brand-primary to-brand-accent-dark text-white rounded-3xl p-6 md:p-8 shadow-md overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10">
          <Sprout size={280} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/10 px-3 py-1 rounded-full text-green-100">
            AI-Based Agricultural Advisory System
          </span>
          <h1 className="text-3xl md:text-4xl font-black font-sans mt-3 tracking-tight">
            {userName ? `${language === "hi" ? "स्वागत है, " : language === "kn" ? "ಸ್ವಾಗತ, " : "Welcome, "}${userName}!` : t.welcome}
          </h1>
          <p className="text-green-100/90 text-sm md:text-base mt-2 font-medium">
            {t.sub}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              id="dash-btn-ask"
              onClick={() => onNavigate("ask")}
              className="bg-white text-brand-primary hover:bg-brand-bg font-bold px-6 py-3 rounded-xl transition shadow-md text-sm cursor-pointer"
            >
              {t.askBtn} &rarr;
            </button>
            <button 
              id="dash-btn-voice"
              onClick={() => onNavigate("voice")}
              className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition text-sm cursor-pointer"
            >
              {t.voiceBtn}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Offline capability banner */}
      <div 
        id="offline-banner" 
        className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs md:text-sm shadow-xs"
      >
        <span className="flex-shrink-0 animate-pulse text-amber-600">📡</span>
        <p className="font-semibold">{t.offlineNotice}</p>
      </div>

      {/* Main Grid: PWA Install + Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PWA Promo Card */}
        <div id="pwa-install-card" className="bg-white border border-slate-100 dark:border-gray-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <span className="text-2xl">📱</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.installText}</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.installSub}</p>
            </div>
          </div>
          <button 
            id="install-pwa-button"
            onClick={handleFakeInstall}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-4 rounded-xl transition text-sm shadow-sm cursor-pointer"
          >
            <Download size={16} />
            {t.installBtn}
          </button>
        </div>

        {/* Dashboard Weather Widget */}
        <div id="weather-promo-card" className="bg-white border border-slate-100 dark:border-gray-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <CloudSun size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Weather Advisory</h3>
              <p className="text-xs text-green-600 font-bold mt-1">✓ Perfect spraying weather</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Clear skies, ideal humidity (54%) for neem spray.</p>
            </div>
          </div>
          <button 
            id="weather-promo-btn"
            onClick={() => onNavigate("weather")}
            className="mt-4 text-brand-primary text-xs font-bold hover:underline text-left cursor-pointer"
          >
            Check 7-day forecast &rarr;
          </button>
        </div>

        {/* Dashboard Market Widget */}
        <div id="market-promo-card" className="bg-white border border-slate-100 dark:border-gray-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <LineChart size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Today's Mandi Highlight</h3>
              <p className="text-xs text-slate-800 mt-1 font-bold">Wheat (Indore): <span className="text-green-600 font-extrabold">₹2,450 ▲</span></p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Arrivals are high, prices stable.</p>
            </div>
          </div>
          <button 
            id="market-promo-btn"
            onClick={() => onNavigate("market")}
            className="mt-4 text-brand-primary text-xs font-bold hover:underline text-left cursor-pointer"
          >
            View all crop rates &rarr;
          </button>
        </div>

      </div>

      {/* Grid of Shortcuts */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">{t.shortcuts}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Ask AI */}
          <div className="bg-white border border-slate-100 dark:border-gray-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 w-fit bg-brand-bg text-brand-primary rounded-xl mb-3">
                <span className="text-lg">🤖</span>
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">{language === "hi" ? "एआई से बातचीत" : language === "kn" ? "ಎಐ ಸಹಾಯ" : "Ask AI"}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.cropAdvisorySub.replace("Symptoms", "Text or voice advisory")}</p>
            </div>
            <button 
              onClick={() => onNavigate("ask")} 
              className="mt-4 text-brand-primary font-bold text-xs border border-brand-bg bg-brand-bg/40 hover:bg-brand-bg px-4 py-2 rounded-xl w-fit transition cursor-pointer"
            >
              Open
            </button>
          </div>

          {/* Voice Assistant */}
          <div className="bg-white border border-slate-100 dark:border-gray-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 w-fit bg-brand-bg text-brand-primary rounded-xl mb-3">
                <span className="text-lg">🎙️</span>
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">{language === "hi" ? "आवाज़ सहायक" : language === "kn" ? "ಧ್ವನಿ ಸಹಾಯ" : "Voice Assistant"}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.cropAdvisorySub.replace("Symptoms", "Large hold-to-speak experience for field use")}</p>
            </div>
            <button 
              onClick={() => onNavigate("voice")} 
              className="mt-4 text-brand-primary font-bold text-xs border border-brand-bg bg-brand-bg/40 hover:bg-brand-bg px-4 py-2 rounded-xl w-fit transition cursor-pointer"
            >
              Open
            </button>
          </div>

          {/* Weather */}
          <div className="bg-white border border-slate-100 dark:border-gray-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 w-fit bg-amber-50 text-amber-700 rounded-xl mb-3">
                <CloudSun size={18} />
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">{t.weatherTitle}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.weatherSub}</p>
            </div>
            <button 
              onClick={() => onNavigate("weather")} 
              className="mt-4 text-brand-primary font-bold text-xs border border-brand-bg bg-brand-bg/40 hover:bg-brand-bg px-4 py-2 rounded-xl w-fit transition cursor-pointer"
            >
              Open
            </button>
          </div>

          {/* Market */}
          <div className="bg-white border border-slate-100 dark:border-gray-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 w-fit bg-brand-bg text-brand-primary rounded-xl mb-3">
                <LineChart size={18} />
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">{t.marketPrices}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.marketPricesSub}</p>
            </div>
            <button 
              onClick={() => onNavigate("market")} 
              className="mt-4 text-brand-primary font-bold text-xs border border-brand-bg bg-brand-bg/40 hover:bg-brand-bg px-4 py-2 rounded-xl w-fit transition cursor-pointer"
            >
              Open
            </button>
          </div>

          {/* Disease */}
          <div className="bg-white border border-slate-100 dark:border-gray-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 w-fit bg-brand-bg text-brand-primary rounded-xl mb-3">
                <Sprout size={18} />
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">{t.cropAdvisory}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.cropAdvisorySub}</p>
            </div>
            <button 
              onClick={() => onNavigate("disease")} 
              className="mt-4 text-brand-primary font-bold text-xs border border-brand-bg bg-brand-bg/40 hover:bg-brand-bg px-4 py-2 rounded-xl w-fit transition cursor-pointer"
            >
              Open
            </button>
          </div>

          {/* Schemes */}
          <div className="bg-white border border-slate-100 dark:border-gray-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 w-fit bg-brand-bg text-brand-primary rounded-xl mb-3">
                <FileText size={18} />
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">{t.govtSchemes}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.govtSchemesSub}</p>
            </div>
            <button 
              onClick={() => onNavigate("schemes")} 
              className="mt-4 text-brand-primary font-bold text-xs border border-brand-bg bg-brand-bg/40 hover:bg-brand-bg px-4 py-2 rounded-xl w-fit transition cursor-pointer"
            >
              Open
            </button>
          </div>

          {/* History */}
          <div className="bg-white border border-slate-100 dark:border-gray-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-2.5 w-fit bg-brand-bg text-brand-primary rounded-xl mb-3">
                <HistoryIcon size={18} />
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">{t.historyTitle}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{t.historySub}</p>
            </div>
            <button 
              onClick={() => onNavigate("history")} 
              className="mt-4 text-brand-primary font-bold text-xs border border-brand-bg bg-brand-bg/40 hover:bg-brand-bg px-4 py-2 rounded-xl w-fit transition cursor-pointer"
            >
              Open
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
