import { useRef, useState } from "react";
import { Mic, Square, Volume2, Languages } from "lucide-react";
import { voiceService } from "../../services/voice";

const VoiceAssistant = () => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");

  const [language, setLanguage] = useState("English");

  const [audioUrl, setAudioUrl] = useState("");

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder = new MediaRecorder(stream);

      mediaRecorder.current = recorder;

      chunks.current = [];

      recorder.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };

      recorder.start();

      setRecording(true);
    } catch (err) {
      alert("Unable to access microphone.");
      console.error(err);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorder.current) return;

    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = async () => {
      setRecording(false);

      setProcessing(true);

      const blob = new Blob(chunks.current, {
        type: "audio/wav",
      });

      const file = new File(
        [blob],
        "voice.wav",
        {
          type: "audio/wav",
        }
      );

      try {
        const response =
          await voiceService.sendVoice(
            file,
            language
          );

        setTranscript(response.transcript);

        setAnswer(response.answer);

        const url =
          `http://127.0.0.1:8000/${response.audio_file}`;

        setAudioUrl(url);

        const audio = new Audio(url);

        audio.play();
      } catch (err) {
        console.error(err);
        alert("Voice processing failed.");
      } finally {
        setProcessing(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">

      <div className="mx-auto max-w-5xl p-10">

        <h1 className="text-center text-5xl font-bold text-green-700">
          🎙 Kisan Voice Assistant
        </h1>

        <p className="mt-4 text-center text-gray-600">
          Speak naturally in your preferred language.
        </p>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

          <div className="flex items-center gap-3">

            <Languages size={24} />

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="rounded-lg border p-3"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Kannada</option>
              <option>Tamil</option>
              <option>Malayalam</option>
            </select>

          </div>

          <div className="mt-14 flex justify-center">

            {!recording ? (

              <button
                onClick={startRecording}
                className="flex h-36 w-36 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:scale-105 hover:bg-green-700"
              >
                <Mic size={60} />
              </button>

            ) : (

              <button
                onClick={stopRecording}
                className="animate-pulse flex h-36 w-36 items-center justify-center rounded-full bg-red-600 text-white shadow-lg"
              >
                <Square size={55} />
              </button>

            )}

          </div>

          <p className="mt-8 text-center text-lg font-semibold">

            {recording
              ? "🎤 Listening..."
              : processing
              ? "🤖 Processing..."
              : "Tap microphone to start speaking"}

          </p>

        {/* Transcript */}

{transcript && (
  <div className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-6">

    <h2 className="mb-3 text-xl font-bold text-green-700">
      🧑 You Said
    </h2>

    <p className="text-lg text-gray-700">
      {transcript}
    </p>

  </div>
)}

{/* AI Response */}

{answer && (
  <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">

    <h2 className="mb-3 text-xl font-bold text-blue-700">
      🤖 KisanBot
    </h2>

    <p className="leading-8 text-gray-700">
      {answer}
    </p>

  </div>
)}

{/* Audio */}

{audioUrl && (
  <div className="mt-8 rounded-2xl bg-gray-100 p-6">

    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">

      <Volume2 size={24} />

      Listen Again

    </h2>

    <audio
      controls
      className="w-full"
      src={audioUrl}
    />

  </div>
)}

</div>

</div>

</div>
);
};

export default VoiceAssistant;
        