import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import Languages from '../../components/Languages/Languages';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import WhyKisanBot from '../../components/WhyKisanBot/WhyKisanBot';
import Footer from '../../components/Footer/Footer';

function LandingPage() {
  return (
    <div className='min-h-screen bg-[#F7FAF7] text-slate-900'>
      <Navbar />
      <main className='space-y-16 px-4 pb-16 pt-8 sm:px-6 lg:px-8'>
        <Hero />
        <Features />
        <Languages />
        <HowItWorks />
        <WhyKisanBot />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
