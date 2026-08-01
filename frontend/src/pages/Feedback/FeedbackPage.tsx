import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  FiThumbsUp,
  FiThumbsDown,
  FiMessageSquare,
  FiSearch,
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { feedbackService } from "../../services/feedback";


interface FarmerFeedback {
  id: number;
  message: string;
  rating: "positive" | "negative";
  comment: string | null;
  created_at: string;
}

interface AdminFeedback {
  id: number;
  farmer_name: string;
  farmer_email: string;
  message: string;
  rating: "positive" | "negative";
  comment: string | null;
  created_at: string;
}

function FeedbackPage() {
  const { user } = useContext(AuthContext);

  const isAdmin = user?.role === "admin";
  const [feedbacks, setFeedbacks] = useState<
  FarmerFeedback[] | AdminFeedback[]
>([]);
const [search, setSearch] = useState("");
const stats = [
  {
    title: "Total Feedback",
    value: feedbacks.length,
    icon: <FiMessageSquare size={24} />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Positive",
    value: feedbacks.filter(
      (f) => f.rating === "positive"
    ).length,
    icon: <FiThumbsUp size={24} />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Negative",
    value: feedbacks.filter(
      (f) => f.rating === "negative"
    ).length,
    icon: <FiThumbsDown size={24} />,
    color: "bg-red-100 text-red-600",
  },
];
  useEffect(() => {
  loadFeedback();
}, [isAdmin]);

const loadFeedback = async () => {
  try {
    const response = isAdmin
      ? await feedbackService.getAllFeedback()
      : await feedbackService.getMyFeedback();

    setFeedbacks(response.data);
  } catch (err) {
    console.error(err);
  }
};
const filteredFeedback = feedbacks.filter((item) => {
  const query = search.toLowerCase();

  const formattedDate = new Date(item.created_at)
    .toLocaleDateString()
    .toLowerCase();

  if (isAdmin) {
    const feedback = item as AdminFeedback;

    return (
      feedback.farmer_name.toLowerCase().includes(query) ||
      feedback.farmer_email.toLowerCase().includes(query) ||
      feedback.message.toLowerCase().includes(query) ||
      feedback.rating.toLowerCase().includes(query) ||
      (feedback.comment ?? "").toLowerCase().includes(query) ||
      formattedDate.includes(query)
    );
  }

  const feedback = item as FarmerFeedback;

  return (
    feedback.message.toLowerCase().includes(query) ||
    feedback.rating.toLowerCase().includes(query) ||
    (feedback.comment ?? "").toLowerCase().includes(query) ||
    formattedDate.includes(query)
  );
});
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      
      {/* Hero */}

      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-green-700 p-8 text-white">

        <h1 className="text-4xl font-bold">
          {isAdmin
            ? "⭐ Feedback Analytics"
            : "📝 My Feedback"}
        </h1>

        <p className="mt-2 text-emerald-100">
          {isAdmin
            ? "Monitor farmer satisfaction and improve KisanBot AI."
            : "View feedback you've submitted to KisanBot."}
        </p>

      </div>

      {/* Stats */}

      {isAdmin && (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => (

            <div
              key={item.title}
              className="rounded-3xl bg-white p-6 shadow"
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

            </div>

          ))}

        </div>

      )}

      {/* Search */}

      <div className="rounded-3xl bg-white p-6 shadow">

        <div className="relative">

          <FiSearch
            className="absolute left-4 top-4 text-slate-400"
          />

          <input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search feedback..."
  className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:border-emerald-500"
/>

        </div>

      </div>

      {/* Feedback Cards */}

      <div className="space-y-5">
        {feedbacks.length === 0 && (
  <div className="rounded-3xl bg-white p-8 text-center shadow">
    <p className="text-slate-500">
      No feedback available yet.
    </p>
  </div>
)}
        {filteredFeedback.length === 0 && (
  <div className="rounded-3xl bg-white p-10 text-center shadow">
    <h3 className="text-xl font-semibold text-slate-700">
      No matching feedback found
    </h3>

    <p className="mt-2 text-slate-500">
      Try searching with another keyword.
    </p>
  </div>
)}
        {filteredFeedback.map((item) => (

          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            className="rounded-3xl bg-white p-6 shadow"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-xl font-semibold">
  {isAdmin
    ? (item as AdminFeedback).farmer_name
    : "AI Response"}
</h3>

{isAdmin && (
  <p className="text-slate-500">
    {(item as AdminFeedback).farmer_email}
  </p>
)}
              </div>

              <div className="text-right">

                <span
  className={`rounded-full px-3 py-1 text-sm font-semibold ${
    item.rating === "positive"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {item.rating === "positive"
    ? "👍 Positive"
    : "👎 Negative"}
</span>

                <p className="text-sm text-slate-500">

                  {new Date(item.created_at).toLocaleDateString()}

                </p>

              </div>

            </div>

            <p className="mt-4 text-slate-700">
  <br />
  {item.message}
</p>

{item.comment && (
  <p className="mt-4 text-slate-600">
    <strong>Comment:</strong>
    <br />
    {item.comment}
  </p>
)}

          </motion.div>

        ))}

      </div>

    </motion.div>
  );
}

export default FeedbackPage;