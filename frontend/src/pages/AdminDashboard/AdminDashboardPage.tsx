import AdminOverviewCards from "../../components/admin/AdminOverViewCards";
import UserTable from "../../components/admin/UserTable";
import UnansweredQueries from "../../components/admin/UnansweredQueries";

function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">
        Admin Dashboard
      </h1>

      <AdminOverviewCards />

      <UserTable />

      <UnansweredQueries />

    </div>
  );
}

export default AdminDashboardPage;