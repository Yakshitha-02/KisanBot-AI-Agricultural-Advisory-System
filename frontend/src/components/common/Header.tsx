import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className='border-b bg-white/80 shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
        <Link to='/' className='text-xl font-semibold text-slate-900'>
          KisanBot
        </Link>
        <nav className='flex items-center gap-4 text-sm text-slate-600'>
          {user ? (
            <>
              <Link to='/chat'>Chat</Link>
              <Link to='/knowledge-base'>Knowledge</Link>
              <Link to='/feedback'>Feedback</Link>
              <button type='button' onClick={handleLogout} className='font-semibold text-[#2E7D32]'>Logout</button>
            </>
          ) : (
            <>
              <Link to='/login'>Login</Link>
              <Link to='/register'>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
