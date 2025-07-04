from fastapi import APIRouter, HTTPException
from app.db import users_collection
from app.schemas.model import UserCreate, UserLogin, Token
from app.auth import create_access_token, hash_password, verify_password

router = APIRouter()


@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.pasword)
    user_doc = {"email": user.email, "password": hashed_pw}
    result = await users_collection.insert_one(user_doc)

    token = create_access_token({"user_id": str(result.inserted_id)})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": str(db_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}
