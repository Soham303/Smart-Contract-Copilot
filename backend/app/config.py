import os
from pathlib import Path

# Load environment variables from .env files
try:
    from dotenv import load_dotenv
    # Check both backend/.env and root .env
    base_dir = Path(__file__).resolve().parent.parent
    root_dir = base_dir.parent
    load_dotenv(base_dir / ".env")
    load_dotenv(root_dir / ".env")
except ImportError:
    pass

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-prod")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key-change-in-prod")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 86400 * 30  # 30 days
    
    # MongoDB configuration (supports both MONGO_URI and MONGODB_URI)
    _raw_mongo = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI") or "mongodb://localhost:27017/smart_contract_copilot"
    if _raw_mongo and not _raw_mongo.rstrip("/").split("/")[-1].split("?")[0]:
        # Append database name if trailing slash with no db
        _raw_mongo = _raw_mongo.rstrip("/") + "/smart_contract_copilot"
    MONGO_URI = _raw_mongo

    # Redis configuration (supports REDIS_URL or Upstash REST url/token conversion)
    _raw_redis = os.getenv("REDIS_URL")
    if not _raw_redis and os.getenv("UPSTASH_REDIS_REST_URL") and os.getenv("UPSTASH_REDIS_REST_TOKEN"):
        upstash_host = os.getenv("UPSTASH_REDIS_REST_URL").replace("https://", "").replace("http://", "").rstrip("/")
        upstash_token = os.getenv("UPSTASH_REDIS_REST_TOKEN").strip('"').strip("'")
        _raw_redis = f"rediss://default:{upstash_token}@{upstash_host}:6379"
    REDIS_URL = _raw_redis or "redis://localhost:6379/0"
    
    # AI Keys
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    # Rate limits per PRD Section 15
    RATELIMIT_AI_HOURLY = int(os.getenv("RATELIMIT_AI_HOURLY", "100"))
    RATELIMIT_COMPILE_HOURLY = int(os.getenv("RATELIMIT_COMPILE_HOURLY", "100"))
    RATELIMIT_REPORT_HOURLY = int(os.getenv("RATELIMIT_REPORT_HOURLY", "50"))
    
    # Aptos Environment
    APTOS_CLI_PATH = os.getenv("APTOS_CLI_PATH", "aptos")
    APTOS_NETWORK = os.getenv("APTOS_NETWORK", "testnet")
    APTOS_DEVNET_URL = os.getenv("APTOS_DEVNET_URL", "https://api.devnet.aptoslabs.com/v1")
    APTOS_TESTNET_URL = os.getenv("APTOS_TESTNET_URL", "https://api.testnet.aptoslabs.com/v1")
    APTOS_FAUCET_TESTNET_URL = os.getenv("APTOS_FAUCET_TESTNET_URL", "https://faucet.testnet.aptoslabs.com")
    APTOS_ACCOUNT_ADDRESS = os.getenv("APTOS_ACCOUNT_ADDRESS", "aac9efd001c2d99be8ba9433babdb8f349bfd58a949ce01a6e7630e07c984e1a")
    APTOS_PRIVATE_KEY = os.getenv("APTOS_PRIVATE_KEY")
    APTOS_PUBLIC_KEY = os.getenv("APTOS_PUBLIC_KEY")
