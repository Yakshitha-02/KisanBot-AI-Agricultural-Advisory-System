from app.services.rag.pinecone_store import vector_store

retriever = vector_store.as_retriever(
    search_kwargs={"k":5}
)


def retrieve_documents(query):

    docs = retriever.invoke(query)

    return docs