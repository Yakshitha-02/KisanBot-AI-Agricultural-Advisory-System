from app.services.rag.embeddings import get_embedding
from app.services.rag.pinecone_store import index


def retrieve_documents(query: str, top_k: int = 5):

    query_embedding = get_embedding(query)

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
    )

    documents = []

    for match in results["matches"]:

        documents.append(
            {
                "score": match["score"],
                "text": match["metadata"]["text"],
                "source": match["metadata"]["source"],
                "page": match["metadata"]["page"],
            }
        )

    return documents