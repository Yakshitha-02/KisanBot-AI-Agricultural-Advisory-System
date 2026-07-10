import { ChangeEvent } from 'react';

interface RoleSelectorProps {
  value: 'farmer' | 'admin';
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <fieldset className='rounded-[1.5rem] border border-slate-200 bg-white p-4'>
      <legend className='px-2 text-sm font-semibold text-slate-700'>Role</legend>
      <div className='mt-3 flex flex-col gap-3 sm:flex-row'>
        {['farmer', 'admin'].map((role) => (
          <label
            key={role}
            className={`flex flex-1 cursor-pointer items-center justify-between rounded-3xl border px-4 py-3 text-sm font-medium transition ${
              value === role ? 'border-[#2E7D32] bg-[#E8F5E9] text-slate-900' : 'border-slate-200 bg-white text-slate-600 hover:border-[#4CAF50]'
            }`}
          >
            <span className='capitalize'>{role}</span>
            <input
              type='radio'
              name='role'
              value={role}
              checked={value === role}
              onChange={onChange}
              className='hidden'
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default RoleSelector;
