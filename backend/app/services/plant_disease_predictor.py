from transformers import pipeline

classifier = None

def predict_disease(image_path):
    global classifier

    if classifier is None:
        classifier = pipeline(
            "image-classification",
            model="nateraw/vit-base-beans"
        )

    result = classifier(image_path)

    return {
        "prediction": result[0]["label"],
        "confidence": round(result[0]["score"] * 100, 2)
    }