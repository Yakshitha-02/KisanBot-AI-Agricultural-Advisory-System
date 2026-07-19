from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.services.rag.retriever import retrieve_documents
from app.services.llm.openrouter import llm


prompt = ChatPromptTemplate.from_template("""
Answer in simple language suitable for farmers.

Maximum 150 words.

Use ONLY the given context.

If the answer is not available,
say you don't know.

Context:
{context}

Question:
{question}
""")


def get_confidence(score):
    # Adjust thresholds after testing
    if score < 0.30:
        return "High"
    elif score < 0.60:
        return "Medium"
    else:
        return "Low"


def ask_rag(question: str):

    results = retrieve_documents(question)

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
        "context": context,
        "question": question,
    }
    )

    confidence = get_confidence(scores[0])

# Downgrade confidence if the model says the answer isn't in the context
    if (
     "don't know" in answer.lower()
     or "do not know" in answer.lower()
     or "not mention" in answer.lower()
     or "not available" in answer.lower()
    ):
     confidence = "Low"

    return {
     "answer": answer,
     "confidence": confidence,
     "score": round(scores[0], 3),
}