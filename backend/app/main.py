from fastapi import FastAPI
from app.schemas.model import AskRequest, AskResponse
from app.ai import get_answer, get_answer3
from langchain_core.messages import HumanMessage
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173/",
    "http://localhost:3000/",
    "https://yourfrontenddomain.com/",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/ask", response_model=AskResponse)
async def ask(request: AskRequest):
    response = await get_answer(request.question)
    return AskResponse(answer=response)


@app.post("/ask3", response_model=AskResponse)
async def ask3(request: AskRequest):
    llm = get_answer3()
    response = await llm.ainvoke([HumanMessage(content=request.question)])
    return AskResponse(answer=response.content)
