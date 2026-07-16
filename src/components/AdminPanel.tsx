import React, { useState, useEffect } from "react";
import { LineChart, Users, AlertTriangle, BookOpen, Check, ThumbsUp, ThumbsDown, Database, Plus, RefreshCw, Star } from "lucide-react";

export default function AdminPanel() {
  const [metrics, setMetrics] = useState({
    totalQueries: 0,
    byLanguage: { en: 0, hi: 0, kn: 0 },
    byIntent: { crop_advisory: 0, weather: 0, market_prices: 0, scheme_lookup: 0, pest_control: 0 },
    satisfactionRate: "100%",
    flaggedIssues: 0,
    unansweredCount: 0
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for adding dynamic KB items
  const [kbCategory, setKbCategory] = useState("crop");
  const [kbQuestion, setKbQuestion] = useState("");
  const [kbAnswer, setKbAnswer] = useState("");
  const [kbLang, setKbLang] = useState("en");
  const [kbTags, setKbTags] = useState("");
  const [submittingKb, setSubmittingKb] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [mRes, lRes] = await Promise.all([
        fetch("/api/admin/metrics"),
        fetch("/api/admin/logs")
      ]);
      if (mRes.ok && lRes.ok) {
        const mData = await mRes.json();
        const lData = await lRes.json();
        setMetrics(mData);
        setLogs(lData);
      }
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleFlag = async (logId: string) => {
    try {
      const res = await fetch("/api/admin/logs/flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error toggling flag", err);
    }
  };

  const handleAddKb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbQuestion.trim() || !kbAnswer.trim()) {
      alert("Please fill in both Question and Answer fields.");
      return;
    }

    setSubmittingKb(true);
    try {
      const res = await fetch("/api/admin/kb/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: kbCategory,
          question: kbQuestion,
          answer: kbAnswer,
          language: kbLang,
          tags: kbTags.split(",").map(t => t.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        alert("Success! The factual entry has been injected into Kisan Mitra's vector RAG pipeline dynamically. Farmers can now get answers grounded in this fact instantly!");
        setKbQuestion("");
        setKbAnswer("");
        setKbTags("");
        fetchAdminData();
      } else {
        throw new Error("Failed to enrich KB");
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmittingKb(false);
    }
  };

  return (
    <div id="admin-view" className="space-y-8">
      
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Agricultural Worker Admin Console</h2>
          <p className="text-xs text-gray-500">Monitor RAG query telemetry, audit flagged inaccurate answers, and inject crop advisory rules dynamically.</p>
        </div>
        
        <button
          id="admin-refresh-btn"
          onClick={fetchAdminData}
          className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl transition"
        >
          <RefreshCw size={13} />
          Refresh Stats
        </button>
      </div>

      {/* Metrics Grid Cards */}
      <div id="admin-metrics-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Farmer Queries</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Database size={14} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{metrics.totalQueries}</p>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farmer Satisfaction</span>
            <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <Star size={14} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{metrics.satisfactionRate}</p>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Flagged Issues</span>
            <div className="p-1.5 bg-red-50 text-red-700 rounded-lg">
              <AlertTriangle size={14} />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{metrics.flaggedIssues}</p>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-3xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Low Confidence (RAG)</span>
            <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <BookOpen size={14} />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-500">{metrics.unansweredCount}</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Telemetry Log List */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Farmer Query Telemetry Log</h3>
          
          <div className="divide-y divide-gray-50 overflow-y-auto max-h-[500px] space-y-3 pr-2 scrollbar-thin">
            {logs.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-12">No query telemetry logs recorded yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md mr-2">{log.language.toUpperCase()}</span>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">{log.intent}</span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50 space-y-1.5 text-xs">
                    <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <span>👤</span> "{log.query}"
                    </p>
                    <p className="text-gray-600 pl-4 border-l-2 border-emerald-500">
                      {log.response}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                    <div className="flex items-center gap-3">
                      <span>RAG Confidence: <b className="font-mono text-gray-800">{Math.round(log.confidence * 100)}%</b></span>
                      {log.satisfaction === "up" ? (
                        <span className="text-emerald-600 flex items-center gap-0.5"><ThumbsUp size={10} /> Upvoted</span>
                      ) : log.satisfaction === "down" ? (
                        <span className="text-rose-600 flex items-center gap-0.5"><ThumbsDown size={10} /> Downvoted</span>
                      ) : null}
                    </div>

                    <button
                      onClick={() => handleToggleFlag(log.id)}
                      className={`px-2 py-1 rounded-md font-bold transition ${
                        log.flagged 
                          ? "bg-red-50 text-red-700 hover:bg-red-100" 
                          : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {log.flagged ? "⚠️ Flagged (Click to Unflag)" : "Flag for audit"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enrich KB Dynamic Form */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
          <form onSubmit={handleAddKb} className="space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Database size={16} className="text-emerald-600" />
              Enrich Knowledge Base
            </h3>
            <p className="text-[11px] text-gray-500">Correct inaccurate answers or add new verified ICAR crop advice here.</p>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Category</label>
              <select
                value={kbCategory}
                onChange={(e) => setKbCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
              >
                <option value="crop">Crop Management</option>
                <option value="weather">Weather Guidelines</option>
                <option value="price">Mandi Prices</option>
                <option value="scheme">Govt Scheme</option>
                <option value="pest">Pest & Disease Control</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Language</label>
              <select
                value={kbLang}
                onChange={(e) => setKbLang(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Question / Fact Key</label>
              <input
                type="text"
                value={kbQuestion}
                onChange={(e) => setKbQuestion(e.target.value)}
                placeholder="e.g. Rice stem borer remedy"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Verified Factual Answer</label>
              <textarea
                value={kbAnswer}
                onChange={(e) => setKbAnswer(e.target.value)}
                placeholder="Write the safe scientific advice here..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Search Tags (comma separated)</label>
              <input
                type="text"
                value={kbTags}
                onChange={(e) => setKbTags(e.target.value)}
                placeholder="e.g. rice, borer, pest"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <button
              id="submit-enrich-kb-btn"
              type="submit"
              disabled={submittingKb}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition text-xs shadow-2xs disabled:opacity-50"
            >
              <Plus size={14} />
              {submittingKb ? "Injecting Factual Advice..." : "Inject Factual Entry"}
            </button>
          </form>

          <p className="text-[9px] text-gray-400 italic text-center mt-4">
            Changes immediately alter active RAG lookup databases dynamically on the server.
          </p>
        </div>

      </div>

    </div>
  );
}
