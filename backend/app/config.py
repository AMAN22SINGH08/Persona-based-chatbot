import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file if present
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").strip()
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'persona_chatbot.db'}")
DEMO_MODE_FORCED = os.getenv("DEMO_MODE", "auto").lower()

def is_demo_mode() -> bool:
    if DEMO_MODE_FORCED in ("true", "1", "yes"):
        return True
    if DEMO_MODE_FORCED in ("false", "0", "no"):
        return False
    # Auto mode: if no API key provided, default to demo mode
    return len(OPENAI_API_KEY) == 0
