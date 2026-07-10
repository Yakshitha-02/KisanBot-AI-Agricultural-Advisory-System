import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Languages', href: '#languages' },
  { label: 'About', href: '#about' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 border-b border-white/80 bg-[#F7FAF7]/95 backdrop-blur-xl'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6'>
        <Link to='/' className='text-lg font-semibold tracking-tight text-[#2E7D32]'>
          KisanBot
        </Link>

        <nav className='hidden items-center gap-8 md:flex'>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className='text-sm font-medium text-slate-700 transition hover:text-[#2E7D32]'>
              {item.label}
            </a>
          ))}
        </nav>

        <div className='hidden items-center gap-3 md:flex'>
          <Link
            to='/login'
            className='rounded-full border border-[#2E7D32] px-5 py-2 text-sm font-semibold text-[#2E7D32] transition hover:bg-[#2E7D32]/10'
          >
            Login
          </Link>
          <Link
            to='/register'
            className='rounded-full bg-[#2E7D32] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-[#2E7D32]/20 transition hover:bg-[#25692b]'
          >
            Register
          </Link>
        </div>

        <button
          type='button'
          className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden'
          onClick={() => setMenuOpen((state) => !state)}
          aria-label='Toggle menu'
        >
          {menuOpen ? <FiX className='h-5 w-5' /> : <FiMenu className='h-5 w-5' />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='overflow-hidden border-t border-white/80 bg-[#F7FAF7] md:hidden'
          >
            <div className='space-y-4 px-4 py-5'>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className='block rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#E8F5E9] hover:text-[#2E7D32]'
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className='space-y-3 rounded-3xl border border-[#E8F5E9] bg-white p-4 shadow-sm'>
                <Link
                  to='/login'
                  className='block rounded-full border border-[#2E7D32] px-4 py-3 text-center text-sm font-semibold text-[#2E7D32]'
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='block rounded-full bg-[#2E7D32] px-4 py-3 text-center text-sm font-semibold text-white'
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
