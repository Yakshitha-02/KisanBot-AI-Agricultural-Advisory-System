import { motion } from 'framer-motion';
import { FiMessageSquare, FiRefreshCw, FiCpu, FiCheckCircle } from 'react-icons/fi';

const steps = [
  { title: 'Ask a question', icon: FiMessageSquare, description: 'Start by asking about crops, weather, or farm care.' },
  { title: 'Language detection', icon: FiRefreshCw, description: 'KisanBot recognizes your language automatically.' },
  { title: 'AI + RAG processing', icon: FiCpu, description: 'Answers are generated using AI and relevant agricultural data.' },
  { title: 'Receive multilingual answer', icon: FiCheckCircle, description: 'Get guidance in your preferred language instantly.' },
];

function HowItWorks() {
  return (
    <section id='about' className='space-y-8 py-16'>
      <div className='mx-auto max-w-3xl text-center'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-[#2E7D32]'>How it works</p>
        <h2 className='mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl'>From question to grounded recommendation</h2>
        <p className='mt-4 text-base leading-7 text-slate-600'>The process is designed to be simple, transparent, and tuned to local farming needs.</p>
      </div>

      <div className='mx-auto grid max-w-5xl gap-6 sm:grid-cols-2'>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className='relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm'
            >
              <div className='flex items-center gap-4'>
                <div className='flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E8F5E9] text-[#2E7D32]'>
                  <Icon className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.25em] text-slate-400'>Step {index + 1}</p>
                  <h3 className='mt-2 text-xl font-semibold text-slate-900'>{step.title}</h3>
                </div>
              </div>
              <p className='mt-4 text-sm leading-6 text-slate-600'>{step.description}</p>

              {!isLast && (
                <span className='absolute right-5 top-1/2 hidden h-px w-24 bg-[#2E7D32]/15 sm:block' />
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;
