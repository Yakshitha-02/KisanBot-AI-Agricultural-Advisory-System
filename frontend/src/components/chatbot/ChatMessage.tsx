import { motion } from "framer-motion";
import {
  FiCpu,
  FiUser,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiVolume2,
  FiCheck,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { feedbackService } from "../../services/feedback";
import { chatService } from "../../services/chat";

interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: ChatMessageItem;
  isTyping?: boolean;
}

function ChatMessage({
  message,
  isTyping = false,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  const [copied, setCopied] = useState(false);
  const [speaking,setSpeaking]=useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [comment, setComment] = useState("");

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const speak=()=>{

speechSynthesis.cancel();

const utterance=new SpeechSynthesisUtterance(
message.content
);

utterance.rate=1;

utterance.pitch=1;

utterance.onstart=()=>{

setSpeaking(true);

};

utterance.onend=()=>{

setSpeaking(false);

};

speechSynthesis.speak(utterance);

};
const stopSpeaking=()=>{

speechSynthesis.cancel();

setSpeaking(false);

};
useEffect(()=>{

return ()=>speechSynthesis.cancel();

},[]);
const handlePositive = async () => {
  try {
    await chatService.feedback({
      message_id: Number(message.id),
      rating: "positive",
      comment: "",
    });

    alert("Thank you for your feedback 🌾");
  } catch (err) {
    console.error(err);
    alert("Unable to submit feedback.");
  }
};
const handleNegative = async () => {
  try {
    await chatService.feedback({
      message_id: Number(message.id),
      rating: "negative",
      comment,
    });

    setShowDialog(false);

    setComment("");

    alert("Thank you for your feedback 🌾");

  } catch (err) {

    console.error(err);

    alert("Unable to submit feedback.");

  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-5xl gap-4 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md
          ${
            isUser
              ? "bg-emerald-600 text-white"
              : "bg-gradient-to-br from-emerald-500 to-green-700 text-white"
          }`}
        >
          {isUser ? <FiUser /> : <FiCpu />}
        </div>

        {/* Bubble */}

        <div className="flex flex-col">

          <div
            className={`rounded-3xl px-5 py-4 shadow
            ${
              isUser
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white"
            }`}
          >
            {isTyping ? (
              <div className="flex gap-2 py-2">

                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" />

                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.15s]" />

                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.3s]" />

              </div>
            ) : (
              <div
                className={`prose prose-sm max-w-none
                ${
                  isUser
                    ? "prose-invert"
                    : ""
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Footer */}

          {!isTyping && (
            <div className="mt-2 flex items-center justify-between px-2">

              <span className="text-xs text-slate-400">
                {message.timestamp}
              </span>

              {!isUser && (
                <div className="flex gap-2">

                  <button
                    onClick={copyMessage}
                    className="rounded-lg p-2 hover:bg-slate-100"
                  >
                    {copied ? (
                      <FiCheck className="text-green-600" />
                    ) : (
                      <FiCopy />
                    )}
                  </button>

                  {speaking ? (

<button
onClick={stopSpeaking}
className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
>

⏹ Stop

</button>

):(

<button
onClick={speak}
className="rounded-lg bg-emerald-100 px-3 py-2 text-emerald-700 hover:bg-emerald-200 flex items-center gap-2"
>

<FiVolume2/>

Speak

</button>

)}

                  <button
                    onClick={handlePositive}
                    className="rounded-lg p-2 hover:bg-slate-100"
                  >
                    <FiThumbsUp />
                  </button>

                  <button
                   onClick={() => setShowDialog(true)}
                   className="rounded-lg p-2 hover:bg-slate-100"
                   >

                   <FiThumbsDown/>

                   </button>

                </div>
              )}

            </div>
          )}

        </div>
      </div>
      {showDialog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">

      <h2 className="mb-4 text-lg font-semibold">

        Why wasn't this response helpful?

      </h2>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="h-32 w-full rounded-lg border p-3"
        placeholder="Tell us how we can improve..."
      />

      <div className="mt-4 flex justify-end gap-3">

        <button
          onClick={() => setShowDialog(false)}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>

        <button
          onClick={handleNegative}
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Submit
        </button>

      </div>

    </div>

  </div>
)}
    </motion.div>
  );
}

export default ChatMessage;