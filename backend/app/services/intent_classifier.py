from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.openrouter_api_key,
)


def classify_intent(question: str):

    prompt = f"""
Classify the user's question into ONLY ONE category.

Categories:
- crop_query
- disease_query
- weather_query
- market_query
- government_scheme
- fertilizer_query
- greeting
- other

Question:
{question}

Return ONLY the category name.
"""

    response = client.chat.completions.create(
     model="openai/gpt-4.1-mini",
     messages=[
        {
            "role": "user",
            "content": prompt,
        }
    ],
     max_tokens=20,
     temperature=0,
)
    return response.choices[0].message.content.strip()