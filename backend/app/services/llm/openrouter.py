from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.openrouter_api_key,
)


def ask_llm(prompt: str):

    response = client.chat.completions.create(
        model="deepseek/deepseek-chat-v3",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are KisanBot, an AI agricultural assistant. "
                    "Answer ONLY using the provided context. "
                    "If the answer is not present in the context, "
                    "say that the information is unavailable."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content