# from app.services.plant_disease_predictor import predict_disease as model_predict_disease
from fastapi import APIRouter, UploadFile, File
from app.services.plant_disease_predictor import predict_disease as model_predict_disease
import shutil
import os

router = APIRouter(tags=["Disease Detection"])

@router.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    prediction = "test"

    os.makedirs("uploads", exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    prediction = model_predict_disease(file_path)

    return {
        "filename": file.filename,
        "prediction": prediction
    }