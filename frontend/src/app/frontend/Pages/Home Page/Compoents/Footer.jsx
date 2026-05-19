import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebookF />, url: 'https://facebook.com', label: 'Facebook', color: 'from-blue-600 to-blue-400', shadow: 'shadow-blue-500/20' },
    { icon: <FaLinkedinIn />, url: 'https://linkedin.com', label: 'LinkedIn', color: 'from-blue-700 to-blue-500', shadow: 'shadow-blue-600/20' },
    { icon: <FaInstagram />, url: 'https://instagram.com', label: 'Instagram', color: 'from-pink-600 via-red-500 to-yellow-500', shadow: 'shadow-pink-500/20' },
    { icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter', color: 'from-sky-500 to-sky-400', shadow: 'shadow-sky-400/20' },
    { icon: <FaGithub />, url: 'https://github.com', label: 'Github', color: 'from-gray-800 to-gray-600', shadow: 'shadow-gray-700/20' }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="flex flex-col items-center gap-8">
          {/* Social Links Section */}
          <div className="flex flex-col items-center gap-6">
            <span className="text-gray-400 text-xs uppercase tracking-[0.3em] font-medium">Connect With Us</span>
            <div className="flex flex-wrap justify-center gap-5">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group p-[2px] rounded-2xl bg-gradient-to-br ${link.color} ${link.shadow} shadow-lg`}
                  aria-label={link.label}
                >
                  <div className="bg-gray-900 rounded-[14px] p-3 text-white transition-all duration-300 group-hover:bg-transparent">
                    <span className="text-xl md:text-2xl block drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Copyright Section */}
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-300 font-medium tracking-wide">
                Made with <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-red-500 inline-block"
                >❤️</motion.span> by AI Trip Planner — FYP Team
              </p>
              <div className="h-1 w-12 bg-blue-500 rounded-full opacity-50" />
            </div>
            <p className="text-xs text-gray-500 font-light max-w-md">
              &copy; {new Date().getFullYear()} AI Trip Planner. All rights reserved. <br />
              Smart travel planning for Pakistan — flights, hotels, transport, budgets &amp; safety in PKR.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


