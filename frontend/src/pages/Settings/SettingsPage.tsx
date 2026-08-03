import { useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

 const [accentColor, setAccentColor] = useState(
  localStorage.getItem("accentColor") || "default"
);

  const saveAccentColor = (color: string) => {
    setAccentColor(color);
    localStorage.setItem("accentColor", color);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl bg-white p-8 shadow-lg">

        {/* Heading */}
        <h1 className="mb-8 text-3xl font-bold">
          ⚙️ Settings
        </h1>

        {/* Accent Color */}

<div className="mb-8 border-b pb-6">

  <h2 className="mb-2 text-lg font-semibold">
    🎨 Accent Color
  </h2>

  <p className="mb-5 text-sm text-slate-500">
    Choose your preferred accent color.
  </p>

  <div className="relative w-64">

    <select
      value={accentColor}
      onChange={(e) => saveAccentColor(e.target.value)}
      className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-emerald-600"
    >
      <option value="default">⚪ Default</option>
      <option value="black">⚫ Black</option>
      <option value="blue">🔵 Blue</option>
      <option value="green">🟢 Green</option>
      <option value="orange">🟠 Orange</option>
      <option value="purple">🟣 Purple</option>
    </select>

    {/* Dropdown Arrow */}

    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
      ▼
    </div>

  </div>

</div>

        {/* Account Information */}
        <div className="mb-8 rounded-2xl bg-slate-50 p-6">

          <div className="mb-4 flex items-center gap-2">
            <FiUser size={20} />
            <h2 className="text-lg font-semibold">
              Account Information
            </h2>
          </div>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-slate-500">
                Name
              </p>
              <p className="font-semibold">
                {user?.full_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>
              <p className="font-semibold">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Role
              </p>
              <p className="font-semibold capitalize">
                🌾 {user?.role}
              </p>
            </div>

          </div>

        </div>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 font-semibold text-white transition hover:bg-red-600"
        >
          <FiLogOut />
          Logout
        </button>

      </div>
    </div>
  );
}

export default SettingsPage;