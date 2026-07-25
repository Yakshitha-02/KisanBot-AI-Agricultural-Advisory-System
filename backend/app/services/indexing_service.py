from sqlalchemy.orm import Session

from app.models.document import Document
from app.services.rag.ingest import ingest_single


class IndexingService:

    @staticmethod
    def index_document(document: Document, db: Session):

        try:
            document.status = "Indexing"
            db.commit()

            ingest_single(document.filepath)

            document.status = "Indexed"
            document.is_indexed = True
            db.commit()

        except Exception:
            document.status = "Failed"
            db.commit()
            raise