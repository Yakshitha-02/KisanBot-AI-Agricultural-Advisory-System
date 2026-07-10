import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'farmer' | 'admin';
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className='flex min-h-screen items-center justify-center text-slate-600'>Loading...</div>;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/farmer/dashboard'} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
