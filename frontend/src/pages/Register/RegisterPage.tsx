import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthCard from '../../components/Auth/AuthCard';
import InputField from '../../components/Auth/InputField';
import PasswordInput from '../../components/Auth/PasswordInput';
import RoleSelector from '../../components/Auth/RoleSelector';
import LanguageSelector from '../../components/Auth/LanguageSelector';
import { authService } from '../../services/auth';

interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  state?: string;
  district?: string;
}

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
    language: 'english',
    role: 'farmer' as 'farmer' | 'admin',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase letter and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      await authService.register({
  full_name: formData.fullName,
  email: formData.email,
  password: formData.password,
  role: formData.role,
  state: formData.state,
  district: formData.district,
  preferred_language: formData.language,
});

navigate(
  formData.role === "admin"
    ? "/admin/dashboard"
    : "/farmer/dashboard"
);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to create your account right now.';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <AuthCard title='Join KisanBot' description='Create your account to start receiving AI-powered agricultural guidance tailored to your farm.'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <InputField
              label='Full Name'
              name='fullName'
              type='text'
              placeholder='Your full name'
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              autoComplete='name'
            />

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
              showStrength
            />

            <PasswordInput
              label='Confirm Password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='••••••••'
              error={errors.confirmPassword}
            />

            <div className='grid gap-4 sm:grid-cols-2'>
              <InputField
                label='State'
                name='state'
                type='text'
                placeholder='Maharashtra'
                value={formData.state}
                onChange={handleChange}
                error={errors.state}
              />

              <InputField
                label='District'
                name='district'
                type='text'
                placeholder='Pune'
                value={formData.district}
                onChange={handleChange}
                error={errors.district}
              />
            </div>

            <LanguageSelector value={formData.language} onChange={handleChange} />

            <RoleSelector value={formData.role} onChange={handleRoleChange} />

            {submitError ? <p className='rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>{submitError}</p> : null}

            <div className='mt-6 space-y-2 rounded-3xl border border-[#E8F5E9] bg-[#F7FAF7] p-4'>
              <div className='flex items-center gap-2 text-sm text-slate-600'>
                <FiCheckCircle className='h-5 w-5 text-[#2E7D32]' />
                <span>Secure password with uppercase and numbers</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-slate-600'>
                <FiCheckCircle className='h-5 w-5 text-[#2E7D32]' />
                <span>Location-based advisory for your region</span>
              </div>
            </div>

            <motion.button
              type='submit'
              disabled={loading}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
              className='mt-8 w-full rounded-3xl bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition disabled:opacity-50 hover:bg-[#25692b]'
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <FiArrowRight className='ml-2 inline h-4 w-4' />}
            </motion.button>

            <p className='text-center text-sm text-slate-600'>
              Already have an account?{' '}
              <Link to='/login' className='font-semibold text-[#2E7D32] hover:text-[#25692b]'>
                Sign in
              </Link>
            </p>
          </form>
        </AuthCard>
      </motion.div>
    </AuthLayout>
  );
}

export default RegisterPage;
