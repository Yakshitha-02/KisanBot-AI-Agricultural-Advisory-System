import { FiEdit2, FiMessageSquare, FiPlusCircle, FiTrash2 } from 'react-icons/fi';

interface ConversationItem {
  id: string;
  title: string;
  preview: string;
}

interface ConversationSidebarProps {
  conversations: ConversationItem[];
  activeConversationId: string | null;
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
  return (
    <aside className='flex h-full flex-col rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm'>
      <button
        onClick={onNewChat}
        className='flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100'
      >
        <FiPlusCircle />
        New chat
      </button>

      <div className='mt-5 flex-1 space-y-2 overflow-y-auto'>
        {conversations.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-emerald-200 bg-white/70 p-4 text-sm text-slate-500'>
            Start a new conversation to see your recent farming questions here.
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;

            return (
              <div
                key={conversation.id}
                className={`rounded-2xl border p-3 transition ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
                    : 'border-transparent bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-100/70'
                }`}
              >
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className='w-full text-left'
                >
                  <div className='flex items-center gap-2'>
                    <FiMessageSquare size={14} />
                    <span className='truncate text-sm font-medium'>{conversation.title}</span>
                  </div>
                  <p className={`mt-2 truncate text-xs ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {conversation.preview}
                  </p>
                </button>

                <div className='mt-3 flex items-center justify-end gap-2'>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onRenameConversation(conversation.id, conversation.title);
                    }}
                    className={`rounded-full p-2 transition ${
                      isActive ? 'bg-emerald-500/20 text-emerald-50 hover:bg-emerald-500/30' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                    aria-label={`Rename ${conversation.title}`}
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className={`rounded-full p-2 transition ${
                      isActive ? 'bg-white/20 text-emerald-50 hover:bg-white/30' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                    aria-label={`Delete ${conversation.title}`}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default ConversationSidebar;
