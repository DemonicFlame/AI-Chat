from fastapi import APIRouter, HTTPException, Request
from authlib.integrations.starlette_client import OAuth
from starlette.responses import RedirectResponse
from dotenv import load_dotenv
import os
from app.db import users_collection
from app.auth import create_access_token

router = APIRouter()
load_dotenv()

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email"},
)

FRONTEND_URL = "https://ai-chat-beta-eight.vercel.app/"


@router.get("/auth/google-login")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/auth/google/callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    if not user_info:
        raise HTTPException(status_code=400, detail="Google login failed")

    existing_user = await users_collection.find_one({"email": user_info["email"]})
    if not existing_user:
        user_doc = {
            "email": user_info["email"],
            "password": None,
        }
        result = await users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
    else:
        user_id = str(existing_user["_id"])

    jwt_token = create_access_token({"user_id": user_id})
    return RedirectResponse(f"{FRONTEND_URL}?token={jwt_token}")
