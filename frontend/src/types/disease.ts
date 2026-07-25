export interface Prediction {
    disease: string;
    confidence: number;
}

export interface TopPrediction {
    disease: string;
    confidence: number;
}

export interface DiseaseResponse {
    prediction: Prediction;
    top_predictions: TopPrediction[];
    warning?: string | null;
}

export interface ApiResponse {
    success?: boolean;
    filename?: string;
    prediction: Prediction;
    top_predictions: TopPrediction[];
    warning?: string | null;
}