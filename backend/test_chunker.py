from app.services.rag.loader import load_documents
from app.services.rag.chunker import split_documents

docs = load_documents()

chunks = split_documents(docs)

print()

print("Total Chunks:", len(chunks))

print()

print(chunks[0].metadata)

print()

print(chunks[0].page_content)