from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader

def load_single_document(pdf_path: str):

    print(f"Loading: {pdf_path}")

    loader = PyPDFLoader(pdf_path)

    return loader.load()

def load_documents():

    documents = []

    pdf_folder = Path("knowledge_base")

    for pdf in pdf_folder.rglob("*.pdf"):

        print(f"Loading: {pdf.name}")

        loader = PyPDFLoader(str(pdf))

        documents.extend(loader.load())

    return documents