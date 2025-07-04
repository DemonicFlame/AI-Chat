from fastapi import FastAPI

# from app.ai import get_answer

# from langchain_core.messages import HumanMessage
from fastapi.middleware.cors import CORSMiddleware

# from fastapi.responses import StreamingResponse
from app.users import router as user_router
from app.chat import router as chat_router

app = FastAPI()

origins = []
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(chat_router)


# async def stream_response(question: str):
#     async for chunk in get_answer(question):
#         yield chunk


# @app.post("/ask")
# async def ask(request: Request):
#     body = await request.json()
#     question = body.get("question", "")
#     return StreamingResponse(stream_response(question), media_type="text/plain")
