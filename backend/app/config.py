import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-prod")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key-change-in-prod")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 86400 * 30  # 30 days
    
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/smart_contract_copilot")
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Rate limits per PRD Section 15
    RATELIMIT_AI_HOURLY = int(os.getenv("RATELIMIT_AI_HOURLY", "20"))
    RATELIMIT_COMPILE_HOURLY = int(os.getenv("RATELIMIT_COMPILE_HOURLY", "30"))
    RATELIMIT_REPORT_HOURLY = int(os.getenv("RATELIMIT_REPORT_HOURLY", "20"))
    
    # Aptos Environment
    APTOS_CLI_PATH = os.getenv("APTOS_CLI_PATH", "aptos")
    APTOS_DEVNET_URL = os.getenv("APTOS_DEVNET_URL", "https://api.devnet.aptoslabs.com/v1")
    APTOS_TESTNET_URL = os.getenv("APTOS_TESTNET_URL", "https://api.testnet.aptoslabs.com/v1")
    APTOS_FAUCET_TESTNET_URL = os.getenv("APTOS_FAUCET_TESTNET_URL", "https://faucet.testnet.aptoslabs.com")
