from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth import decode_access_token

router = APIRouter()
bearer = HTTPBearer()


@router.get("/auth/verify")
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    print("credentials received:", credentials)
    token = credentials.credentials
    payload = decode_access_token(token)
    print("decoded payload:", payload)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
