// AboutSection.jsx
import React from 'react';

const AboutSection = () => (
  <section className="bg-white rounded-2xl shadow p-6 mb-6">
    <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
      <span role="img" aria-label="about">🧑‍💼</span> About Us
    </h2>
    <p className="text-gray-700 mb-2">AI Trip Planner is your smart travel assistant built with modern AI tools.</p>
    <p className="text-gray-600 italic">Mission: <span className="not-italic">Simplify travel planning for everyone.</span></p>
  </section>
);

export default AboutSection;
