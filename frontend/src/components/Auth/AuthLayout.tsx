import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='min-h-screen bg-[#F7FAF7] px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='grid gap-12 lg:grid-cols-[0.95fr_0.8fr] lg:items-center'>
          <div className='space-y-8'>
            <div className='rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm'>
              <p className='text-sm font-semibold uppercase tracking-[0.28em] text-[#2E7D32]'>KisanBot Auth</p>
              <h2 className='mt-4 text-4xl font-semibold text-slate-900'>Secure access for farmers and admins</h2>
              <p className='mt-4 max-w-xl text-sm leading-7 text-slate-600'>Modern authentication built for rural workflows and digital farming experiences.</p>
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
