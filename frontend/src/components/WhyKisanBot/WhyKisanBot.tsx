import { motion } from 'framer-motion';
import { FaClock, FaLanguage, FaBrain, FaLeaf } from 'react-icons/fa';

const stats = [
  { label: '24/7 Assistance', value: 'Always available for farm queries', icon: FaClock },
  { label: 'Multilingual Support', value: 'English, Hindi, Kannada, Telugu', icon: FaLanguage },
  { label: 'AI Powered', value: 'Context-aware advice backed by data', icon: FaBrain },
  { label: 'Trusted Agricultural Knowledge', value: 'Verified insights from farming experts', icon: FaLeaf },
];

function WhyKisanBot() {
  return (
    <section className='space-y-8 py-16'>
      <div className='mx-auto max-w-3xl text-center'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-[#2E7D32]'>Why KisanBot</p>
        <h2 className='mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl'>Trusted by farmers for intelligent farming decisions</h2>
        <p className='mt-4 text-base leading-7 text-slate-600'>KisanBot delivers actionable recommendations with a clean experience designed for field-ready planning.</p>
      </div>

      <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className='rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
            >
              <div className='inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E8F5E9] text-[#2E7D32]'>
                <Icon className='h-6 w-6' />
              </div>
              <p className='mt-5 text-lg font-semibold text-slate-900'>{stat.label}</p>
              <p className='mt-3 text-sm leading-6 text-slate-600'>{stat.value}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default WhyKisanBot;
