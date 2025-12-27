// SocialLinks.jsx
import React from 'react';

const socials = [
  { name: 'Facebook', url: 'https://facebook.com', icon: '📘' },
  { name: 'Instagram', url: 'https://instagram.com', icon: '📸' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: '🔗' },
];

const SocialLinks = () => (
  <section className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col items-center">
    <h3 className="text-xl font-semibold text-blue-600 mb-3">Connect With Us</h3>
    <div className="flex gap-6">
      {socials.map(s => (
        <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-blue-700 hover:text-blue-900">
          <span className="text-3xl mb-1">{s.icon}</span>
          <span className="text-sm">{s.name}</span>
        </a>
      ))}
    </div>
  </section>
);

export default SocialLinks;
