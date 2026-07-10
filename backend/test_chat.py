from sarvamai import SarvamAI
from app.core.config import settings

client = SarvamAI(api_subscription_key=settings.sarvam_api_key)

response = client.chat.completions(
    model="sarvam-30b",
    messages=[
        {
            "role": "user",
            "content": "What is paddy?"
        }
    ],
    reasoning_effort="low",
    temperature=0.2,
    max_tokens=800,
)
print(response)
print(response.choices[0].finish_reason)
print(response.choices[0].message.content)
print(response.choices[0].message.reasoning_content)