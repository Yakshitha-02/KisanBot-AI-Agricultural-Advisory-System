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

# Change this import according to your project structure
from app.services.market.market_service import get_market_price


def process_question(question: str):

    # --------------------------
    # Detect Language
    # --------------------------
    language = detect_language(question)

    # --------------------------
    # Translate to English
    # --------------------------
    english_question = translate_to_english(question)

    # --------------------------
    # Intent Classification
    # --------------------------
    intent = classify_intent(english_question)
    print("English Question:", english_question)
    # --------------------------
    # Named Entity Recognition
    # --------------------------
    entities = extract_entities(english_question)

    print("Intent:", intent)
    print("Entities:", entities)

    confidence = None
    score = None

    # --------------------------
    # WEATHER
    # --------------------------
    if intent == "weather_query":

        city = extract_city(english_question)

        if city:
         weather = get_current_weather(city)

         answer = f"""
🌦 Weather Report

City: {weather['city']}
Temperature: {weather['temperature']}°C
Humidity: {weather['humidity']}%
Condition: {weather['description']}
Wind Speed: {weather['wind_speed']} m/s
"""
        else:
            answer = "Please mention the city name."

    # --------------------------
    # MARKET PRICE
    # --------------------------
    elif intent == "market_query":

        commodity = entities["commodity"]
        state = entities["state"]

        print("Commodity:", commodity)
        print("State:", state)

        if commodity and state:

            result = get_market_price(
                commodity=commodity,
                state=state,
            )

            if result:

             if result["exact_state"]:

              answer = f"""
🌾 Latest Market Price

Commodity : {result['commodity']}
State : {result['state']}
District : {result['district']}
Market : {result['market']}
Variety : {result['variety']}

Minimum Price : ₹{result['min_price']} / Quintal
Maximum Price : ₹{result['max_price']} / Quintal
Modal Price : ₹{result['modal_price']} / Quintal

Arrival Date : {result['arrival_date']}
"""

             else:

              answer = f"""
⚠️ No current market price is available for {commodity} in {state}.

Showing the latest available market price for {commodity}.

Commodity : {result['commodity']}
State : {result['state']}
District : {result['district']}
Market : {result['market']}
Variety : {result['variety']}

Minimum Price : ₹{result['min_price']} / Quintal
Maximum Price : ₹{result['max_price']} / Quintal
Modal Price : ₹{result['modal_price']} / Quintal

Arrival Date : {result['arrival_date']}
"""

            else:

                answer = (
                    f"Sorry, I couldn't find market price "
                    f"for {commodity} in {state}."
                )

        else:

            answer = (
                "Please mention both the commodity "
                "and the state."
            )

    # --------------------------
    # RAG
    # --------------------------
    else:

        rag_response = ask_rag(english_question)

        answer = rag_response["answer"]
        confidence = rag_response["confidence"]
        score = rag_response["score"]

    # --------------------------
    # Translate Back
    # --------------------------
    final_answer = translate_from_english(
        answer,
        language,
    )

    return {
        "language": language,
        "answer": final_answer,
        "confidence": confidence,
        "score": score,
    }