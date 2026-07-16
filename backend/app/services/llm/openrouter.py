from langchain_openai import ChatOpenAI

from app.core.config import settings

llm = ChatOpenAI(
    model="deepseek/deepseek-chat-v3",
    api_key=settings.openrouter_api_key,
    base_url="https://openrouter.ai/api/v1",
    temperature=0.2,
)