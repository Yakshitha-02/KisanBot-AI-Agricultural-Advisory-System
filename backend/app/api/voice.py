import os
import uuid
import shutil

from fastapi import APIRouter, UploadFile, File, Form

from app.services.speech.stt import speech_to_text
from app.services.speech.tts import text_to_speech
from app.services.speech.whisper_stt import detect_language
from app.services.chatbot import process_question

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

        whisper_result = detect_language(input_path)

        transcript = whisper_result["text"]

        detected_language = LANGUAGE_MAP.get(
            whisper_result["language"],
            "English",
        )

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