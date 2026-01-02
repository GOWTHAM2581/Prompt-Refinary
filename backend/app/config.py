from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional
import os

class Settings(BaseSettings):
    GROQ_API_KEY: str = "MISSING"
    SUPABASE_URL: str = "MISSING"
    SUPABASE_KEY: str = "MISSING"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    settings = Settings()
    
    # Check if they are actually set
    if settings.GROQ_API_KEY == "MISSING" or settings.SUPABASE_URL == "MISSING":
        print("\n" + "!"*50)
        print("CRITICAL ERROR: Environment Variables are missing!")
        print("Please fill in your backend/.env file with:")
        print("GROQ_API_KEY=...")
        print("SUPABASE_URL=...")
        print("SUPABASE_KEY=...")
        print("!"*50 + "\n")
        # We still return so it doesn't crash during build/lint, 
        # but execution will fail clearly when keys are used.
    
    return settings
