import os
import shutil
import fitz  
from fastapi import HTTPException


from app.models.document import Document

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

UPLOAD_DIR = os.path.join(
    BASE_DIR,
    "knowledge_base",
    "originals"
)

os.makedirs(UPLOAD_DIR, exist_ok=True)

os.makedirs(UPLOAD_DIR, exist_ok=True)


class DocumentService:
    @staticmethod
    def get_all_documents(db):
        return db.query(Document).order_by(Document.uploaded_at.desc()).all()
    @staticmethod
    def save_document(file, db, uploaded_by):

        # Save PDF
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        if os.path.exists(file_path):
          raise HTTPException(
            status_code=409,
            detail="A PDF with the same name already exists. Please rename the file and upload it again."
         )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Read PDF metadata
        pdf = fitz.open(file_path)

        pages = pdf.page_count

        pdf.close()

        size = os.path.getsize(file_path)

        # Save metadata
        document = Document(
            title=file.filename,
            filename=file.filename,
            filepath=file_path,
            file_size=size,
            pages=pages,
            uploaded_by=uploaded_by,
            status="Uploaded",
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return document