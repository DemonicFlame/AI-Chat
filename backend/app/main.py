from fastapi import FastAPI
from dotenv import load_dotenv
import os
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.users import router as user_router
from app.chat import router as chat_router
from app.google_oauth import router as google_oauth_router
from app.verify import router as verify_router

app = FastAPI()
load_dotenv()

key = os.getenv("SECRET_KEY")
app.add_middleware(SessionMiddleware, secret_key=key)

origins = []
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=lambda request: "global", default_limits=[])
app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    lambda request, exc: JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    ),
)
app.add_middleware(SlowAPIMiddleware)

app.include_router(user_router)
app.include_router(chat_router)
app.include_router(google_oauth_router)
app.include_router(verify_router)
