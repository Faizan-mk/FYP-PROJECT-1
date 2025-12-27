// Main About Us / Contact Page file
import React from 'react';
import AboutSection from './components/AboutSection';
import TeamCards from './components/TeamCards';
import ContactForm from './components/ContactForm';
import SocialLinks from './components/SocialLinks';
import Footer from './components/Footer';

const AboutUsContactPage = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10 space-y-10">
      <AboutSection />
      <TeamCards />
      <ContactForm />
      <SocialLinks />
    </main>
    <Footer />
  </div>
);

export default AboutUsContactPage;
