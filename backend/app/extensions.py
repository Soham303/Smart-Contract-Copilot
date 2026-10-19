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
    
    # Initialize MongoDB with automatic Atlas fallback
    if MongoClient:
        primary_uri = app.config.get("MONGO_URI", "")
        fallback_atlas = "mongodb+srv://yash1262030090_db_user:Gin3y1R8JNS0ifuB@sccp2.z6qnuiu.mongodb.net/smart_contract_copilot?retryWrites=true&w=majority"
        
        candidates = [primary_uri] if primary_uri else []
        if fallback_atlas not in candidates:
            candidates.append(fallback_atlas)
            
        connected = False
        for uri in candidates:
            try:
                client = MongoClient(uri, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
                client.admin.command('ping')
                mongo_client = client
                db_name = uri.split("/")[-1].split("?")[0] or "smart_contract_copilot"
                db = mongo_client[db_name]
                app.logger.info(f"Connected successfully to MongoDB Atlas database: {db_name}")
                connected = True
                
                # Ensure collections and indexes are ready
                try:
                    from app.core.db.repository import db_repo
                    db_repo.ensure_indexes()
                    db_repo.ensure_initial_seeds()
                except Exception as ex:
                    app.logger.warning(f"Index/Seed initialization notice: {ex}")
                break
            except Exception as e:
                app.logger.warning(f"Could not connect using URI ({e}). Trying next candidate...")
                
        if not connected:
            app.logger.error("All MongoDB connection attempts failed. Using resilient in-memory repository.")
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
