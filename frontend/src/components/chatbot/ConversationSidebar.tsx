import {
  FiEdit2,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { useMemo, useState } from "react";

interface ConversationItem {
  id: string;
  title: string;
  preview: string;
}

interface ConversationSidebarProps {
  conversations: ConversationItem[];
  activeConversationId: string |null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
}

function ConversationSidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
}: ConversationSidebarProps) {

  const [search,setSearch]=useState("");

  const filteredConversations=useMemo(()=>{
      return conversations.filter(c=>
          c.title.toLowerCase().includes(search.toLowerCase())
      );
  },[conversations,search]);

  return (
    <aside className="flex h-full w-80 flex-col rounded-3xl border border-emerald-200 bg-white shadow-xl">

      {/* Header */}

      <div className="border-b border-emerald-100 p-5">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-emerald-700">
              🌾 KisanBot
            </h2>

            <p className="text-xs text-slate-500">
              AI Farming Assistant
            </p>

          </div>

          <button
            onClick={onNewChat}
            className="rounded-xl bg-emerald-600 p-3 text-white transition hover:scale-105 hover:bg-emerald-700"
          >
            <FiPlus size={18}/>
          </button>

        </div>

        {/* Search */}

        <div className="relative">

          <FiSearch className="absolute left-3 top-3 text-slate-400"/>

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 outline-none transition focus:border-emerald-400 focus:bg-white"
          />

        </div>

      </div>

      {/* Chats */}

      <div className="flex-1 overflow-y-auto p-4">

        {filteredConversations.length===0 ?(

          <div className="mt-10 text-center">

            <div className="text-5xl">
              🌱
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
              No conversations
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Ask your first farming question.
            </p>

          </div>

        ):(
          filteredConversations.map((conversation)=>{

            const active=
              conversation.id===activeConversationId;

            return(

              <div
                key={conversation.id}
                onClick={()=>onSelectConversation(conversation.id)}
                className={`group mb-3 cursor-pointer rounded-2xl border p-4 transition-all duration-300
                ${
                  active
                  ? "border-emerald-500 bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg"
                  :"border-slate-100 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
                }`}
              >

                <div className="flex items-start justify-between">

                  <div className="flex gap-3">

                    <div
                      className={`mt-1 rounded-lg p-2
                      ${
                        active
                        ?"bg-white/20"
                        :"bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      <FiMessageSquare/>
                    </div>

                    <div>

                      <h4 className="line-clamp-1 text-sm font-semibold">
                        {conversation.title}
                      </h4>

                      <p
                        className={`mt-1 line-clamp-2 text-xs
                        ${
                          active
                          ?"text-emerald-100"
                          :"text-slate-500"
                        }`}
                      >
                        {conversation.preview || "No preview available"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Actions */}

                <div
                  className={`mt-4 flex justify-end gap-2
                  ${
                    active
                    ?"opacity-100"
                    :"opacity-0 group-hover:opacity-100"
                  } transition`}
                >

                  <button
                    onClick={(e)=>{
                      e.stopPropagation();
                      onRenameConversation(
                        conversation.id,
                        conversation.title
                      );
                    }}
                    className={`rounded-lg p-2
                    ${
                      active
                      ?"hover:bg-white/20"
                      :"bg-white hover:bg-emerald-100"
                    }`}
                  >
                    <FiEdit2/>
                  </button>

                  <button
                    onClick={(e)=>{
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className={`rounded-lg p-2
                    ${
                      active
                      ?"hover:bg-red-500/30"
                      :"bg-white text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <FiTrash2/>
                  </button>

                </div>

              </div>

            );

          })
        )}

      </div>

      {/* Footer */}

      <div className="border-t border-slate-100 p-4">

        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 p-4 text-white">

          <h4 className="font-semibold">
            🌾 AI Assistant
          </h4>

          <p className="mt-1 text-xs text-emerald-100">
            Crop Diseases • Weather • Market Prices • Fertilizers
          </p>

        </div>

      </div>

    </aside>
  );
}

export default ConversationSidebar;