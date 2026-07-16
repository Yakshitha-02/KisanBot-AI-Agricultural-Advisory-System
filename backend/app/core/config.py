import os

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")


class Settings(BaseModel):

    api_prefix: str = Field(default_factory=lambda: os.getenv("API_PREFIX", "/api"))

    jwt_secret_key: str = Field(default_factory=lambda: os.getenv("JWT_SECRET_KEY", "kisanbot-dev-secret"))

    jwt_algorithm: str = Field(default_factory=lambda: os.getenv("JWT_ALGORITHM", "HS256"))

    access_token_expire_minutes: int = Field(
        default_factory=lambda: int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    )

    database_url: str = Field(
        default_factory=lambda: os.getenv("DATABASE_URL", "sqlite:///./app.db")
    )

    pinecone_api_key: str = Field(
        default_factory=lambda: os.getenv("PINECONE_API_KEY", "")
    )

    pinecone_environment: str = Field(
        default_factory=lambda: os.getenv("PINECONE_ENVIRONMENT", "")
    )
    pinecone_index_name: str = Field(
    default_factory=lambda: os.getenv("PINECONE_INDEX_NAME", "kisanbotai")
)

    sarvam_api_key: str = Field(
        default_factory=lambda: os.getenv("SARVAM_API_KEY", "")
    )
    openrouter_api_key: str = Field(
        default_factory=lambda: os.getenv("OPENROUTER_API_KEY", "")
    )
    openweather_api_key: str= Field(
        default_factory=lambda: os.getenv("OPENWEATHER_API_KEY", "")
    )
    data_gov_api_key: str= Field(
        default_factory=lambda: os.getenv("DATA_GOV_API_KEY", "")
    )


settings = Settings()