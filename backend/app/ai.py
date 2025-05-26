from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os

# import google.generativeai as genai

load_dotenv()

key = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash", google_api_key=key, streaming=True
)


async def get_answer(question: str):
    async for chunk in llm.astream([HumanMessage(content=question)]):
        if hasattr(chunk, "content"):
            yield chunk.content
    # response = await llm.ainvoke([HumanMessage(content=question)])
    # return response.content


# genai.configure(api_key=key)
# model = genai.GenerativeModel("gemini-2.0-flash")


# def get_answer2(question: str) -> str:
#     response = model.generate_content(question)
#     return response.text


# def get_answer3():
#     return ChatGoogleGenerativeAI(
#         model="gemini-2.0-flash",
#         google_api_key=key,
#     )
