from app.services.rag.retriever import retriever

docs = retriever.invoke("How to control rice blast disease?")

print("=" * 80)

for i, doc in enumerate(docs, 1):
    print(f"\nDocument {i}\n")
    print(doc.page_content[:700])
    print("-" * 80)