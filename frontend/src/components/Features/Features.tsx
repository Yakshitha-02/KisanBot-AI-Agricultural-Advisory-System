import { motion } from 'framer-motion';
import { FaRobot, FaMicrophone, FaLeaf, FaCloudSun, FaChartLine, FaRegLightbulb } from 'react-icons/fa';
import { GiFruitTree } from 'react-icons/gi';
import { MdTranslate } from 'react-icons/md';

const features = [
  { title: 'AI Chatbot', description: 'Get intelligent crop and farm advice in natural language.', icon: FaRobot },
  { title: 'Voice Assistant', description: 'Use voice commands for hands-free support in the field.', icon: FaMicrophone },
  { title: 'Crop Disease Detection', description: 'Detect crop symptoms quickly with guided recommendations.', icon: FaLeaf },
  { title: 'Weather Advisory', description: 'Receive localized weather guidance for optimal planning.', icon: FaCloudSun },
  { title: 'Market Prices', description: 'Track commodity prices and margin suggestions instantly.', icon: FaChartLine },
  { title: 'Government Schemes', description: 'Discover relevant agriculture subsidies and support programs.', icon: FaRegLightbulb },
  { title: 'Knowledge Base', description: 'Search verified farming content and best practices.', icon: GiFruitTree },
  { title: 'Multilingual Support', description: 'Ask questions in English, Hindi, Kannada, and Telugu.', icon: MdTranslate },
];

function Features() {
  return (
    <section id='features' className='space-y-8 py-16'>
      <div className='mx-auto max-w-3xl text-center'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-[#2E7D32]'>Capabilities</p>
        <h2 className='mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl'>Built for modern agriculture teams</h2>
        <p className='mt-4 text-base leading-7 text-slate-600'>KisanBot combines AI, local agricultural knowledge, and real-time data to help farmers act with confidence.</p>
      </div>

      <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className='group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-lg'
            >
              <div className='inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E8F5E9] text-[#2E7D32]'>
                <Icon className='h-6 w-6' />
              </div>
              <h3 className='mt-6 text-xl font-semibold text-slate-900'>{feature.title}</h3>
              <p className='mt-3 text-sm leading-6 text-slate-600'>{feature.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default Features;
