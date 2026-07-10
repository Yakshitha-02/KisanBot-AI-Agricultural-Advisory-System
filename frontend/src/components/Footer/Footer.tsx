import { FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className='rounded-[2rem] border border-slate-200 bg-white px-5 py-10 shadow-sm sm:px-8'>
      <div className='mx-auto max-w-7xl space-y-8'>
        <div className='grid gap-8 md:grid-cols-4'>
          <div className='space-y-3'>
            <p className='text-lg font-semibold text-slate-900'>KisanBot</p>
            <p className='max-w-sm text-sm leading-6 text-slate-600'>An AI assistant designed to empower farmers with instant guidance and connected agricultural intelligence.</p>
          </div>
          <div className='space-y-3'>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>Company</p>
            <div className='space-y-2 text-sm text-slate-600'>
              <a href='#about' className='block hover:text-[#2E7D32]'>About</a>
              <a href='#contact' className='block hover:text-[#2E7D32]'>Contact</a>
              <a href='#privacy' className='block hover:text-[#2E7D32]'>Privacy</a>
            </div>
          </div>
          <div className='space-y-3'>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>Resources</p>
            <div className='space-y-2 text-sm text-slate-600'>
              <a href='https://github.com/' target='_blank' rel='noreferrer' className='block hover:text-[#2E7D32]'>GitHub</a>
            </div>
          </div>
          <div className='space-y-3'>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>Support</p>
            <div className='space-y-2 text-sm text-slate-600'>
              <a href='mailto:support@kisanbot.ai' className='block hover:text-[#2E7D32]'>support@kisanbot.ai</a>
              <a href='tel:+919000000000' className='block hover:text-[#2E7D32]'>+91 90000 00000</a>
            </div>
          </div>
        </div>

        <div className='flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center'>
          <p>© 2026 KisanBot. All rights reserved.</p>
          <a href='https://github.com/' target='_blank' rel='noreferrer' className='inline-flex items-center gap-2 text-slate-600 transition hover:text-[#2E7D32]'>
            <FaGithub className='h-4 w-4' />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
