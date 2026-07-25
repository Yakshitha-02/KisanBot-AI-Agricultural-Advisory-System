from app.services.pdf_service import PDFService

text = PDFService.extract_text(
    "knowledge_base/originals/Banana.pdf"
)

print(text[:1000])