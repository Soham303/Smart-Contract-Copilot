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
            client = MongoClient(app.config["MONGO_URI"], serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
            client.admin.command('ping')
            mongo_client = client
            db_name = app.config["MONGO_URI"].split("/")[-1].split("?")[0] or "smart_contract_copilot"
            db = mongo_client[db_name]
            app.logger.info(f"Connected successfully to MongoDB Atlas database: {db_name}")
        except Exception as e:
            app.logger.error(f"MongoDB not available ({e}). Using resilient in-memory repository.")
            mongo_client = None
            db = None

    # Initialize Redis if available
    if redis and "REDIS_URL" in app.config:
        try:
            client = redis.from_url(app.config["REDIS_URL"], socket_timeout=3.0)
            client.ping()
            redis_client = client
            app.logger.info("Connected successfully to Redis")
        except Exception as e:
            app.logger.info(f"Redis not available ({e}). Using direct task queue.")
            redis_client = None
