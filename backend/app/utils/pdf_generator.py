from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FONT_DIR = os.path.join(BASE_DIR, "fonts")

FONT_MAP = {
    "English": ("NotoSans", "NotoSans-Regular.ttf"),
    "Hindi": ("NotoSansDevanagari", "NotoSansDevanagari-Regular.ttf"),
    "Kannada": ("NotoSansKannada", "NotoSansKannada-Regular.ttf"),
    "Tamil": ("NotoSansTamil", "NotoSansTamil-Regular.ttf"),
    "Telugu": ("NotoSansTelugu", "NotoSansTelugu-Regular.ttf"),
    "Malayalam": ("NotoSansMalayalam", "NotoSansMalayalam-Regular.ttf"),
}


def generate_pdf(text: str, language: str):
    font_name, font_file = FONT_MAP.get(
        language,
        FONT_MAP["English"]
    )

    pdfmetrics.registerFont(
        TTFont(font_name, os.path.join(FONT_DIR, font_file))
    )

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    style = getSampleStyleSheet()["BodyText"]
    style.fontName = font_name
    style.leading = 20

    story = []

    for line in text.split("\n"):
        if line.strip():
            story.append(Paragraph(line, style))

    doc.build(story)

    buffer.seek(0)

    return buffer