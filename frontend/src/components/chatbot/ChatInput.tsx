import { FormEvent, useState } from 'react';
import { FiSend, FiMic } from "react-icons/fi";

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoice: () => void;
  onStopRecording: () => void;
  isLoading: boolean;
  isRecording: boolean;
  online: boolean;
}

function ChatInput({
  onSend,
  onVoice,
  onStopRecording,
  isLoading,
  isRecording,
  online,
}: ChatInputProps)
 {
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
        placeholder={
  !online
    ? "📡 Offline — reconnect to ask new questions"
    : isRecording
      ? "🎙 Listening..."
      : "Ask about crops, weather, soil, or market prices..."
}
        className='flex-1 border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400'
        disabled={!online || isLoading || isRecording}
      />
      {isRecording ? (

<button
type="button"
onClick={onStopRecording}
className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 font-medium text-white animate-pulse hover:bg-red-600"
>

<div className="h-3 w-3 rounded-full bg-white animate-ping"/>

Stop Listening

</button>

) : (

<button
type="button"
onClick={onVoice}
disabled={!online || isLoading}
className="rounded-xl border border-emerald-200 p-2 text-emerald-600 hover:bg-emerald-50"
>

<FiMic size={20}/>

</button>

)}
      <button
        type='submit'
        disabled={!online || isLoading || !input.trim()}
        className='flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300'
      >
        <FiSend size={16} />
        Send
      </button>
    </form>
  );
}

export default ChatInput;
