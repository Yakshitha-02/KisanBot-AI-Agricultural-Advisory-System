from app.services.rag.embeddings import get_embedding

vector = get_embedding(
    "Rice is one of the major crops in India."
)

print("Embedding Length:", len(vector))

print()

print(vector[:10])