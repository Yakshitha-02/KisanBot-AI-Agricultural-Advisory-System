from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

# Load processor
processor = AutoImageProcessor.from_pretrained("microsoft/resnet-50")

# Load disease classification model
model = AutoModelForImageClassification.from_pretrained(
    "SanketJadhav/PlantDiseaseClassifier-Resnet50"
)


def clean_label(label):
    """
    Convert labels like:
    Potato___Early_blight
    into:
    Potato Early Blight
    """
    return (
        label.replace("___", " ")
             .replace("_", " ")
             .title()
    )


def predict_disease(image_path):
    # Open image
    image = Image.open(image_path).convert("RGB")

    # Preprocess
    inputs = processor(images=image, return_tensors="pt")

    # Prediction
    with torch.no_grad():
        outputs = model(**inputs)

    # Convert logits to probabilities
    probs = torch.softmax(outputs.logits, dim=-1)[0]

    # Top prediction
    top_index = probs.argmax().item()

    disease = clean_label(model.config.id2label[top_index])
    confidence = round(probs[top_index].item() * 100, 2)

    # Top 3 predictions
    top3_probs, top3_indices = torch.topk(probs, 3)

    top_predictions = []

    for prob, idx in zip(top3_probs, top3_indices):
        top_predictions.append({
            "disease": clean_label(model.config.id2label[idx.item()]),
            "confidence": round(prob.item() * 100, 2)
        })

    # Confidence warning
    warning = None

    if confidence < 40:
        warning = (
            "Low confidence prediction. "
            "Please upload a clearer image for better results."
        )

    return {
        "prediction": {
            "disease": disease,
            "confidence": confidence
        },
        "top_predictions": top_predictions,
        "warning": warning
    }