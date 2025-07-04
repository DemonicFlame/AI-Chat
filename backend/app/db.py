# from dotenv import load_dotenv
# import os
from motor.motor_asyncio import AsyncIOMotorClient

# load_dotenv()

# uri = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(
    "mongodb+srv://DemonicFlame:7Pvh9vzYwBqueilK@cluster0.9s59z.mongodb.net/",
    tls=True,
    tlsAllowInvalidCertificates=True,
    tlsAllowInvalidHostnames=True,
    appname="Cluster0",
    retryWrites=True,
    w="majority",
)

db = client["AIChat"]
users_collection = db["users"]
messages_collection = db["messages"]
