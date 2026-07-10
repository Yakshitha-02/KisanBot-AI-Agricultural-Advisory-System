import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: ChatMessageItem[];
  isLoading: boolean;
}

function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <section className='flex h-[560px] flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm'>
      <div className='border-b border-emerald-100 bg-emerald-50/70 px-5 py-4'>
        <h2 className='text-lg font-semibold text-emerald-800'>KisanBot Assistant</h2>
        <p className='text-sm text-slate-600'>Ask for crop advice, weather updates, and practical next steps.</p>
      </div>

      <div className='flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_40%)] p-5'>
        {messages.length === 0 ? (
          <div className='flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center text-slate-500'>
            <p className='text-lg font-medium text-slate-700'>Welcome to your farming assistant</p>
            <p className='mt-2 max-w-md text-sm'>Start with a question like “How can I protect my tomato crop from blight?”</p>
          </div>
        ) : (
          messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}

        {isLoading && <ChatMessage message={{ id: 'typing', role: 'assistant', content: '', timestamp: 'Thinking…' }} isTyping />}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}

export default ChatWindow;
