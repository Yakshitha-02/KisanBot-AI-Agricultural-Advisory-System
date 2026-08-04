export interface Prediction {
  disease: string;
  translated_disease?: string;
  confidence: number;
}

export interface TopPrediction {
  disease: string;
  confidence: number;
}

export interface ApiResponse {
  filename: string;
  language: string;

  prediction: Prediction;

  top_predictions: TopPrediction[];

  warning?: string;
}