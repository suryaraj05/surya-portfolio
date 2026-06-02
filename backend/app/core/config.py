from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    APP_NAME: str = "SuryaOS Core"
    ENV: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    API_VERSION: str = "1.0.0"

    SECRET_KEY: str = "change_me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    DATABASE_URL: str = "sqlite:///./suryaos.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    CORS_ORIGINS: str | list[str] = "*"
    RATE_LIMIT_LOGIN_PER_MINUTE: int = 10
    RATE_LIMIT_CONTACT_PER_MINUTE: int = 20
    RATE_LIMIT_ANALYTICS_PER_MINUTE: int = 120
    CACHE_TTL_SECONDS: int = 300

    S3_BUCKET: str | None = None
    S3_REGION: str | None = None
    S3_ENDPOINT_URL: str | None = None
    S3_ACCESS_KEY: str | None = None
    S3_SECRET_KEY: str | None = None

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            if value.startswith("["):
                import json

                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed]
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
