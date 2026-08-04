from fastapi import APIRouter, UploadFile, File, Form
from app.services.plant_disease_predictor import (
    predict_disease as model_predict_disease,
)
from app.services.translator import translate_from_english
import shutil
import os

router = APIRouter(tags=["Disease Detection"])


@router.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    language: str = Form("English"),
):
    file_path = f"uploads/{file.filename}"

    os.makedirs("uploads", exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    prediction = model_predict_disease(file_path)

    disease = prediction["prediction"]["disease"]

    warning = prediction["warning"] or ""

    translated_disease = translate_from_english(
        disease,
        language,
    )

    translated_warning = (
        translate_from_english(warning, language)
        if warning
        else ""
    )

    translated_top_predictions = []

    for item in prediction["top_predictions"]:

        translated_top_predictions.append(
            {
                "disease": translate_from_english(
                    item["disease"],
                    language,
                ),
                "confidence": item["confidence"],
            }
        )

    return {
        "filename": file.filename,
        "language": language,
        "prediction": {
            "disease": disease,
            "translated_disease": translated_disease,
            "confidence": prediction["prediction"]["confidence"],
        },
        "top_predictions": translated_top_predictions,
        "warning": translated_warning,
    }