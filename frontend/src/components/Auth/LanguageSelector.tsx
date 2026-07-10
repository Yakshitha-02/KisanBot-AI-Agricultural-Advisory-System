import { ChangeEvent } from 'react';

interface LanguageSelectorProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <label className='block'>
      <span className='text-sm font-semibold text-slate-700'>Preferred Language</span>
      <select
        value={value}
        onChange={onChange}
        className='mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15'
      >
        <option value='english'>English</option>
        <option value='hindi'>Hindi</option>
        <option value='kannada'>Kannada</option>
        <option value='telugu'>Telugu</option>
      </select>
    </label>
  );
}

export default LanguageSelector;
