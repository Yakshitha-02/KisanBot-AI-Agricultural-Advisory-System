import os
import sys
import fitz

# Allow imports from app/
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.database.session import SessionLocal
from app.models.document import Document

db = SessionLocal()

BASE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "knowledge_base",
)

SKIP_FOLDERS = {"originals", "temp", "__pycache__"}

print("Scanning Knowledge Base...\n")

count = 0

for category in os.listdir(BASE_DIR):

    category_path = os.path.join(BASE_DIR, category)

    if (
        not os.path.isdir(category_path)
        or category in SKIP_FOLDERS
    ):
        continue

    print(f"Category: {category}")

    for filename in os.listdir(category_path):

        if not filename.lower().endswith(".pdf"):
            continue

        filepath = os.path.join(category_path, filename)

        # Skip if already imported
        exists = (
            db.query(Document)
            .filter(Document.filepath == filepath)
            .first()
        )

        if exists:
            print(f"  Skipped: {filename}")
            continue

        pdf = fitz.open(filepath)

        pages = pdf.page_count

        pdf.close()

        size = os.path.getsize(filepath)

        document = Document(
            title=filename,
            filename=filename,
            filepath=filepath,
            file_size=size,
            pages=pages,
            language="English",
            category=category.capitalize(),
            status="Uploaded",
            uploaded_by=1,
        )

        db.add(document)

        count += 1

        print(f"  Imported: {filename}")

db.commit()

print(f"\nFinished! Imported {count} documents.")