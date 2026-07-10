import { motion } from 'framer-motion';
import { FaGlobe } from 'react-icons/fa';
import { SiGoogletranslate } from 'react-icons/si';

const languages = [
  { name: 'English', details: 'Global farming terms and friendly guidance.', icon: FaGlobe },
  { name: 'Hindi', details: 'Curated local advice for Hindi-speaking farmers.', icon: SiGoogletranslate },
  { name: 'Kannada', details: 'Regional insights for Kannada agriculture communities.', icon: SiGoogletranslate },
  { name: 'Telugu', details: 'Answering questions in Telugu for clarity on crop care.', icon: SiGoogletranslate },
];

function Languages() {
  return (
    <section id='languages' className='space-y-8 py-16'>
      <div className='mx-auto max-w-3xl text-center'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-[#2E7D32]'>Supported Languages</p>
        <h2 className='mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl'>Communicate naturally with KisanBot</h2>
      </div>

      <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
        {languages.map((language, index) => {
          const Icon = language.icon;
          return (
            <motion.article
              key={language.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className='group rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-lg'
            >
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#E8F5E9] text-[#2E7D32]'>
                <Icon className='h-7 w-7' />
              </div>
              <h3 className='mt-5 text-xl font-semibold text-slate-900'>{language.name}</h3>
              <p className='mt-3 text-sm leading-6 text-slate-600'>{language.details}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default Languages;
