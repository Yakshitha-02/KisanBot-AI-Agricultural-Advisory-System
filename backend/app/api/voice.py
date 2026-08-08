import os
import uuid
import shutil

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.chatbot import process_question

# Import speech dependencies lazily so the app can still start on systems
# where native audio/model libraries (like whisper) are not available.
try:
    from app.services.speech.stt import speech_to_text
    from app.services.speech.tts import text_to_speech
    from app.services.speech.whisper_stt import detect_language
    VOICE_AVAILABLE = True
except Exception:
    VOICE_AVAILABLE = False

# If imports succeeded but ffmpeg isn't on PATH, mark voice as unavailable
if VOICE_AVAILABLE and shutil.which("ffmpeg") is None:
    VOICE_AVAILABLE = False

router = APIRouter()

LANGUAGE_MAP = {
    "en": "English",
    "hi": "Hindi",
    "kn": "Kannada",
    "te": "Telugu",
    "ta": "Tamil",
    "ml": "Malayalam",
}


@router.post("/voice")
async def voice_chat(
    audio: UploadFile = File(...),
    language: str = Form("English"),
):

    if not VOICE_AVAILABLE:
        return {
            "transcript": "Voice assistant is unavailable on this server.",
            "language": language,
            "answer": (
                "Voice features are not enabled in this environment. "
                "Install ffmpeg and the optional speech dependencies to turn them on."
            ),
            "audio_file": "",
            "supported": False,
        }

    os.makedirs("temp", exist_ok=True)
    os.makedirs("audio", exist_ok=True)

    input_path = f"temp/{uuid.uuid4()}.wav"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    try:
        # ----------------------------------------
        # English → Auto Detect using Whisper
        # ----------------------------------------
        if language == "English":

            whisper_result = detect_language(input_path)

            transcript = whisper_result["text"]

            detected_language = "English"

        # ----------------------------------------
        # User Selected Language
        # ----------------------------------------
        else:

            transcript = speech_to_text(
                input_path,
                language,
            )

            detected_language = language

    except Exception as e:

        print("Speech Processing Error:", e)

        # If ffmpeg is missing or the error indicates a missing external tool,
        # return a clear 503 so the client knows to install ffmpeg.
        msg = str(e).lower()
        if "ffmpeg" in msg or isinstance(e, FileNotFoundError):
            raise HTTPException(
                status_code=503,
                detail=(
                    "ffmpeg not found or not executable. Install ffmpeg and ensure "
                    "it's available on the PATH for the process running the server."
                ),
            )

        # Fallback: try whisper detect as a last resort, but handle failures.
        try:
            whisper_result = detect_language(input_path)

            transcript = whisper_result["text"]

            detected_language = LANGUAGE_MAP.get(
                whisper_result["language"],
                "English",
            )
        except Exception as e2:
            print("Fallback whisper failed:", e2)
            raise HTTPException(status_code=500, detail=f"Speech processing failed: {e2}")

    # AI Processing
    response = process_question(
        transcript,
    )

    # Generate Speech
    output_filename = f"{uuid.uuid4()}.wav"

    output_path = os.path.join(
        "audio",
        output_filename,
    )

    text_to_speech(
        response["answer"],
        detected_language,
        output_file=output_path,
    )

    return {
        "transcript": transcript,
        "language": detected_language,
        "answer": response["answer"],
        "audio_file": f"audio/{output_filename}",
    }