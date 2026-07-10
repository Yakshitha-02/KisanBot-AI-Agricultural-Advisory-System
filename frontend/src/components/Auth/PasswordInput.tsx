import { useState, ChangeEvent } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import PasswordStrength from './PasswordStrength';

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  showStrength?: boolean;
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  showStrength = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className='block'>
        <span className='text-sm font-semibold text-slate-700'>{label}</span>
        <div className='relative mt-3'>
          <input
            name={name}
            type={visible ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete='new-password'
            className={`w-full rounded-3xl border px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15 ${
              error ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'
            }`}
          />
          <button
            type='button'
            onClick={() => setVisible((state) => !state)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700'
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <FiEyeOff className='h-5 w-5' /> : <FiEye className='h-5 w-5' />}
          </button>
        </div>
      </label>
      {error ? <p className='mt-2 text-sm text-rose-600'>{error}</p> : null}
      {showStrength ? <PasswordStrength password={value} /> : null}
    </div>
  );
}

export default PasswordInput;
