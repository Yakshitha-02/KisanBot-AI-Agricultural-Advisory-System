from app.services.translator import (
    detect_language,
    translate_to_english,
    translate_from_english,
)

from app.services.rag.chat import ask_rag
from app.services.intent_classifier import classify_intent
from app.services.ner import extract_entities

def process_question(question: str):

    language = detect_language(question)

    english_question = translate_to_english(question)

    answer = ask_rag(english_question)
    intent = classify_intent(question)
    entities = extract_entities(question)

    print("Intent:", intent)
    print("Entities:", entities)
    final_answer = translate_from_english(
        answer,
        language,
    )

    return {
        "language": language,
        "answer": final_answer,
    }