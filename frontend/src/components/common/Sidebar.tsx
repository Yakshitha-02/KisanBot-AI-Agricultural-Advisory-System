import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className='w-64 rounded-xl border bg-white p-4 shadow-sm'>
      <nav className='space-y-3 text-sm text-slate-700'>
        <Link to='/farmer/dashboard'>Farmer Dashboard</Link>
        <Link to='/admin/dashboard'>Admin Dashboard</Link>
        <Link to='/analytics'>Analytics</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
