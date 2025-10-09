from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash", google_api_key=key, streaming=True
)


async def get_answer(question: str):
    async for chunk in llm.astream([HumanMessage(content=question)]):
        if hasattr(chunk, "content"):
            yield chunk.content
