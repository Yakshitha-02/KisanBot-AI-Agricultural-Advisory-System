import OverviewCards from '../../components/dashboard/OverviewCards';
import UserTable from '../../components/admin/UserTable';

function AdminDashboardPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-semibold'>Admin Dashboard</h1>
      <OverviewCards />
      <UserTable />
    </div>
  );
}

export default AdminDashboardPage;
