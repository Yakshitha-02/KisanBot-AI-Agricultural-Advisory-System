import React, { useState } from "react";
import { GOVERNMENT_SCHEMES } from "../kbData";
import { FileText, CheckSquare, Square, Info, ShieldCheck, Download, Check } from "lucide-react";

export default function GovernmentSchemes() {
  const [selectedScheme, setSelectedScheme] = useState(GOVERNMENT_SCHEMES[0]);
  const [checklistState, setChecklistState] = useState<{ [key: string]: boolean }>({});

  const toggleCheck = (item: string) => {
    setChecklistState((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleApplySim = (url: string) => {
    alert(`Redirecting you safely to government scheme website: ${url}\nEnsure you have all checked documents ready!`);
  };

  const allEligibleChecked = selectedScheme.eligibility.every(
    (item) => checklistState[item] === true
  );

  return (
    <div id="schemes-view" className="space-y-6">
      
      {/* Title block */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Government Subsidy & Scheme Advisor</h2>
        <p className="text-xs text-gray-500">Eligibility snapshots, required documents checklists, and fast interactive eligibility checkers.</p>
      </div>

      {/* Main Grid: Schemes List + Detail Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left hand schemes list */}
        <div className="md:col-span-1 space-y-3">
          {GOVERNMENT_SCHEMES.map((sch) => (
            <button
              key={sch.id}
              id={`scheme-select-${sch.id}`}
              onClick={() => {
                setSelectedScheme(sch);
                setChecklistState({}); // reset eligibility ticks
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedScheme.id === sch.id 
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                  : "bg-white border-gray-100 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${selectedScheme.id === sch.id ? "bg-emerald-700 text-emerald-100" : "bg-emerald-50 text-emerald-700"}`}>
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm">{sch.id.toUpperCase().replace("-", " ")}</h4>
                  <p className={`text-[10px] mt-1 leading-relaxed line-clamp-2 ${selectedScheme.id === sch.id ? "text-emerald-100" : "text-gray-400"}`}>
                    {sch.name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right hand scheme details with interactive check */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Official Scheme Details</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">{selectedScheme.name}</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {selectedScheme.description}
              </p>
            </div>

            {/* Benefits box */}
            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-4 space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                🎁 Benefits Outline
              </h4>
              <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                {selectedScheme.benefits}
              </p>
            </div>

            {/* Eligibility Interactive Questionnaire */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Interactive Eligibility Check</h4>
              <p className="text-[11px] text-gray-500">Tick each condition that applies to your family:</p>
              
              <div id="eligibility-checklist" className="space-y-2">
                {selectedScheme.eligibility.map((item, idx) => {
                  const checked = !!checklistState[item];
                  return (
                    <button
                      key={idx}
                      id={`eligibility-tick-${idx}`}
                      onClick={() => toggleCheck(item)}
                      className="w-full text-left flex items-start gap-2.5 p-2.5 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className={`mt-0.5 text-emerald-600`}>
                        {checked ? <CheckSquare size={16} /> : <Square size={16} />}
                      </div>
                      <span className="text-xs font-medium text-gray-700 leading-normal">{item}</span>
                    </button>
                  );
                })}
              </div>

              {/* Eligibility results badge */}
              <div className={`p-3 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                allEligibleChecked 
                  ? "bg-green-100 text-green-800" 
                  : "bg-amber-100 text-amber-800"
              }`}>
                {allEligibleChecked ? (
                  <>
                    <ShieldCheck size={16} />
                    <span>Based on your selections, you appear ELIGIBLE!</span>
                  </>
                ) : (
                  <>
                    <Info size={16} />
                    <span>Please tick all conditions above to verify estimated eligibility.</span>
                  </>
                )}
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Required Application Documents</h4>
              <div id="documents-checklist" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedScheme.documentsRequired.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs font-semibold text-gray-700">
                    <Check size={14} className="text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Call to action footer buttons */}
          <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-3 items-center justify-between">
            <span className="text-[10px] text-gray-400">Apply online safely with zero middleman charges.</span>
            
            <button
              id="apply-scheme-link"
              onClick={() => handleApplySim(selectedScheme.link)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
            >
              <Download size={14} />
              Visit Application Portal
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
