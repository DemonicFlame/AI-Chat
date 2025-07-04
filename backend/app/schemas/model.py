from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class ChatMessage(BaseModel):
    user_id: str
    question: str
    answer: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
