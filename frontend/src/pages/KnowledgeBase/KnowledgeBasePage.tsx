import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
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
  "Government",
  "Soil",
];

function KnowledgeBasePage() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [documents, setDocuments] = useState<any[]>([]);

  const [stats, setStats] = useState({
    documents: 0,
    indexed: 0,
    categories: 0,
    storage_mb: 0,
  });

  const statCards = [
    {
      title: "Documents",
      value: stats.documents,
      icon: <FiFileText size={26} />,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Indexed",
      value: stats.indexed,
      icon: <FiDatabase size={26} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: <FiFolder size={26} />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Storage",
      value: `${stats.storage_mb} MB`,
      icon: <FiUpload size={26} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  useEffect(() => {
    loadDocuments();
    loadStats();
  }, []);

  const loadStats = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/documents/stats");
    const data = await res.json();
    setStats(data);
  };

  const loadDocuments = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/documents/documents");
    const data = await res.json();
    setDocuments(data);
  };

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
  <>
    <input
      type="file"
      id="uploadPDF"
      accept=".pdf"
      hidden
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        await fetch("http://127.0.0.1:8000/api/documents/upload-document", {
          method: "POST",
          body: formData,
        });

        await loadDocuments();
await loadStats();
      }}
    />

    <button
      onClick={() => document.getElementById("uploadPDF")?.click()}
      className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:scale-105"
    >
      <FiUpload />
      Upload Document
    </button>
  </>
)}

        </div>

      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {statCards.map((item) => (

          <motion.div
            whileHover={{ y: -4 }}
            key={item.title}
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

              <div
                className={`rounded-2xl p-4 ${item.color}`}
              >
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

        {/* Filters */}

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

        {<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

  {documents.map((doc) => (

    <motion.div
      key={doc.id}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
    >

      {/* Top */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-emerald-100 p-4">

            <FiFileText
              size={28}
              className="text-emerald-600"
            />

          </div>

          <div>

            <h3 className="font-semibold text-lg">

              {doc.title}

            </h3>

            <p className="text-sm text-slate-500">

              {doc.source}

            </p>

          </div>

        </div>

      </div>

      {/* Info */}

      <div className="mt-6 flex flex-wrap gap-2">

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">

          {doc.category}

        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">

          {doc.pages} Pages

        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">

          {doc.size}

        </span>

      </div>

      {/* Status */}

      <div className="mt-6 flex items-center justify-between">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            doc.status === "Indexed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {doc.status === "Indexed"
            ? "🟢 Indexed"
            : "🟡 Processing"}
        </span>

        <span className="text-xs text-slate-500">

          {doc.uploaded}

        </span>

      </div>

      {/* Divider */}

      <div className="my-6 border-t" />

      {/* Actions */}

      <div className="flex flex-wrap gap-3">

        <button
  onClick={() =>
    window.open(
  `http://127.0.0.1:8000/api/documents/preview/${encodeURIComponent(doc.filename)}`,
  "_blank"
)
  }
  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 transition hover:bg-slate-50"
>
  👁 Preview
</button>
<button
  onClick={async () => {
    const language = prompt("Enter language (Hindi, Kannada, Tamil, Telugu)");

    if (!language) return;

    const response = await fetch(
  `http://127.0.0.1:8000/api/documents/translate/${encodeURIComponent(doc.filename)}/${language}`
);

    const data = await response.json();

    console.log(data);
    console.log(data.translation);
  }}
  className="flex items-center justify-center rounded-xl border border-green-200 px-4 py-2 text-green-600 hover:bg-green-50"
>
  🌐 Translate
</button>

        <button
  onClick={async () => {
    if (!window.confirm("Delete this PDF?")) return;

    await fetch(
  `http://127.0.0.1:8000/api/documents/delete/${encodeURIComponent(doc.filename)}`,
  {
    method: "DELETE",
  }
);

    await loadDocuments();
  }}
  className="flex items-center justify-center rounded-xl border border-red-200 px-4 py-2 text-red-600 transition hover:bg-red-50"
>
  🗑
</button>
      </div>

    </motion.div>

  ))}

</div>}

      </div>

    </motion.div>
  );
}

export default KnowledgeBasePage;