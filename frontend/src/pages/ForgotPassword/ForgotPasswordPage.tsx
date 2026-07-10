import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMail, FiCheckCircle } from 'react-icons/fi';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthCard from '../../components/Auth/AuthCard';
import InputField from '../../components/Auth/InputField';

type ForgotPasswordStep = 'email' | 'code' | 'password' | 'success';

interface ForgotPasswordErrors {
  email?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCode = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!formData.code) {
      newErrors.code = 'Verification code is required';
    } else if (formData.code.length < 6) {
      newErrors.code = 'Code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setStep('code');
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCode()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);

    console.log('Password reset for:', formData.email);
    setStep('success');
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {step === 'email' && (
          <AuthCard
            title='Reset your password'
            description='Enter your email address and we will send you a verification code to reset your password.'
          >
            <form onSubmit={handleEmailSubmit} className='space-y-5'>
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

              <motion.button
                type='submit'
                disabled={loading}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.96 }}
                className='mt-8 w-full rounded-3xl bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition disabled:opacity-50 hover:bg-[#25692b]'
              >
                {loading ? 'Sending code...' : 'Send Reset Code'}
                {!loading && <FiArrowRight className='ml-2 inline h-4 w-4' />}
              </motion.button>

              <p className='text-center text-sm text-slate-600'>
                Remember your password?{' '}
                <Link to='/login' className='font-semibold text-[#2E7D32] hover:text-[#25692b]'>
                  Back to login
                </Link>
              </p>
            </form>
          </AuthCard>
        )}

        {step === 'code' && (
          <AuthCard
            title='Verify your email'
            description='Enter the 6-digit code we sent to your email address to proceed with password reset.'
          >
            <form onSubmit={handleCodeSubmit} className='space-y-5'>
              <div className='flex items-center justify-center gap-2 rounded-3xl border border-[#E8F5E9] bg-[#F7FAF7] py-4'>
                <FiMail className='h-5 w-5 text-[#2E7D32]' />
                <p className='text-sm font-medium text-slate-700'>{formData.email}</p>
              </div>

              <InputField
                label='Verification Code'
                name='code'
                type='text'
                placeholder='000000'
                value={formData.code}
                onChange={handleChange}
                error={errors.code}
                autoComplete='off'
              />

              <motion.button
                type='submit'
                disabled={loading}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.96 }}
                className='mt-8 w-full rounded-3xl bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition disabled:opacity-50 hover:bg-[#25692b]'
              >
                {loading ? 'Verifying...' : 'Verify Code'}
                {!loading && <FiArrowRight className='ml-2 inline h-4 w-4' />}
              </motion.button>

              <button
                type='button'
                onClick={() => setStep('email')}
                className='w-full text-center text-sm font-semibold text-[#2E7D32] hover:text-[#25692b]'
              >
                Didn't receive code? Try another email
              </button>
            </form>
          </AuthCard>
        )}

        {step === 'password' && (
          <AuthCard title='Create new password' description='Choose a strong password to protect your KisanBot account.'>
            <form onSubmit={handlePasswordSubmit} className='space-y-5'>
              <InputField
                label='New Password'
                name='password'
                type='password'
                placeholder='••••••••'
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete='new-password'
              />

              <InputField
                label='Confirm Password'
                name='confirmPassword'
                type='password'
                placeholder='••••••••'
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                autoComplete='new-password'
              />

              <motion.button
                type='submit'
                disabled={loading}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.96 }}
                className='mt-8 w-full rounded-3xl bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition disabled:opacity-50 hover:bg-[#25692b]'
              >
                {loading ? 'Resetting password...' : 'Reset Password'}
                {!loading && <FiArrowRight className='ml-2 inline h-4 w-4' />}
              </motion.button>
            </form>
          </AuthCard>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            className='space-y-8'
          >
            <div className='rounded-[2rem] border border-[#E8F5E9] bg-[#F7FAF7] p-10 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9]'>
                <FiCheckCircle className='h-8 w-8 text-[#2E7D32]' />
              </div>
              <h2 className='mt-6 text-2xl font-semibold text-slate-900'>Password reset successful</h2>
              <p className='mt-3 text-sm leading-6 text-slate-600'>Your password has been updated. You can now sign in with your new password.</p>

              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.96 }}
                className='mt-8 w-full rounded-3xl bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition hover:bg-[#25692b]'
              >
                Back to Login
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
