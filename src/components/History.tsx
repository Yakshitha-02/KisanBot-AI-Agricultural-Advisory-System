import React from "react";
import { Message, ChatSession } from "../types";
import { History as HistoryIcon, MessageSquare, Trash2, Calendar, Bot, User } from "lucide-react";

interface HistoryProps {
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onClearHistory: () => void;
}

export default function History({ sessions, onSelectSession, onClearHistory }: HistoryProps) {
  return (
    <div id="history-view" className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans tracking-tight">Saved Advisory History</h2>
          <p className="text-xs text-gray-500">Review past crop advisory queries even when working offline in fields.</p>
        </div>
        
        {sessions.length > 0 && (
          <button
            id="clear-history-btn"
            onClick={onClearHistory}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            <Trash2 size={13} />
            Clear All
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-3xs max-w-md mx-auto">
          <div className="p-4 bg-gray-50 rounded-full text-gray-400">
            <HistoryIcon size={32} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm">No Saved Advisories</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your conversational history is automatically stored locally in your browser so you can access recommended solutions offline in remote regions. Start a conversation in **Ask AI** or **Voice Assistant** first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* History Lists list */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3 h-[420px] overflow-y-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 block">Conversational Logs</span>
            
            <div id="history-sessions-list" className="space-y-2">
              {sessions.map((sess) => (
                <button
                  key={sess.id}
                  id={`history-session-item-${sess.id}`}
                  onClick={() => onSelectSession(sess)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition flex items-start gap-3"
                >
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg mt-1 flex-shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-gray-800 truncate leading-snug">{sess.title}</h4>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-semibold">
                      <Calendar size={10} /> {new Date(sess.createdAt).toLocaleDateString()}
                    </p>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                      {sess.messages.length} messages
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick instructions preview panel */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs flex flex-col justify-between h-[420px] overflow-y-auto">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">History details</span>
              <h3 className="font-bold text-sm text-gray-800">Select a conversational advisory</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Click any saved conversation log in the left panel to review step-by-step diagnostic recipes, fertilizer guidelines, and government scheme checks offline on your Android browser.
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-50 text-[10px] text-gray-400 flex items-center gap-1.5">
              <span className="text-emerald-600">✓</span>
              <span>Protected by browser local sandbox cache. No private data is ever sent to marketing servers.</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
