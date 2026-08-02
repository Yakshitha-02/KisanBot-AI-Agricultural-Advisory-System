import {
  FiSettings,
  FiBell,
  FiLogOut,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProfileDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">

      {/* User Info */}
      <div className="px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
            {user?.full_name?.charAt(0) || "R"}
          </div>

          <div>

            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <FiUser />
              {user?.full_name || "Reemashree R"}
            </h3>

            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <FiMail />
              {user?.email || "reema@gmail.com"}
            </p>

            <p className="mt-1 text-sm text-emerald-600">
              🌾 {user?.role === "admin" ? "Admin" : "Farmer"}
            </p>

          </div>

        </div>

      </div>

      <hr />

      {/* Settings */}
      <button
        onClick={() => navigate("/settings")}
        className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-100 transition"
      >
        <FiSettings size={18} />
        Settings
      </button>

      {/* Notifications */}
      <button
        onClick={() => navigate("/notifications")}
        className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-100 transition"
      >
        <FiBell size={18} />
        Notifications
      </button>

      <hr />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 px-5 py-3 text-left text-red-600 hover:bg-red-50 transition"
      >
        <FiLogOut size={18} />
        Logout
      </button>

    </div>
  );
}

export default ProfileDropdown;