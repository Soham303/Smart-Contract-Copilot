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
    SECRET_KEY = os.getenv("SECRET_KEY", "scc-production-secret-9a83f120c8de77b492b45e89d1234a56")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "scc-jwt-production-secret-7a39e248b1d98246a48d88fa7b251ce91b")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 86400 * 30  # 30 days
    
    # MongoDB configuration (supports MONGO_URI and MONGODB_URI with Atlas fallback)
    _default_atlas = "mongodb+srv://yash1262030090_db_user:Gin3y1R8JNS0ifuB@sccp2.z6qnuiu.mongodb.net/smart_contract_copilot?retryWrites=true&w=majority"
    _raw_mongo = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI") or _default_atlas
    if _raw_mongo and not _raw_mongo.rstrip("/").split("/")[-1].split("?")[0]:
        # Append database name if trailing slash with no db
        _raw_mongo = _raw_mongo.rstrip("/") + "/smart_contract_copilot"
    MONGO_URI = _raw_mongo

    # Redis configuration (supports REDIS_URL or Upstash REST url/token conversion)
    _default_redis = "rediss://default:gQAAAAAAARe9AAIgcDJiZDI2NzM4NmJlYmU0ZDczOTMxZDYzY2YzYmZkMzA2MQ@smashing-cricket-71613.upstash.io:6379"
    _raw_redis = os.getenv("REDIS_URL")
    if not _raw_redis and os.getenv("UPSTASH_REDIS_REST_URL") and os.getenv("UPSTASH_REDIS_REST_TOKEN"):
        upstash_host = os.getenv("UPSTASH_REDIS_REST_URL").replace("https://", "").replace("http://", "").rstrip("/")
        upstash_token = os.getenv("UPSTASH_REDIS_REST_TOKEN").strip('"').strip("'")
        _raw_redis = f"rediss://default:{upstash_token}@{upstash_host}:6379"
    REDIS_URL = _raw_redis or _default_redis
    
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
