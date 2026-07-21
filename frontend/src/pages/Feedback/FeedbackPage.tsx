import { motion } from "framer-motion";
import { useContext } from "react";
import {
  FiStar,
  FiThumbsUp,
  FiThumbsDown,
  FiMessageSquare,
  FiSearch,
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

const stats = [
  {
    title: "Average Rating",
    value: "4.8 ⭐",
    icon: <FiStar size={24} />,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Total Feedback",
    value: "421",
    icon: <FiMessageSquare size={24} />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Positive",
    value: "392",
    icon: <FiThumbsUp size={24} />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Negative",
    value: "29",
    icon: <FiThumbsDown size={24} />,
    color: "bg-red-100 text-red-600",
  },
];

const feedbacks = [
  {
    id: 1,
    farmer: "Ravi Kumar",
    crop: "Tomato",
    rating: 5,
    comment:
      "Very helpful recommendation. The disease was correctly identified.",
    date: "21 Jul 2026",
  },
  {
    id: 2,
    farmer: "Lakshmi",
    crop: "Rice",
    rating: 4,
    comment:
      "Good answer. Would like more fertilizer dosage details.",
    date: "20 Jul 2026",
  },
  {
    id: 3,
    farmer: "Suresh",
    crop: "Cotton",
    rating: 2,
    comment:
      "Weather recommendation was inaccurate for my village.",
    date: "19 Jul 2026",
  },
];

function FeedbackPage() {
  const { user } = useContext(AuthContext);

  const isAdmin = user?.role === "admin";

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
            placeholder="Search feedback..."
            className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:border-emerald-500"
          />

        </div>

      </div>

      {/* Feedback Cards */}

      <div className="space-y-5">

        {feedbacks.map((item) => (

          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            className="rounded-3xl bg-white p-6 shadow"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-xl font-semibold">

                  {item.crop}

                </h3>

                <p className="text-slate-500">

                  Farmer: {item.farmer}

                </p>

              </div>

              <div className="text-right">

                <p className="text-yellow-500">

                  {"⭐".repeat(item.rating)}

                </p>

                <p className="text-sm text-slate-500">

                  {item.date}

                </p>

              </div>

            </div>

            <p className="mt-5 text-slate-700">

              {item.comment}

            </p>

          </motion.div>

        ))}

      </div>

    </motion.div>
  );
}

export default FeedbackPage;