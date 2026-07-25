import React from "react";

interface Props {
  disease: string;
}

const RecommendationCard: React.FC<Props> = ({ disease }) => {
  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">

      <h2 className="mb-5 text-2xl font-bold text-green-700">
        🌱 AI Agricultural Recommendation
      </h2>

      <div className="space-y-6">

        {/* Symptoms */}

        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            🌿 Symptoms
          </h3>

          <ul className="list-disc space-y-1 pl-6 text-gray-600">
            <li>Visible spots or discoloration on leaves.</li>
            <li>Leaf curling or drying.</li>
            <li>Reduced crop growth.</li>
          </ul>
        </div>

        {/* Treatment */}

        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            💊 Treatment
          </h3>

          <ul className="list-disc space-y-1 pl-6 text-gray-600">
            <li>Apply recommended fungicide or pesticide.</li>
            <li>Remove infected leaves immediately.</li>
            <li>Avoid overwatering.</li>
          </ul>
        </div>

        {/* Prevention */}

        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            🛡 Prevention
          </h3>

          <ul className="list-disc space-y-1 pl-6 text-gray-600">
            <li>Maintain proper field hygiene.</li>
            <li>Use certified disease-free seeds.</li>
            <li>Monitor crops regularly.</li>
          </ul>
        </div>

        {/* AI Summary */}

        <div className="rounded-lg bg-green-50 p-4 border border-green-200">

          <h3 className="mb-2 text-lg font-semibold text-green-700">
            🤖 AI Summary
          </h3>

          <p className="text-gray-700">
            Based on the uploaded image, the detected disease is{" "}
            <span className="font-bold text-green-700">
              {disease}
            </span>.
            Please follow the recommended treatment and prevention
            measures. For severe infections, consult your nearest
            agricultural extension officer.
          </p>

        </div>

      </div>
    </div>
  );
};

export default RecommendationCard;