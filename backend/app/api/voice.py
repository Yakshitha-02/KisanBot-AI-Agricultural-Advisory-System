import os
import uuid
import shutil

from fastapi import APIRouter, UploadFile, File

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
async def voice_chat(audio: UploadFile = File(...)):

    # Create folders
    os.makedirs("temp", exist_ok=True)
    os.makedirs("audio", exist_ok=True)

    # Save uploaded audio
    input_path = f"temp/{uuid.uuid4()}.wav"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    try:
        # Detect language using Whisper
        whisper_result = detect_language(input_path)

        language_code = whisper_result["language"]

        if language_code in LANGUAGE_MAP:

            language = LANGUAGE_MAP[language_code]

            # Use Sarvam STT for supported languages
            transcript = speech_to_text(
                input_path,
                language,
            )

        else:

            # Unsupported language → use Whisper transcript
            language = "English"
            transcript = whisper_result["text"]

    except Exception as e:

        print("Speech Processing Error:", e)

        whisper_result = detect_language(input_path)

        language = LANGUAGE_MAP.get(
            whisper_result["language"],
            "English",
        )

        transcript = whisper_result["text"]

    # Process the question
    response = process_question(transcript)

    # Generate speech response
    output_filename = f"{uuid.uuid4()}.wav"
    output_path = os.path.join("audio", output_filename)

    text_to_speech(
        response["answer"],
        response["language"],
        output_file=output_path,
    )

    return {
        "transcript": transcript,
        "language": response["language"],
        "answer": response["answer"],
        "audio_file": f"audio/{output_filename}",
    }