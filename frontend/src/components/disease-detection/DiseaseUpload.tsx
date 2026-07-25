import React, { useRef } from "react";

interface Props {
  selectedImage: File | null;
  preview: string | null;
  loading: boolean;
  onFileChange: (file: File) => void;
  onAnalyze: () => void;
}

const DiseaseUpload: React.FC<Props> = ({
  selectedImage,
  preview,
  loading,
  onFileChange,
  onAnalyze,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">

      <h2 className="mb-5 text-2xl font-bold text-green-700">
        🌿 Crop Disease Detection
      </h2>

      <div
        onClick={handleBrowse}
        className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-green-50 transition hover:bg-green-100"
      >
        {preview ? (
          <img
            src={preview}
            alt="Leaf Preview"
            className="h-full w-full rounded-xl object-contain"
          />
        ) : (
          <>
            <div className="text-6xl">📷</div>

            <p className="mt-4 text-lg font-semibold text-gray-700">
              Click to Upload
            </p>

            <p className="text-gray-500">
              JPG, JPEG or PNG
            </p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleChange}
      />

      <button
        disabled={!selectedImage || loading}
        onClick={onAnalyze}
        className="mt-6 w-full rounded-lg bg-green-600 py-3 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>
    </div>
  );
};

export default DiseaseUpload;