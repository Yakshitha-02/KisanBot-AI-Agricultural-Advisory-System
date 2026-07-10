import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className='rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_40px_90px_-40px_rgba(46,125,50,0.15)] sm:p-10'>
      <div className='space-y-3'>
        <h1 className='text-3xl font-semibold text-slate-900'>{title}</h1>
        <p className='max-w-xl text-sm leading-7 text-slate-600'>{description}</p>
      </div>
      <div className='mt-10'>{children}</div>
    </div>
  );
}

export default AuthCard;
