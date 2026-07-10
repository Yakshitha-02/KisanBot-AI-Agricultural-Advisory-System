from tqdm import tqdm

from app.services.rag.loader import load_documents
from app.services.rag.chunker import split_documents
from app.services.rag.embeddings import get_embedding
from app.services.rag.pinecone_store import index


def ingest():

    print("Loading PDFs...")

    docs = load_documents()

    print("Chunking...")

    chunks = split_documents(docs)

    print(f"Uploading {len(chunks)} chunks...\n")

    vectors = []

    for i, chunk in enumerate(tqdm(chunks)):

        vectors.append(
            {
                "id": f"chunk-{i}",
                "values": get_embedding(chunk.page_content),
                "metadata": {
                    "text": chunk.page_content,
                    "source": chunk.metadata.get("source", ""),
                    "page": chunk.metadata.get("page", 0),
                },
            }
        )

        # Upload in batches of 100
        if len(vectors) == 100:

            index.upsert(vectors=vectors)

            vectors = []

    # Upload remaining vectors
    if vectors:

        index.upsert(vectors=vectors)

    print("\n✅ Upload Completed!")


if __name__ == "__main__":
    ingest()