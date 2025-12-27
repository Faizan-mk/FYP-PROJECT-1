// ContactPage.jsx
import React from 'react';
import ContactForm from './components/ContactForm';
import SocialLinks from './components/SocialLinks';
import Footer from './components/Footer';

const ContactPage = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-12 space-y-12">
      <section className="bg-white/90 rounded-3xl shadow-2xl p-8 border border-green-100">
        <h1 className="text-3xl font-extrabold text-green-800 mb-2 tracking-tight flex items-center gap-2 justify-center">
          <span role="img" aria-label="contact">✉️</span> Contact Us
        </h1>
        <p className="text-base text-gray-600 mb-6 text-center">Have a question or feedback? Fill out the form below and our team will get back to you soon!</p>
        <ContactForm />
      </section>
      <section>
        <h2 className="text-xl font-bold text-blue-600 mb-6 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="connect">🌐</span> Connect With Us
        </h2>
        <SocialLinks />
      </section>
    </main>
    <Footer />
  </div>
);

export default ContactPage;
