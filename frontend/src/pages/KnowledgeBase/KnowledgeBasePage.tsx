import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  FiUpload,
  FiSearch,
  FiDatabase,
  FiFileText,
  FiFolder,
} from "react-icons/fi";

const stats = [
  {
    title: "Documents",
    value: "156",
    icon: <FiFileText size={26} />,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Indexed",
    value: "152",
    icon: <FiDatabase size={26} />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Categories",
    value: "8",
    icon: <FiFolder size={26} />,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Storage",
    value: "245 MB",
    icon: <FiUpload size={26} />,
    color: "bg-purple-100 text-purple-600",
  },
];

const filters = [
  "All",
  "Crops",
  "Diseases",
  "Weather",
  "Government",
  "Soil",
];
const documents = [
  {
    id: 1,
    title: "Tomato Diseases.pdf",
    source: "ICAR",
    category: "Diseases",
    pages: 245,
    status: "Indexed",
    size: "12.4 MB",
    uploaded: "2 days ago",
  },
  {
    id: 2,
    title: "Rice Cultivation Guide.pdf",
    source: "Government",
    category: "Crops",
    pages: 118,
    status: "Indexed",
    size: "7.8 MB",
    uploaded: "Yesterday",
  },
  {
    id: 3,
    title: "Cotton Pest Management.pdf",
    source: "KVK",
    category: "Diseases",
    pages: 176,
    status: "Processing",
    size: "15.1 MB",
    uploaded: "Today",
  },
  {
    id: 4,
    title: "Weather Advisory Handbook.pdf",
    source: "IMD",
    category: "Weather",
    pages: 82,
    status: "Indexed",
    size: "5.2 MB",
    uploaded: "Last week",
  },
];

function KnowledgeBasePage() {
  // Later this will come from login
  const { user } = useContext(AuthContext);
const isAdmin = user?.role === "admin";

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

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
            <button
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:scale-105"
            >
              <FiUpload />

              Upload Document
            </button>
          )}

        </div>

      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => (

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

        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 transition hover:bg-slate-50">

          👁 Preview

        </button>

        {isAdmin && (

          <button className="flex items-center justify-center rounded-xl border border-blue-200 px-4 py-2 text-blue-600 transition hover:bg-blue-50">

            ✏ Edit

          </button>

        )}

        {isAdmin && (

          <button className="flex items-center justify-center rounded-xl border border-red-200 px-4 py-2 text-red-600 transition hover:bg-red-50">

            🗑

          </button>

        )}

      </div>

    </motion.div>

  ))}

</div>}

      </div>

    </motion.div>
  );
}

export default KnowledgeBasePage;