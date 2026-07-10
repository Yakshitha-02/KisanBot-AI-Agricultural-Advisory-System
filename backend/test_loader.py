from app.services.rag.loader import load_documents

docs = load_documents()

print("\n========================")
print("Total Pages:", len(docs))
print("========================\n")

print(docs[0].metadata)

print()

print(docs[0].page_content[:500])