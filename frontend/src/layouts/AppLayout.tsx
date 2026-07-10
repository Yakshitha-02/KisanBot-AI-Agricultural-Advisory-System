import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

function AppLayout() {
  return (
    <div className='min-h-screen bg-slate-100 text-slate-900'>
      <Header />
      <main className='mx-auto max-w-7xl px-4 py-6'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
