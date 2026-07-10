import whisper

model = whisper.load_model("base")


def detect_language(audio_path: str):
    result = model.transcribe(audio_path)

    return {
        "language": result["language"],
        "text": result["text"].strip(),
    }