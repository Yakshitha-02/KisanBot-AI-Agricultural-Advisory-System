from app.services.rag.retriever import retrieve_documents
from app.services.llm.openrouter import ask_llm


def ask_rag(question: str):

    results = retrieve_documents(question)

    context = "\n\n".join(
    doc["text"]
    for doc in results[:3]
)

    prompt = f"""
Answer in simple language suitable for farmers.

Maximum 150 words.

Be direct.

Do not repeat information.

Do not mention context or documents.

================ CONTEXT ================

{context}

=========================================

Farmer's Question:
{question}

Answer:
"""
    print("=" * 60)
    print(context)
    print("=" * 60)

    answer = ask_llm(prompt)

    return answer