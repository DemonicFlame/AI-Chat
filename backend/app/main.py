from fastapi import FastAPI, Request
from app.schemas.model import AskRequest, AskResponse
from app.ai import get_answer

# from langchain_core.messages import HumanMessage
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI()

origins = []
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def stream_response(question: str):
    async for chunk in get_answer(question):
        yield chunk


@app.post("/ask")
async def ask(request: Request):
    body = await request.json()
    question = body.get("question", "")
    return StreamingResponse(stream_response(question), media_type="text/plain")
    # response = await get_answer(request.question)
    # return AskResponse(answer=response)


# @app.post("/ask3", response_model=AskResponse)
# async def ask3(request: AskRequest):
#     llm = get_answer3()
#     response = await llm.ainvoke([HumanMessage(content=request.question)])
#     return AskResponse(answer=response.content)
