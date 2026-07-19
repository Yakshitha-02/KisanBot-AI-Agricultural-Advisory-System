import React, { useState } from "react";
import { CROP_DISEASES } from "../kbData";
import { Sprout, CheckCircle2, ShieldAlert, HeartPulse, Info, HelpCircle } from "lucide-react";

export default function CropDisease() {
  const [selectedDisease, setSelectedDisease] = useState(CROP_DISEASES[0]);
  const [activeTab, setActiveTab] = useState<"symptoms" | "treatment" | "prevention">("symptoms");

  return (
    <div id="crop-disease-view" className="space-y-6">
      
      {/* Title block */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Crop Disease Diagnosis Manual</h2>
        <p className="text-xs text-gray-500">Quick-acting diagnostic templates, recommended dosages, and preventive agricultural measures.</p>
      </div>

      {/* Main Grid: Disease Selector + Detail Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Hand: Disease list selection */}
        <div className="md:col-span-1 space-y-3">
          {CROP_DISEASES.map((dis, idx) => (
            <button
              key={idx}
              id={`disease-select-${idx}`}
              onClick={() => {
                setSelectedDisease(dis);
                setActiveTab("symptoms");
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedDisease.name === dis.name 
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                  : "bg-white border-gray-100 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedDisease.name === dis.name ? "bg-emerald-700 text-emerald-100" : "bg-emerald-50 text-emerald-700"}`}>
                  <Sprout size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm">{dis.name}</h4>
                  <span className={`text-[10px] block font-semibold mt-0.5 ${selectedDisease.name === dis.name ? "text-emerald-200" : "text-gray-400"}`}>
                    Affects: {dis.crop}
                  </span>
                </div>
              </div>
            </button>
          ))}
          
          {/* Custom crop advice helper */}
          <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4 space-y-1">
            <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle size={12} /> Unknown Disease?
            </h5>
            <p className="text-[11px] text-amber-950 leading-relaxed">
              If your crop symptom is not listed, tap **Ask AI** or **Voice Assistant** and describe the colors and spots in your local language to get instant diagnostic answers.
            </p>
          </div>
        </div>

        {/* Right Hand: Detailed view */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* Header / Meta */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Crop: {selectedDisease.crop}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{selectedDisease.name}</h3>
              </div>
              
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <ShieldAlert size={20} />
              </div>
            </div>

            {/* Illustrative mockup card */}
            <div className="bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl p-4 text-center border border-emerald-100/30 flex items-center justify-center gap-2">
              <span className="text-lg">🍃</span>
              <span className="text-xs font-semibold text-emerald-800 italic uppercase">Illustrative: "{selectedDisease.imagePrompt}"</span>
            </div>

            {/* Sub Tabs for detail */}
            <div className="flex border-b border-gray-100">
              {(["symptoms", "treatment", "prevention"] as const).map((tab) => (
                <button
                  key={tab}
                  id={`disease-tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-bold capitalize transition ${
                    activeTab === tab 
                      ? "border-b-2 border-emerald-600 text-emerald-700" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="pt-2">
              {activeTab === "symptoms" && (
                <div id="disease-symptoms-list" className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Signs</h4>
                  {selectedDisease.symptoms.map((sym, index) => (
                    <div key={index} className="flex gap-2.5 text-xs text-gray-700 leading-relaxed font-medium">
                      <span className="text-rose-500 font-bold mt-0.5">•</span>
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "treatment" && (
                <div id="disease-treatment-list" className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Emergency Remedies & Fungicides</h4>
                  {selectedDisease.treatment.map((treat, index) => (
                    <div key={index} className="flex gap-2.5 text-xs text-gray-700 leading-relaxed font-medium bg-emerald-50/30 border border-emerald-100/20 p-2.5 rounded-lg">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>{treat}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "prevention" && (
                <div id="disease-prevention-list" className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Agronomic Preventive Measures</h4>
                  {selectedDisease.prevention.map((prev, index) => (
                    <div key={index} className="flex gap-2.5 text-xs text-gray-700 leading-relaxed font-medium">
                      <span className="text-blue-500 font-bold mt-0.5">✓</span>
                      <span>{prev}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2 text-[10px] text-gray-400">
            <HeartPulse size={12} className="text-rose-400" />
            <span>Follow chemical dosage boundaries exactly. Wear dynamic face shield and protective gear during spraying.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
