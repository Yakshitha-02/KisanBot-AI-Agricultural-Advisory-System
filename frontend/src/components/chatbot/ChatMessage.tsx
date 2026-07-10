import { motion } from 'framer-motion';
import { FiCpu, FiUser } from 'react-icons/fi';

interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: ChatMessageItem;
  isTyping?: boolean;
}

function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[85%] items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isUser ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {isUser ? <FiUser size={16} /> : <FiCpu size={16} />}
        </div>

        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-emerald-600 text-white'
              : 'border border-emerald-100 bg-white text-slate-700'
          }`}
        >
          {isTyping ? (
            <div className='flex items-center gap-1 py-1'>
              <span className='h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.2s]' />
              <span className='h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.1s]' />
              <span className='h-2 w-2 animate-bounce rounded-full bg-emerald-500' />
            </div>
          ) : (
            <p className='whitespace-pre-wrap text-sm leading-6'>{message.content}</p>
          )}

          {!isTyping && (
            <p className={`mt-2 text-[11px] ${isUser ? 'text-emerald-100' : 'text-slate-400'}`}>
              {message.timestamp}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ChatMessage;
