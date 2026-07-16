from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.openrouter_api_key,
)

def extract_city(question: str):

    prompt = f"""
Extract only the city name from the user's question.

If there is no city mentioned, return ONLY:

NONE

Question:
{question}
"""

    response = client.chat.completions.create(
        model="openai/gpt-4.1-mini",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0,
        max_tokens=10,
    )

    return response.choices[0].message.content.strip()