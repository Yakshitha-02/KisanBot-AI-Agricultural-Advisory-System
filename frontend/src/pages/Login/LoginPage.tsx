import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthCard from '../../components/Auth/AuthCard';
import InputField from '../../components/Auth/InputField';
import PasswordInput from '../../components/Auth/PasswordInput';
import RoleSelector from '../../components/Auth/RoleSelector';
import { useAuth } from '../../hooks/useAuth';

interface LoginErrors {
  email?: string;
  password?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false, role: 'farmer' as 'farmer' | 'admin' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as 'farmer' | 'admin',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');

    try {
      await login(formData.email, formData.password);
      navigate(formData.role === 'farmer' ? '/farmer/dashboard' : '/admin/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to sign in right now.';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AuthCard
          title='Welcome back'
          description='Sign in to your KisanBot account to access personalized farming insights and recommendations.'
        >
          <form onSubmit={handleSubmit} className='space-y-5'>
            <InputField
              label='Email Address'
              name='email'
              type='email'
              placeholder='you@example.com'
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete='email'
            />

            <PasswordInput
              label='Password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='••••••••'
              error={errors.password}
            />

            <div className='flex items-center justify-between'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  name='rememberMe'
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className='h-5 w-5 rounded border-slate-300 text-[#2E7D32] accent-[#2E7D32]'
                />
                <span className='text-sm font-medium text-slate-700'>Remember me</span>
              </label>
              <Link to='/forgot-password' className='text-sm font-semibold text-[#2E7D32] hover:text-[#25692b]'>
                Forgot password?
              </Link>
            </div>

            <RoleSelector value={formData.role} onChange={handleRoleChange} />

            {submitError ? <p className='rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>{submitError}</p> : null}

            <motion.button
              type='submit'
              disabled={loading}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
              className='mt-8 w-full rounded-3xl bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition disabled:opacity-50 hover:bg-[#25692b]'
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <FiArrowRight className='ml-2 inline h-4 w-4' />}
            </motion.button>

            <p className='text-center text-sm text-slate-600'>
              Don't have an account?{' '}
              <Link to='/register' className='font-semibold text-[#2E7D32] hover:text-[#25692b]'>
                Create one
              </Link>
            </p>
          </form>
        </AuthCard>
      </motion.div>
    </AuthLayout>
  );
}

export default LoginPage;
