import React from "react";
import ConfidenceBar from "./ConfidenceBar";
import { ApiResponse } from "../../types/disease";

interface Props {
  result: ApiResponse | null;
}

const DiseaseResult: React.FC<Props> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">

      <h2 className="mb-5 text-2xl font-bold text-green-700">
        🦠 Disease Detection Result
      </h2>

      {/* Main Prediction */}

      <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">

        <h3 className="text-lg font-semibold text-gray-700">
          Predicted Disease
        </h3>

        <p className="mt-2 text-3xl font-bold text-green-700">
          {result.prediction.translated_disease ??
result.prediction.disease}
        </p>

        <ConfidenceBar confidence={result.prediction.confidence} />

      </div>

      {/* Top Predictions */}

      <div className="mb-6">

        <h3 className="mb-3 text-lg font-semibold text-gray-700">
          Top Predictions
        </h3>

        <div className="space-y-3">

          {result.top_predictions.map((item, index) => (

            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <span className="font-medium">
                {item.disease}
              </span>

              <span className="font-bold text-green-700">
                {item.confidence.toFixed(2)}%
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Warning */}

      {result.warning && (

        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">

          <p className="font-medium text-yellow-700">
            ⚠ {result.warning}
          </p>

        </div>

      )}

    </div>
  );
};

export default DiseaseResult;