from sarvamai import SarvamAI

from app.core.config import settings
import base64

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


def text_to_speech(
    text: str,
    language: str = "Telugu",
    output_file: str = "output.wav",
):
    try:
        response = client.text_to_speech.convert(

            text=text,

            target_language_code=LANGUAGE_CODES.get(language, "en-IN"),

            speaker="priya",

            model="bulbul:v3",

            output_audio_codec="wav",
        )

        with open(output_file, "wb") as f:
            f.write(base64.b64decode(response.audios[0]))

        return output_file

    except Exception as e:
        # Log the error and return None so callers can continue without TTS.
        print("TTS Error:", e)
        return None