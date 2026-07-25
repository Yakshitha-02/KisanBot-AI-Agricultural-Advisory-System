import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { documentAPI } from "../../services/api";

import {
  FiUpload,
  FiSearch,
  FiDatabase,
  FiFileText,
  FiFolder,
} from "react-icons/fi";

const filters = [
  "All",
  "Crops",
  "Diseases",
  "Weather",
  "Farming",
  "Market",
  "Schemes",
  "Recently-Uploaded"
];

interface Document {
  id: number;
  title: string;
  filename: string;
  filepath: string;
  file_size: number;
  pages: number;
  language: string;
  category: string;
  status: string;
  uploaded_by: number;
  uploaded_at: string;
}

function KnowledgeBasePage() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const data = await documentAPI.getAll();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await documentAPI.delete(id);
      loadDocuments();
    } catch (err) {
      console.error(err);
      alert("Unable to delete document.");
    }
  };
  const handlePreview = (id: number) => {
  window.open(
    documentAPI.preview(id),
    "_blank"
  );
};
const handleDownload = (id: number) => {
  window.open(
    documentAPI.download(id),
    "_blank"
  );
};

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      await documentAPI.upload(file);
      loadDocuments();
      alert("Document uploaded successfully.");
    } catch (err: any) {
      alert(
        err?.response?.data?.detail ??
          "Upload failed."
      );
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      selectedFilter === "All" ||
      doc.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      title: "Documents",
      value: documents.length,
      icon: <FiFileText size={26} />,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Uploaded",
      value: documents.filter(
        (d) => d.status === "Uploaded"
      ).length,
      icon: <FiDatabase size={26} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Categories",
      value: new Set(
        documents.map((d) => d.category)
      ).size,
      icon: <FiFolder size={26} />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Storage",
      value:
        (
          documents.reduce(
            (sum, d) => sum + d.file_size,
            0
          ) /
          1024 /
          1024
        ).toFixed(2) + " MB",
      icon: <FiUpload size={26} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
            {/* Hero */}

      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-8 text-white shadow-xl">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              📚 Knowledge Base
            </h1>

            <p className="mt-3 max-w-2xl text-emerald-100">
              Manage agricultural documents that power KisanBot AI.
              Upload PDFs, organize resources, and maintain the
              knowledge repository.
            </p>

          </div>

          {isAdmin && (

            <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:scale-105">

              <FiUpload />

              Upload Document

              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={handleUpload}
              />

            </label>

          )}

        </div>

      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => (

          <motion.div
            key={item.title}
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-white p-6 shadow-md"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {item.value}
                </h2>

              </div>

              <div className={`rounded-2xl p-4 ${item.color}`}>
                {item.icon}
              </div>

            </div>

          </motion.div>

        ))}

      </div>

      {/* Search */}

      <div className="rounded-3xl bg-white p-6 shadow-md">

        <div className="relative">

          <FiSearch
            className="absolute left-4 top-4 text-slate-400"
            size={20}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-emerald-500"
          />

        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          {filters.map((filter) => (

            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                selectedFilter === filter
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >

              {filter}

            </button>

          ))}

        </div>

      </div>

      {/* Documents */}

      <div>

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Documents
            </h2>

            <p className="text-slate-500">
              Agricultural resources available for AI retrieval
            </p>

          </div>

        </div>

        {loading ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow">

            Loading documents...

          </div>

        ) : filteredDocuments.length === 0 ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow">

            No documents found.

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredDocuments.map((doc) => (

  <motion.div
    key={doc.id}
    whileHover={{ y: -6 }}
    transition={{ duration: 0.2 }}
    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
  >

    {/* Header */}

    <div className="flex items-start justify-between">

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-emerald-100 p-4">

          <FiFileText
            size={28}
            className="text-emerald-600"
          />

        </div>

        <div>

          <h3 className="font-semibold text-lg break-words">

            {doc.title}

          </h3>

          <p className="text-sm text-slate-500">

            Uploaded by Admin

          </p>

        </div>

      </div>

    </div>

    {/* Information */}

    <div className="mt-6 flex flex-wrap gap-2">

      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">

        {doc.category}

      </span>

      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">

        {doc.pages} Pages

      </span>

      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">

        {(doc.file_size / 1024).toFixed(1)} KB

      </span>

      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">

        {doc.language}

      </span>

    </div>

    {/* Status */}

    <div className="mt-6 flex items-center justify-between">

      <span
  className={`rounded-full px-3 py-1 text-xs font-semibold ${
    doc.status === "Indexed"
      ? "bg-green-100 text-green-700"
      : doc.status === "Processing"
      ? "bg-yellow-100 text-yellow-700"
      : doc.status === "Failed"
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700"
  }`}
>
  {doc.status === "Indexed"
    ? "🟢 Indexed"
    : doc.status === "Processing"
    ? "🟡 Processing"
    : doc.status === "Failed"
    ? "🔴 Failed"
    : "🔵 Uploaded"}
</span>

      <span className="text-xs text-slate-500">

        {new Date(doc.uploaded_at).toLocaleDateString()}

      </span>

    </div>

    <div className="my-6 border-t" />

    {/* Actions */}

    <div className="flex flex-wrap gap-3">

      <button
  onClick={() => handlePreview(doc.id)}
  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 transition hover:bg-slate-50"
>
  👁 Preview
</button>
<button
  onClick={() => handleDownload(doc.id)}
  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-200 py-2 text-green-700 transition hover:bg-green-50"
>
  ⬇ Download
</button>

      {isAdmin && (

        <button
          onClick={() => handleDelete(doc.id)}
          className="rounded-xl border border-red-200 px-4 py-2 text-red-600 transition hover:bg-red-50"
        >

          🗑 Delete

        </button>

      )}

    </div>

  </motion.div>

))}
          </div>

        )}

      </div>

    </motion.div>
  );
}

export default KnowledgeBasePage;