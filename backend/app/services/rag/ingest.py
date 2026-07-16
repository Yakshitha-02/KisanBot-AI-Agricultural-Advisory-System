from app.services.rag.loader import load_documents
from app.services.rag.chunker import split_documents
from app.services.rag.pinecone_store import vector_store


def ingest():

    print("Loading PDFs...")

    docs = load_documents()

    print("Chunking...")

    chunks = split_documents(docs)

    print("Uploading to Pinecone...")

    vector_store.add_documents(chunks)

    print("Upload Completed")


if __name__ == "__main__":
    ingest()