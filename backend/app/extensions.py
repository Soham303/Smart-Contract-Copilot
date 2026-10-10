from flask_jwt_extended import JWTManager

try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None

try:
    import redis
except ImportError:
    redis = None

jwt = JWTManager()
mongo_client = None
db = None
redis_client = None

def init_extensions(app):
    global mongo_client, db, redis_client
    jwt.init_app(app)
    
    # Initialize MongoDB if available
    if MongoClient and "MONGO_URI" in app.config:
        try:
            mongo_client = MongoClient(app.config["MONGO_URI"], serverSelectionTimeoutMS=2000)
            db_name = app.config["MONGO_URI"].split("/")[-1].split("?")[0] or "smart_contract_copilot"
            db = mongo_client[db_name]
        except Exception as e:
            app.logger.warning(f"Could not connect to MongoDB: {e}")
            db = None

    # Initialize Redis if available
    if redis and "REDIS_URL" in app.config:
        try:
            redis_client = redis.from_url(app.config["REDIS_URL"])
        except Exception as e:
            app.logger.warning(f"Could not connect to Redis: {e}")
            redis_client = None
