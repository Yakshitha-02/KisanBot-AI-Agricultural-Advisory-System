import { useEffect, useState } from "react";
import { adminService, AdminUser } from "../../services/admin";

function UserTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (id: number) => {
    try {
      await adminService.toggleUser(id);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id: number) => {
    const ok = window.confirm(
      "Delete this user permanently?"
    );

    if (!ok) return;

    try {
      await adminService.deleteUser(id);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow">
        Loading users...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow">

      <h2 className="mb-5 text-2xl font-bold">
        User Management
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="border-b">

            <tr className="text-left">

              <th className="py-3">Name</th>

              <th>Email</th>

              <th>Role</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="py-4">
                  {user.full_name}
                </td>

                <td>{user.email}</td>

                <td className="capitalize">
                  {user.role}
                </td>

                <td>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </td>

                <td className="space-x-2">

                  <button
                    onClick={() =>
                      toggleStatus(user.id)
                    }
                    className="rounded-lg bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    {user.is_active
                      ? "Disable"
                      : "Enable"}
                  </button>

                  <button
                    onClick={() =>
                      deleteUser(user.id)
                    }
                    className="rounded-lg bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default UserTable;