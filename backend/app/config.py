import os
from dotenv import load_dotenv

# Load environment variables from .env file
dotenv_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path)

TRAFFIC_API_PROVIDER = os.getenv("TRAFFIC_API_PROVIDER", "tomtom")
TRAFFIC_API_KEY = os.getenv("TRAFFIC_API_KEY", "")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "mumbai_traffic_db")

PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")
POLL_INTERVAL_SECONDS = int(os.getenv("POLL_INTERVAL_SECONDS", 30))
ENABLE_DEMO_FALLBACK = os.getenv("ENABLE_DEMO_FALLBACK", "true").lower() == "true"
