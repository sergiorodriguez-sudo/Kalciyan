from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SGI - Kalciyan"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    
    # Google
    GOOGLE_APPLICATION_CREDENTIALS: str
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # Vector DB
    VECTOR_DIM: int = 1536  # OpenAI ada-002
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
