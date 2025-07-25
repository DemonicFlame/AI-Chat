from dotenv import load_dotenv
import os
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

uri = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(uri)

db = client["AIChat"]
users_collection = db["users"]
messages_collection = db["messages"]
