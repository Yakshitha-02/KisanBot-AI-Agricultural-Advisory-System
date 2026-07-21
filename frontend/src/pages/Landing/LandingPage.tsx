import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import Languages from "../../components/Languages/Languages";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import WhyKisanBot from "../../components/WhyKisanBot/WhyKisanBot";
import Footer from "../../components/Footer/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 text-slate-900">

      <Navbar />

      <main className="overflow-hidden">

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