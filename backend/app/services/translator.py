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
    "Telugu": "te-IN",
    "Tamil": "ta-IN",
    "Malayalam": "ml-IN",
    "Marathi": "mr-IN",
    "Gujarati": "gu-IN",
    "Punjabi": "pa-IN",
}


def detect_language(text: str):
    try:

        lang = detect(text)

        mapping = {
            "en": "English",
            "hi": "Hindi",
            "kn": "Kannada",
            "te": "Telugu",
            "ta": "Tamil",
            "ml": "Malayalam",
            "mr": "Marathi",
            "gu": "Gujarati",
            "pa": "Punjabi",
        }

        return mapping.get(lang, "English")

    except Exception:
        return "English"


def translate_to_english(text: str):

    language = detect_language(text)

    if language == "English":
        return text

    try:

        response = client.text.translate(
            input=text,
            source_language_code=LANGUAGE_CODES[language],
            target_language_code="en-IN",
            model="sarvam-translate:v1",
        )

        return response.translated_text

    except Exception as e:

        print("Translation Error:", e)

        return text

def translate_from_english(text: str, language: str):

    if language == "English":
        return text

    try:

        response = client.text.translate(
            input=text,
            source_language_code="en-IN",
            target_language_code=LANGUAGE_CODES[language],
            model="sarvam-translate:v1",
        )

        return response.translated_text

    except Exception as e:

        print("Translation Error:", e)

        return text