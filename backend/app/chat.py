from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from app.db import messages_collection
from app.auth import decode_access_token
from app.schemas.model import ChatMessage
from app.ai import get_answer
from app.limiter import limiter
from fastapi.responses import StreamingResponse

router = APIRouter()


async def get_current_user(request: Request):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token")

    token = auth.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload["user_id"]


@router.post("/ask")
@limiter.limit("20/hour")
async def ask_question(request: Request, user_id: str = Depends(get_current_user)):
    body = await request.json()
    question = body.get("question", "")

    async def gen():
        answer = get_answer(question)
        full = ""
        async for chunk in answer:
            full += chunk
            yield chunk
        chat_msg = ChatMessage(
            user_id=str(user_id),
            question=question,
            answer=full,
            timestamp=datetime.now(timezone.utc),
        )
        await messages_collection.insert_one(chat_msg.model_dump())

    return StreamingResponse(gen(), media_type="text/plain")


@router.get("/history", response_model=list[ChatMessage])
async def get_history(user_id: str = Depends(get_current_user)):
    history = []
    async for msg in messages_collection.find({"user_id": user_id}).sort(
        "timestamp", 1
    ):
        msg["user_id"] = str(msg["user_id"])
        history.append(ChatMessage(**msg))
    return history


@router.delete("/history")
async def delete_history(user_id: str = Depends(get_current_user)):
    await messages_collection.delete_many({"user_id": user_id})
    return {"message": "History deleted successfully"}
