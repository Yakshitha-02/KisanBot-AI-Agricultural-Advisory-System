from pinecone import Pinecone

from langchain_pinecone import PineconeVectorStore

from app.core.config import settings
from app.services.rag.embeddings import get_embeddings

pc = Pinecone(api_key=settings.pinecone_api_key)

index = pc.Index(settings.pinecone_index_name)

# Use lazy-loaded embeddings to avoid HF weight downloads at import time.
vector_store = PineconeVectorStore(
    index=index,
    embedding=get_embeddings(),
)