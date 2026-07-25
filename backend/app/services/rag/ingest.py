from app.services.rag.loader import (
    load_documents,
    load_single_document,
)

from app.services.rag.chunker import split_documents
from app.services.rag.pinecone_store import vector_store


def ingest():
    """
    Index all PDFs in the knowledge_base folder.
    Used only for initial dataset indexing.
    """

    print("Loading PDFs...")

    docs = load_documents()

    print("Chunking...")

    chunks = split_documents(docs)

    print("Uploading to Pinecone...")

    vector_store.add_documents(chunks)

    print("Upload Completed")


def ingest_single(pdf_path: str):

    print("=" * 50)
    print("Loading PDF:", pdf_path)

    docs = load_single_document(pdf_path)
    print(f"Loaded {len(docs)} pages")

    print("Starting chunking...")
    chunks = split_documents(docs)
    print(f"Created {len(chunks)} chunks")

    print("Uploading to Pinecone...")
    vector_store.add_documents(chunks)

    print("Upload Completed")
    print("=" * 50)