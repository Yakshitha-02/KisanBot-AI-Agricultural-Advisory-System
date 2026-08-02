from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.services.rag.query_rewriter import rewrite_query
from app.services.rag.retriever import retrieve_documents
from app.services.llm.openrouter import llm


prompt = ChatPromptTemplate.from_template("""
You are an agricultural assistant.

Answer in simple language suitable for farmers.

Maximum 150 words.

Use ONLY the given context.

If the answer is not available in the context,
say you don't know.

Previous Conversation:
{conversation_history}

Knowledge Base:
{context}

Current Question:
{question}
""")


def get_confidence(score):
    if score < 0.30:
        return "High"
    elif score < 0.60:
        return "Medium"
    else:
        return "Low"


def ask_rag(
    question: str,
    conversation_history: str = "",
):

    # Rewrite the query using conversation history
    rewritten_question = rewrite_query(
        question,
        conversation_history,
    )

    print("\n===== REWRITTEN QUERY =====")
    print(rewritten_question)
    print("===========================\n")

    # Retrieve documents using rewritten query
    results = retrieve_documents(rewritten_question)

    docs = [doc for doc, score in results]
    scores = [score for doc, score in results]

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    chain = (
        prompt
        | llm
        | StrOutputParser()
    )

    answer = chain.invoke(
        {
            "conversation_history": conversation_history,
            "context": context,
            "question": rewritten_question,   # Keep original question here
        }
    )

    confidence = get_confidence(scores[0])

    if (
        "don't know" in answer.lower()
        or "do not know" in answer.lower()
        or "not mentioned" in answer.lower()
        or "not available" in answer.lower()
    ):
        confidence = "Low"

    return {
        "answer": answer,
        "confidence": confidence,
        "score": round(scores[0], 3),
    }