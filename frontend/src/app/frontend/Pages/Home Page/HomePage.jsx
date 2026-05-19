import Header from './Compoents/Header';
import Hero from './Compoents/Hero';
import Features from './Compoents/Features';
import PakistanHighlights from './Compoents/PakistanHighlights';
import HowItWorks from './Compoents/HowItWorks';
import Testimonials from './Compoents/Testimonials';
import CallToAction from './Compoents/CallToAction';
import Footer from './Compoents/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <PakistanHighlights />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;
