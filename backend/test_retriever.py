from app.services.rag.retriever import retrieve_documents

docs = retrieve_documents(
    "What is paddy?"
)

for i, doc in enumerate(docs, 1):

    print("=" * 60)

    print(f"Result {i}")

    print("Score :", doc["score"])

    print("Source:", doc["source"])

    print("Page  :", doc["page"])

    print()

    print(doc["text"][:500])