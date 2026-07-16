from app.services.translator import (
    detect_language,
    translate_to_english,
    translate_from_english,
)

from app.services.rag.chat import ask_rag
from app.services.intent_classifier import classify_intent
from app.services.ner import extract_entities
from app.services.city_extractor import extract_city
from app.services.weather.weather_service import get_current_weather


def process_question(question: str):

    # Detect language
    language = detect_language(question)

    # Translate to English
    english_question = translate_to_english(question)

    # Intent Classification
    intent = classify_intent(english_question)

    # Named Entity Recognition
    entities = extract_entities(english_question)

    print("Intent:", intent)
    print("Entities:", entities)

    # Weather API
    if intent == "weather_query":

        city = extract_city(english_question)

        if city:
            answer = get_current_weather(city)
        else:
            answer = "Please mention the city name."

    # RAG
    else:

        answer = ask_rag(english_question)

    # Translate back to user's language
    final_answer = translate_from_english(
        answer,
        language,
    )

    return {
        "language": language,
        "answer": final_answer,
    }