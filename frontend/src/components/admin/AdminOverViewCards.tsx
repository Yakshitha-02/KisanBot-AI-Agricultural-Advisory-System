import { useEffect, useState } from "react";
import {
  FiUsers,
  FiUser,
  FiMessageSquare,
  FiThumbsUp,
} from "react-icons/fi";

import { adminService } from "../../services/admin";

function AdminOverviewCards() {

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminService.getDashboard();
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    {
      title: "Total Users",
      value: stats?.total_users ?? 0,
      icon: <FiUsers size={24} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Farmers",
      value: stats?.total_farmers ?? 0,
      icon: <FiUser size={24} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Messages",
      value: stats?.total_messages ?? 0,
      icon: <FiMessageSquare size={24} />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Positive Feedback",
      value: stats?.positive_feedback ?? 0,
      icon: <FiThumbsUp size={24} />,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl bg-white p-6 shadow"
        >
          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {card.value}
              </h2>

            </div>

            <div className={`rounded-2xl p-4 ${card.color}`}>
              {card.icon}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminOverviewCards;