import Header from './Compoents/Header';
import Hero from './Compoents/Hero';
import Features from './Compoents/Features';
import HowItWorks from './Compoents/HowItWorks';
import Testimonials from './Compoents/Testimonials';
import CallToAction from './Compoents/CallToAction';
import Footer from './Compoents/Footer';
import WhatsApp from '../../components/WhatsApp/WhatsApp';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
      <WhatsApp />
    </div>
  );
};

export default HomePage;
