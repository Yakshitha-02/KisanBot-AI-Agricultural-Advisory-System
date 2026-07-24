import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import {
  FiHome,
  FiMessageSquare,
  FiBookOpen,
  FiMessageCircle,
  FiBell,
  FiLogOut,
} from "react-icons/fi";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      to: user?.role === "admin" ? "/admin/dashboard" : "/farmer/dashboard",
      label: "Dashboard",
      icon: <FiHome />,
    },
    {
      to: "/chat",
      label: "Chat",
      icon: <FiMessageSquare />,
    },
    {
      to: "/knowledge-base",
      label: "Knowledge",
      icon: <FiBookOpen />,
    },
    {
      to: "/feedback",
      label: "Feedback",
      icon: <FiMessageCircle />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link
          to={
            user
              ? user.role === "admin"
                ? "/admin/dashboard"
                : "/farmer/dashboard"
              : "/"
          }
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg">
            <Leaf size={24} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              KisanBot
            </h1>

            <p className="text-xs text-slate-500">
              AI Farming Assistant
            </p>
          </div>
        </Link>

        {user && (
          <nav className="hidden items-center gap-2 rounded-full bg-white p-2 shadow-lg md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.label === "Dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
                    {user ? (
            <>
              {/* Notification */}

              <button
                className="relative rounded-full bg-white p-3 shadow-lg transition hover:bg-emerald-50"
                type="button"
              >
                <FiBell size={20} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* User Info */}

              <div className="hidden text-right sm:block">
                <p className="font-semibold text-slate-900">
                  {user.full_name || "Farmer"}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {user.role}
                </p>
              </div>

              {/* Avatar */}

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-green-700 text-lg font-bold text-white">
                {(user.full_name || "F")[0].toUpperCase()}
              </div>

              {/* Logout */}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-red-600"
              >
                <FiLogOut />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-emerald-500 px-5 py-2 font-semibold text-emerald-600 transition hover:bg-emerald-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-emerald-600 to-green-700 px-5 py-2 font-semibold text-white shadow-lg transition hover:shadow-xl"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;