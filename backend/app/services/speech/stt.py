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
}


def speech_to_text(audio_path: str, language: str = "Telugu"):

    with open(audio_path, "rb") as audio:

        response = client.speech_to_text.transcribe(
            file=audio,
            model="saarika:v2.5",
            mode="transcribe",
            language_code=LANGUAGE_CODES[language],
            input_audio_codec="wav",
        )

    return response.transcript

