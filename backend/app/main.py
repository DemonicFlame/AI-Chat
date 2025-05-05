from fastapi import FastAPI
from app.schemas.model import AskRequest, AskResponse
from app.ai import get_answer, get_answer2, get_answer3

app = FastAPI()


@app.post("/ask", response_model=AskResponse)
async def ask(request: AskRequest):
    response = await get_answer(request.question)
    return AskResponse(answer=response.answer)
