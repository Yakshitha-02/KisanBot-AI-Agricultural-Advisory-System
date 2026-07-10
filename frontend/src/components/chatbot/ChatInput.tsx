import { FormEvent, useState } from 'react';
import { FiSend, FiMic } from "react-icons/fi";
interface ChatInputProps {
  onSend: (message: string) => void;
  onVoice: () => void;
  isLoading: boolean;
}

function ChatInput({
  onSend,
  onVoice,
  isLoading,
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed || isLoading) {
      return;
    }

    onSend(trimmed);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className='flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm'>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder='Ask about crops, weather, soil, or market prices…'
        className='flex-1 border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400'
        disabled={isLoading}
      />
      <button
  type="button"
  onClick={onVoice}
  disabled={isLoading}
  className="rounded-xl border border-emerald-200 p-2 text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed"
>
  <FiMic size={20} />
</button>
      <button
        type='submit'
        disabled={isLoading || !input.trim()}
        className='flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300'
      >
        <FiSend size={16} />
        Send
      </button>
    </form>
  );
}

export default ChatInput;
