from app.services.speech.tts import text_to_speech

path = text_to_speech(
    "వరి భారతదేశంలోని ముఖ్యమైన పంటలలో ఒకటి.",
    "Telugu"
)

print(path)