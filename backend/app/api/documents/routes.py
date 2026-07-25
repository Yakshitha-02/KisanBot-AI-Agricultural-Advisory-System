from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.documents import DocumentResponse
from app.services.document_service import DocumentService
from app.api.dependencies import (
    get_current_user,
    get_admin_user,
)
from app.models.user import User
from fastapi.responses import FileResponse
from app.services.indexing_service import IndexingService

router = APIRouter()


@router.post(
    "/upload-document",
    response_model=DocumentResponse,
)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    document = DocumentService.save_document(
        file=file,
        db=db,
        uploaded_by=current_user.id,
    )

    IndexingService.index_document(document, db)

    return document
from typing import List

@router.get(
    "/documents",
    response_model=list[DocumentResponse],
)
async def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DocumentService.get_all_documents(db)

from fastapi import HTTPException
import os
from app.models.document import Document

@router.delete("/document/{id}")
async def delete_document(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    document = db.query(Document).filter(Document.id == id).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    if os.path.exists(document.filepath):
        os.remove(document.filepath)

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully."
    }
@router.get("/preview/{document_id}")
async def preview_document(
    document_id: int,
    db: Session = Depends(get_db),
):

    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return FileResponse(
        path=document.filepath,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline"
        },
    )
@router.get("/download/{document_id}")
async def download_document(
    document_id: int,
    db: Session = Depends(get_db),
):

    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return FileResponse(
        path=document.filepath,
        filename=document.filename,
        media_type="application/pdf",
    )
