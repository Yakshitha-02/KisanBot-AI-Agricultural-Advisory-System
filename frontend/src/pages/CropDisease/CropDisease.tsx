import { useState } from "react";

import DiseaseUpload from "../../components/disease-detection/DiseaseUpload";
import DiseaseResult from "../../components/disease-detection/DiseaseResult";
import LoadingSpinner from "../../components/disease-detection/LoadingSpinner";

import { predictDisease } from "../../services/diseaseService";
import { ApiResponse } from "../../types/disease";

const CropDisease = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState("English");

  const handleFileChange = (file: File) => {
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);
      setError("");

      const response = await predictDisease(
        selectedImage,
        language
      );

      console.log(response);

      setResult(response);
    } catch (err) {
      console.error(err);
      setError("Unable to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-center text-4xl font-bold text-green-700">
          🌿 Crop Disease Detection
        </h1>

        <p className="mb-8 text-center text-gray-600">
          Upload a leaf image and let AI detect the disease.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            <div>
              <label className="mb-2 block text-lg font-semibold text-gray-700">
                🌐 Select Output Language
              </label>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:border-green-600 focus:outline-none"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Telugu</option>
                <option>Kannada</option>
                <option>Tamil</option>
                <option>Malayalam</option>
                <option>Marathi</option>
                <option>Gujarati</option>
                <option>Punjabi</option>
              </select>
            </div>

            <DiseaseUpload
              selectedImage={selectedImage}
              preview={preview}
              loading={loading}
              onFileChange={handleFileChange}
              onAnalyze={handleAnalyze}
            />

          </div>

          {/* RIGHT SIDE */}

          <div>

            {loading && <LoadingSpinner />}

            {!loading && result && (
              <DiseaseResult result={result} />
            )}

            {!loading && error && (
              <div className="rounded-lg bg-red-100 p-4 text-red-600">
                {error}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default CropDisease;