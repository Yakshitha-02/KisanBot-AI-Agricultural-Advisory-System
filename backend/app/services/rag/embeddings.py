from typing import Optional

_embeddings_instance: Optional[object] = None


def get_embeddings():
    """Lazily create and return a HuggingFaceEmbeddings instance.

    This prevents the model weights from being downloaded during import,
    avoiding heavy HF downloads at application startup.
    """
    global _embeddings_instance

    if _embeddings_instance is None:
        from langchain_huggingface import HuggingFaceEmbeddings

        _embeddings_instance = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

    return _embeddings_instance