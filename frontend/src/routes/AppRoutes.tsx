import { Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import GuestLayout from '../layouts/GuestLayout';
import AdminDashboardPage from '../pages/AdminDashboard/AdminDashboardPage';
import AnalyticsPage from '../pages/Analytics/AnalyticsPage';
import ChatPage from '../pages/Chat/ChatPage';
import FarmerDashboardPage from '../pages/FarmerDashboard/FarmerDashboardPage';
import FeedbackPage from '../pages/Feedback/FeedbackPage';
import ForgotPasswordPage from '../pages/ForgotPassword/ForgotPasswordPage';
import KnowledgeBasePage from '../pages/KnowledgeBase/KnowledgeBasePage';
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Login/LoginPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import RegisterPage from '../pages/Register/RegisterPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path='/farmer' element={<ProtectedRoute role='farmer'><FarmerDashboardPage /></ProtectedRoute>} />
        <Route path='/farmer/dashboard' element={<ProtectedRoute role='farmer'><FarmerDashboardPage /></ProtectedRoute>} />
        <Route path='/admin' element={<ProtectedRoute role='admin'><AdminDashboardPage /></ProtectedRoute>} />
        <Route path='/admin/dashboard' element={<ProtectedRoute role='admin'><AdminDashboardPage /></ProtectedRoute>} />
        <Route path='/chat' element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/analytics' element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path='/knowledge-base' element={<ProtectedRoute><KnowledgeBasePage /></ProtectedRoute>} />
        <Route path='/feedback' element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
        <Route path='/settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
