from pathlib import Path
import shutil
import fitz

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from app.utils.pdf_utils import extract_text
from app.services.translator import translate_from_english

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parents[3]
PDF_FOLDER = BASE_DIR / "knowledge_base"
PDF_FOLDER.mkdir(exist_ok=True)


# ----------------------------
# Upload Document
# ----------------------------
@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    file_path = PDF_FOLDER / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename
    }


# ----------------------------
# Get Dashboard Statistics
# ----------------------------
@router.get("/stats")
async def get_stats():

    total_documents = 0
    total_pages = 0
    total_size = 0

    categories = set()

    for pdf in PDF_FOLDER.rglob("*.pdf"):

        total_documents += 1

        total_size += pdf.stat().st_size

        categories.add(pdf.parent.name)

        try:
            doc = fitz.open(pdf)
            total_pages += doc.page_count
            doc.close()

        except Exception:
            pass

    return {
        "documents": total_documents,
        "indexed": total_documents,      # Replace with Pinecone count later
        "categories": len(categories),
        "storage_mb": round(total_size / (1024 * 1024), 2),
        "pages": total_pages
    }


# ----------------------------
# Get Documents
# ----------------------------
@router.get("/documents")
async def get_documents():

    documents = []

    for i, pdf in enumerate(PDF_FOLDER.rglob("*.pdf"), start=1):

        try:
            doc = fitz.open(pdf)
            page_count = doc.page_count
            doc.close()

        except Exception:
            page_count = "-"

        documents.append(
            {
                "id": i,
                "title": pdf.stem,
                "filename": pdf.name,
                "size": f"{round(pdf.stat().st_size/(1024*1024),2)} MB",
                "pages": page_count,
                "source": "Knowledge Base",
                "category": pdf.parent.name,
                "status": "Indexed",
                "uploaded": "Available",
            }
        )

    return documents


# ----------------------------
# Preview PDF
# ----------------------------
@router.get("/preview/{filename}")
async def preview_document(filename: str):

    file = None

    for pdf in PDF_FOLDER.rglob("*.pdf"):
        if pdf.name == filename:
            file = pdf
            break

    if file is None:
        raise HTTPException(
            status_code=404,
            detail="PDF not found"
        )

    return FileResponse(
        file,
        media_type="application/pdf"
    )


# ----------------------------
# Translate PDF
# ----------------------------
@router.get("/translate/{filename}/{language}")
async def translate_document(filename: str, language: str):

    file = None

    for pdf in PDF_FOLDER.rglob("*.pdf"):
        if pdf.name == filename:
            file = pdf
            break

    if file is None:
        raise HTTPException(
            status_code=404,
            detail="PDF not found"
        )

    text = extract_text(file)

    print("\n========== EXTRACTED TEXT ==========")
    print(text[:1000])
    print("===================================\n")

    translated_text = translate_from_english(
        text,
        language
    )

    return {
        "filename": filename,
        "language": language,
        "translation": translated_text,
    }


# ----------------------------
# Delete PDF
# ----------------------------
@router.delete("/delete/{filename}")
async def delete_document(filename: str):

    file = None

    for pdf in PDF_FOLDER.rglob("*.pdf"):
        if pdf.name == filename:
            file = pdf
            break

    if file is None:
        raise HTTPException(
            status_code=404,
            detail="PDF not found"
        )

    file.unlink()

    return {
        "message": "Document deleted successfully"
    }