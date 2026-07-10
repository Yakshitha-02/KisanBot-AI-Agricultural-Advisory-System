import { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
}

function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
}: InputFieldProps) {
  return (
    <label className='block'>
      <span className='text-sm font-semibold text-slate-700'>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`mt-3 w-full rounded-3xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15 ${
          error ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'
        }`}
      />
      {error ? <p className='mt-2 text-sm text-rose-600'>{error}</p> : null}
    </label>
  );
}

export default InputField;
