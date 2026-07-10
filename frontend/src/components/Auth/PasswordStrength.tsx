interface PasswordStrengthProps {
  password: string;
}

function PasswordStrength({ password }: PasswordStrengthProps) {
  const score =
    password.length > 9 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)
      ? 3
      : password.length > 7 && /[0-9]/.test(password)
      ? 2
      : password.length > 5
      ? 1
      : 0;

  const labels = ['Too weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-rose-500', 'bg-amber-400', 'bg-[#4CAF50]', 'bg-[#2E7D32]'];

  return (
    <div className='mt-3'>
      <div className='flex items-center justify-between text-xs font-semibold text-slate-500'>
        <span>Password strength</span>
        <span>{labels[score]}</span>
      </div>
      <div className='mt-2 h-2 overflow-hidden rounded-full bg-slate-200'>
        <div className={`h-full rounded-full transition-all duration-300 ${colors[score]}`} style={{ width: `${(score / 3) * 100}%` }} />
      </div>
    </div>
  );
}

export default PasswordStrength;
