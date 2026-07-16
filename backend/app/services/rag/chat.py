from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.services.rag.retriever import retriever
from app.services.llm.openrouter import llm


# Prompt Template
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are KisanBot, an AI Agricultural Assistant.

Answer ONLY using the provided context.

Rules:
- Do not make up facts.
- If the answer is not found in the context, reply:
  "I couldn't find this information in the agricultural knowledge base."
- Use simple language suitable for farmers.
- Keep the answer under 150 words.
- Do not mention the words "context" or "documents".
""",
        ),
        (
            "human",
            """
Context:
{context}

Question:
{question}
""",
        ),
    ]
)


def ask_rag(question: str):

    # Retrieve relevant documents
    docs = retriever.invoke(question)

    # No documents found
    if not docs:
        return "I couldn't find this information in the agricultural knowledge base."

    # Combine retrieved documents into context
    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    # Build LangChain pipeline
    chain = (
        prompt
        | llm
        | StrOutputParser()
    )

    # Generate answer
    answer = chain.invoke(
        {
            "context": context,
            "question": question,
        }
    )

    return answer