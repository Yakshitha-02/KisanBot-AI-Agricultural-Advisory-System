from app.services.rag.pinecone_store import vector_store


def retrieve_documents(question: str, k: int = 5):

    docs = vector_store.similarity_search_with_score(
        question,
        k=k,
    )

    return docs