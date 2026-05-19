// Footer.jsx
import React from 'react';

const Footer = () => (
  <footer className="w-full text-center py-8 text-gray-400 bg-white border-t border-gray-100 mt-auto">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">
          <span className="font-bold text-blue-600">AI Trip Planner</span> &copy; {new Date().getFullYear()}
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#legal" className="hover:text-blue-600 transition-colors">Legal</a>
          <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
        </div>
        <div className="text-xs text-gray-300">
          v1.2.0 &mdash; Handcrafted with ❤️
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

