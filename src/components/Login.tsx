import React, { useState } from "react";
import { Sprout, User, ShieldCheck, ArrowRight, Info, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { LoggedInUser, Language } from "../types";

interface LoginProps {
  onLogin: (user: LoggedInUser) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: "light" | "dark";
}

export default function Login({ onLogin, language, onLanguageChange, theme }: LoginProps) {
  const [role, setRole] = useState<"user" | "admin">("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const strings = {
    en: {
      title: "Kisan Mitra AI",
      subtitle: "AI-Based Intelligent Agricultural Advisory System",
      farmerTab: "Farmer Access",
      adminTab: "Officer Console",
      userLabel: "Farmer ID or Mobile Number",
      adminLabel: "Officer Username",
      passLabel: "Password",
      btnSignIn: "Sign In to Advisory",
      btnGuest: "Instant Guest Access",
      wrongCreds: "Invalid credentials. Please use the demo logins below.",
      credsTitle: "Demo Credentials for Testing",
      credsFarmer: "Farmer Login",
      credsAdmin: "Admin / Officer Login",
      credsNote: "Click any credential tag above to auto-fill the form fields.",
      placeholderUser: "e.g., farmer or 9876543210",
      placeholderAdmin: "e.g., admin",
      placeholderPass: "Enter password"
    },
    hi: {
      title: "किसान मित्र एआई",
      subtitle: "एआई-आधारित बुद्धिमान कृषि सलाहकार प्रणाली",
      farmerTab: "किसान लॉगिन",
      adminTab: "अधिकारी लॉगिन",
      userLabel: "किसान आईडी या मोबाइल नंबर",
      adminLabel: "अधिकारी यूज़रनेम",
      passLabel: "पासवर्ड",
      btnSignIn: "सलाहकार प्रणाली में प्रवेश करें",
      btnGuest: "अतिथि प्रवेश (त्वरित)",
      wrongCreds: "अमान्य क्रेडेंशियल्स। कृपया नीचे दिए गए डेमो लॉगिन का उपयोग करें।",
      credsTitle: "परीक्षण के लिए डेमो क्रेडेंशियल्स",
      credsFarmer: "किसान लॉगिन",
      credsAdmin: "अधिकारी / एडमिन लॉगिन",
      credsNote: "फ़ील्ड को स्वचालित रूप से भरने के लिए ऊपर किसी भी टैग पर क्लिक करें।",
      placeholderUser: "जैसे: farmer या 9876543210",
      placeholderAdmin: "जैसे: admin",
      placeholderPass: "पासवर्ड दर्ज करें"
    },
    kn: {
      title: "ಕಿಸಾನ್ ಮಿತ್ರ ಎಐ",
      subtitle: "ಎಐ-ಆಧಾರಿತ ಬುದ್ಧಿವಂತ ಕೃಷಿ ಸಲಹಾ ವ್ಯವಸ್ಥೆ",
      farmerTab: "ರೈತರ ಲಾಗಿನ್",
      adminTab: "ಅಧಿಕಾರಿ ಲಾಗಿನ್",
      userLabel: "ರೈತರ ಐಡಿ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      adminLabel: "ಅಧಿಕಾರಿಯ ಬಳಕೆದಾರ ಹೆಸರು",
      passLabel: "ಪಾಸ್‌ವರ್ಡ್",
      btnSignIn: "ಸಲಹಾ ವ್ಯವಸ್ಥೆಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ",
      btnGuest: "ಅತಿಥಿ ಪ್ರವೇಶ (ತ್ವರಿತ)",
      wrongCreds: "ಅಮಾನ್ಯ ರುಜುವಾತುಗಳು. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಡೆಮೊ ಲಾಗಿನ್‌ಗಳನ್ನು ಬಳಸಿ.",
      credsTitle: "ಪರೀಕ್ಷೆಗಾಗಿ ಡೆಮೊ ರುಜುವಾತುಗಳು",
      credsFarmer: "ರೈತರ ಲಾಗಿನ್",
      credsAdmin: "ಅಧಿಕಾರಿ / ಅಡ್ಮಿನ್ ಲಾಗಿನ್",
      credsNote: "ಫೀಲ್ಡ್‌ಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ತುಂಬಲು ಮೇಲಿನ ಯಾವುದೇ ಟ್ಯಾಗ್ ಕ್ಲಿಕ್ ಮಾಡಿ.",
      placeholderUser: "ಉದಾ: farmer ಅಥವಾ 9876543210",
      placeholderAdmin: "ಉದಾ: admin",
      placeholderPass: "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ"
    }
  };

  const t = strings[language] || strings.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError(language === "hi" ? "कृपया सभी फ़ील्ड भरें।" : language === "kn" ? "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ." : "Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    // Simulate database network check
    setTimeout(() => {
      setIsLoading(false);
      const isUserMatch = role === "user" && username.toLowerCase() === "farmer" && password === "farmer123";
      const isAdminMatch = role === "admin" && username.toLowerCase() === "admin" && password === "admin123";

      if (isUserMatch) {
        onLogin({
          username: "farmer",
          role: "user",
          name: language === "hi" ? "राम सिंह" : language === "kn" ? "ರಾಮ್ ಸಿಂಗ್" : "Ram Singh"
        });
      } else if (isAdminMatch) {
        onLogin({
          username: "admin",
          role: "admin",
          name: language === "hi" ? "डॉ. पाटिल (कृषि अधिकारी)" : language === "kn" ? "ಡಾ. ಪಾಟೀಲ್ (ಕೃಷಿ ಅಧಿಕಾರಿ)" : "Dr. Patil (Agri Officer)"
        });
      } else {
        setError(t.wrongCreds);
      }
    }, 600);
  };

  const handleQuickLogin = (selectedRole: "user" | "admin") => {
    setError("");
    setRole(selectedRole);
    if (selectedRole === "user") {
      setUsername("farmer");
      setPassword("farmer123");
    } else {
      setUsername("admin");
      setPassword("admin123");
    }
  };

  const handleGuestLogin = () => {
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        username: "guest_farmer",
        role: "user",
        name: language === "hi" ? "अतिथि किसान" : language === "kn" ? "ಅತಿಥಿ ರೈತ" : "Guest Farmer"
      });
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 bg-brand-bg dark:bg-gray-950 font-sans transition-colors duration-200">
      
      {/* Top Header: Language toggle only */}
      <header className="w-full max-w-4xl mx-auto flex justify-end items-center mb-4">
        <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-slate-200/40 dark:border-gray-800/80 p-1 rounded-xl shadow-xs">
          {(["en", "hi", "kn"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === lang 
                  ? "bg-brand-primary text-white shadow-xs" 
                  : "text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800"
              }`}
            >
              {lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : "ಕನ್ನಡ"}
            </button>
          ))}
        </div>
      </header>

      {/* Main Login Card Layout */}
      <main className="flex-1 flex items-center justify-center py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-slate-200/50 dark:border-gray-800/80 shadow-lg overflow-hidden p-6 md:p-8"
        >
          {/* Brand Identity Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="mx-auto w-14 h-14 bg-brand-bg dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-brand-primary dark:text-green-400 shadow-xs border border-emerald-100/50 dark:border-emerald-900/30">
              <Sprout size={32} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{t.title}</h1>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold max-w-xs mx-auto leading-relaxed">{t.subtitle}</p>
            </div>
          </div>

          {/* Role Switching Custom Tab List */}
          <div className="flex bg-brand-bg/50 dark:bg-gray-950/60 p-1 rounded-2xl mb-6 border border-emerald-100/20 dark:border-gray-800/50">
            <button
              type="button"
              onClick={() => {
                setRole("user");
                setError("");
                setUsername("");
                setPassword("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                role === "user"
                  ? "bg-white dark:bg-gray-900 text-brand-primary dark:text-green-400 shadow-sm border border-emerald-100/40 dark:border-gray-800/30"
                  : "text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200"
              }`}
            >
              <User size={14} />
              {t.farmerTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError("");
                setUsername("");
                setPassword("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                role === "admin"
                  ? "bg-white dark:bg-gray-900 text-brand-primary dark:text-green-400 shadow-sm border border-emerald-100/40 dark:border-gray-800/30"
                  : "text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200"
              }`}
            >
              <ShieldCheck size={14} />
              {t.adminTab}
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Inline Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-200 p-3 rounded-xl text-xs font-semibold leading-relaxed"
              >
                {error}
              </motion.div>
            )}

            {/* Username/ID Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block">{role === "user" ? t.userLabel : t.adminLabel}</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === "user" ? t.placeholderUser : t.placeholderAdmin}
                  className="w-full bg-brand-canvas dark:bg-gray-950 border border-slate-200 dark:border-gray-800 focus:border-brand-primary dark:focus:border-brand-accent focus:ring-1 focus:ring-brand-primary outline-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-gray-100 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block">{t.passLabel}</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.placeholderPass}
                  className="w-full bg-brand-canvas dark:bg-gray-950 border border-slate-200 dark:border-gray-800 focus:border-brand-primary dark:focus:border-brand-accent focus:ring-1 focus:ring-brand-primary outline-none rounded-xl pl-4 pr-11 py-3 text-sm font-semibold text-slate-800 dark:text-gray-100 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-400 dark:text-gray-500 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-4 rounded-xl transition text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                ) : (
                  <>
                    <span>{t.btnSignIn}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {role === "user" && (
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                  className="w-full bg-slate-50 dark:bg-gray-800/40 hover:bg-slate-100 dark:hover:bg-gray-800 border border-slate-200/50 dark:border-gray-800 text-slate-700 dark:text-gray-300 font-bold py-2.5 px-4 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{t.btnGuest}</span>
                </button>
              )}
            </div>
          </form>

          {/* Quick Info & Demo credentials helper box */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-gray-800 space-y-3">
            <div className="flex gap-1.5 items-start text-[11px] text-slate-500 dark:text-gray-400 leading-normal">
              <Info size={14} className="text-brand-primary dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-700 dark:text-gray-300">{t.credsTitle}</span>
                <span className="text-[10px] opacity-80">{t.credsNote}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("user")}
                className="bg-brand-bg hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-2.5 text-left transition cursor-pointer"
              >
                <span className="text-[10px] font-bold text-brand-primary dark:text-green-400 block uppercase tracking-wider">{t.credsFarmer}</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-gray-200 block mt-0.5">farmer</span>
                <span className="text-[10px] text-slate-500 dark:text-gray-400 block mt-0.5">pass: farmer123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30 rounded-xl p-2.5 text-left transition cursor-pointer"
              >
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 block uppercase tracking-wider">{t.credsAdmin}</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-gray-200 block mt-0.5">admin</span>
                <span className="text-[10px] text-slate-500 dark:text-gray-400 block mt-0.5">pass: admin123</span>
              </button>
            </div>
          </div>

        </motion.div>
      </main>

      {/* Humble Footer */}
      <footer className="w-full text-center py-4 text-[10px] text-slate-400 dark:text-gray-600 font-semibold uppercase tracking-wider">
        Kisan Mitra AI • Secured Field Client
      </footer>

    </div>
  );
}
