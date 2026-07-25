from langdetect import detect
from sarvamai import SarvamAI

from app.core.config import settings

client = SarvamAI(
    api_subscription_key=settings.sarvam_api_key
)

LANGUAGE_CODES = {
    "English": "en-IN",
    "Hindi": "hi-IN",
    "Kannada": "kn-IN",
    "Tamil": "ta-IN",
    "Telugu": "te-IN",
    "Malayalam": "ml-IN",
    "Marathi": "mr-IN",
    "Gujarati": "gu-IN",
    "Punjabi": "pa-IN",
}

MAX_CHARS = 1800


def detect_language(text: str):
    try:
        lang = detect(text)

        mapping = {
            "en": "English",
            "hi": "Hindi",
            "kn": "Kannada",
            "ta": "Tamil",
            "te": "Telugu",
            "ml": "Malayalam",
            "mr": "Marathi",
            "gu": "Gujarati",
            "pa": "Punjabi",
        }

        return mapping.get(lang, "English")

    except Exception:
        return "English"


def split_text(text, chunk_size=MAX_CHARS):

    chunks = []

    start = 0

    while start < len(text):

        end = start + chunk_size

        if end < len(text):

            last_space = text.rfind(" ", start, end)

            if last_space != -1:
                end = last_space

        chunks.append(text[start:end])

        start = end

    return chunks


def translate_chunk(text, source, target):

    response = client.text.translate(
        input=text,
        source_language_code=source,
        target_language_code=target,
        model="sarvam-translate:v1",
    )

    print(response)

    if hasattr(response, "translated_text"):
        return response.translated_text

    if isinstance(response, dict):
        return response.get("translated_text", text)

    return text


def translate_to_english(text):

    language = detect_language(text)

    if language == "English":
        return text

    translated = []

    chunks = split_text(text)

    print(f"Total Chunks : {len(chunks)}")

    for i, chunk in enumerate(chunks):

        print(f"Translating Chunk {i+1}/{len(chunks)}")

        translated.append(
            translate_chunk(
                chunk,
                LANGUAGE_CODES[language],
                "en-IN",
            )
        )

    return "\n".join(translated)


def translate_from_english(text, language):

    language = language.title()

    if language not in LANGUAGE_CODES:
        return f"Unsupported language: {language}"

    if language == "English":
        return text

    translated = []

    chunks = split_text(text)

    print(f"Total Chunks : {len(chunks)}")

    for i, chunk in enumerate(chunks):

        print(f"Translating Chunk {i+1}/{len(chunks)}")

        translated.append(
            translate_chunk(
                chunk,
                "en-IN",
                LANGUAGE_CODES[language],
            )
        )

    return "\n".join(translated)