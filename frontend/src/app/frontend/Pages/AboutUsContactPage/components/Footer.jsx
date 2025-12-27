// Footer.jsx
import React from 'react';

const Footer = () => (
  <footer className="w-full text-center py-4 text-xs text-gray-500 bg-white border-t border-gray-200 mt-8">
    <div>AI Trip Planner &copy; {new Date().getFullYear()} &mdash; v1.0.0</div>
    <div className="mt-1">
      <a href="#legal" className="hover:underline">Legal</a>
      <span className="mx-2">|</span>
      <a href="#privacy" className="hover:underline">Privacy Policy</a>
    </div>
  </footer>
);

export default Footer;
