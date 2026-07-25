import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>

      <h2 className="mt-6 text-xl font-semibold text-green-700">
        Analyzing Leaf...
      </h2>

      <p className="mt-2 text-gray-600">
        AI is detecting crop disease.
      </p>
    </div>
  );
};

export default LoadingSpinner;