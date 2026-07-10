import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

function Hero() {
  return (
    <section id='home' className='overflow-hidden rounded-[2rem] bg-white px-5 py-10 shadow-[0_40px_100px_-30px_rgba(46,125,50,0.18)] sm:px-8 sm:py-14'>
      <div className='mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='space-y-8'
        >
          <div className='inline-flex items-center gap-2 rounded-full bg-[#E8F5E9] px-4 py-2 text-sm font-semibold text-[#2E7D32]'>
            AI Farming Companion
          </div>
          <div className='space-y-5'>
            <h1 className='max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl'>
              KisanBot - Your AI Farming Companion
            </h1>
            <p className='max-w-2xl text-lg leading-8 text-slate-600'>
              Ask farming questions in your own language and receive accurate AI-powered guidance instantly.
            </p>
          </div>

          <div className='flex flex-col gap-4 sm:flex-row'>
            <a
              href='#features'
              className='inline-flex items-center justify-center rounded-full bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2E7D32]/20 transition hover:bg-[#25692b]'
            >
              Start Chat
              <FiArrowRight className='ml-3 h-4 w-4' />
            </a>
            <a
              href='#about'
              className='inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#2E7D32] hover:text-[#2E7D32]'
            >
              Learn More
            </a>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='rounded-3xl bg-[#F7FAF7] p-5 shadow-sm'>
              <p className='text-xs uppercase tracking-[0.2em] text-slate-400'>Trusted by farmers</p>
              <p className='mt-3 text-2xl font-semibold text-slate-900'>120K+</p>
            </div>
            <div className='rounded-3xl bg-[#F7FAF7] p-5 shadow-sm'>
              <p className='text-xs uppercase tracking-[0.2em] text-slate-400'>Daily recommendations</p>
              <p className='mt-3 text-2xl font-semibold text-slate-900'>35K+</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#E8F5E9] via-white to-[#F7FAF7] p-5 shadow-xl'
        >
          <div className='pointer-events-none absolute -right-10 top-10 h-36 w-36 rounded-full bg-[#F9A826]/15 blur-2xl' />
          <div className='pointer-events-none absolute left-6 top-6 h-24 w-24 rounded-full bg-[#4CAF50]/10 blur-2xl' />
          <div className='relative rounded-[1.75rem] border border-white/70 bg-white/90 p-7 shadow-2xl sm:p-10'>
            <div className='mb-6 rounded-3xl bg-[#E8F5E9] p-6 text-center text-sm text-[#2E7D32] shadow-inner shadow-[#2E7D32]/5'>
              Agriculture + AI insights in a single dashboard.
            </div>
            <div className='space-y-5'>
              <div className='rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm'>
                <div className='mb-4 flex items-center justify-between'>
                  <span className='rounded-full bg-[#4CAF50]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#2E7D32]'>Live</span>
                  <span className='text-xs text-slate-400'>Updated now</span>
                </div>
                <div className='space-y-3'>
                  <div className='rounded-3xl bg-[#F7FAF7] p-4'>
                    <p className='text-sm font-semibold text-slate-900'>Soil health suggestion</p>
                    <p className='mt-2 text-sm text-slate-500'>Nitrogen level and irrigation cadence optimized for maize.</p>
                  </div>
                  <div className='rounded-3xl bg-[#F7FAF7] p-4'>
                    <p className='text-sm font-semibold text-slate-900'>Voice assistant ready</p>
                    <p className='mt-2 text-sm text-slate-500'>Ask questions naturally in your language.</p>
                  </div>
                </div>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-3xl bg-[#F7FAF7] p-4 text-center'>
                  <p className='text-2xl font-semibold text-slate-900'>98%</p>
                  <p className='mt-2 text-sm text-slate-500'>Precision advisory accuracy</p>
                </div>
                <div className='rounded-3xl bg-[#F7FAF7] p-4 text-center'>
                  <p className='text-2xl font-semibold text-slate-900'>4.8/5</p>
                  <p className='mt-2 text-sm text-slate-500'>Farmer satisfaction score</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
