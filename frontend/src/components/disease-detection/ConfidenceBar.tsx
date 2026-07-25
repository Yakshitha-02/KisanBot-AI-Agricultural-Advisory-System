import React from "react";

interface Props {
  confidence: number;
}

const ConfidenceBar: React.FC<Props> = ({ confidence }) => {
  let color = "bg-red-500";

  if (confidence >= 70) color = "bg-green-600";
  else if (confidence >= 40) color = "bg-yellow-500";

  return (
    <div className="mt-4">
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium text-gray-700">Confidence</span>

        <span className="font-semibold">
          {confidence.toFixed(2)}%
        </span>
      </div>

      <div className="h-3 w-full rounded-full bg-gray-200">
        <div
          className={`${color} h-3 rounded-full transition-all duration-700`}
          style={{
            width: `${confidence}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;