// AboutPage.jsx
import React from 'react';
import AboutSection from './components/AboutSection';
import TeamCards from './components/TeamCards';
import SocialLinks from './components/SocialLinks';
import Footer from './components/Footer';

const AboutPage = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 space-y-12">
      <section className="flex flex-col md:flex-row items-center gap-8 bg-white/80 rounded-3xl shadow-2xl p-8 border border-blue-100">
        <img src="/vite.svg" alt="AI Trip Planner Logo" className="w-32 h-32 rounded-2xl shadow-lg border-4 border-blue-200 bg-white" />
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight flex items-center gap-2">
            <span role="img" aria-label="about">🧑‍💼</span> About Us
          </h1>
          <p className="text-lg text-gray-700 mb-2 font-medium">AI Trip Planner is your smart travel assistant built with modern AI tools.</p>
          <p className="text-base text-gray-600 italic mb-2">Mission: <span className="not-italic font-semibold text-blue-700">Simplify travel planning for everyone.</span></p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="team">👥</span> Meet Our Team
        </h2>
        <TeamCards />
      </section>
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="connect">🌐</span> Connect With Us
        </h2>
        <SocialLinks />
      </section>
    </main>
    <Footer />
  </div>
);

export default AboutPage;
