// SocialLinks.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/muhammad-faizanmk/', icon: <FaLinkedinIn />, color: 'hover:bg-blue-700' },
  { name: 'Facebook', url: 'https://facebook.com', icon: <FaFacebookF />, color: 'hover:bg-blue-600' },
  { name: 'Instagram', url: 'https://instagram.com', icon: <FaInstagram />, color: 'hover:bg-pink-600' },
  { name: 'Twitter', url: 'https://twitter.com', icon: <FaTwitter />, color: 'hover:bg-sky-500' },
];

const SocialLinks = () => (
  <div className="flex flex-wrap justify-center gap-4">
    {socials.map((s, index) => (
      <motion.a
        key={s.name}
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-md text-gray-600 ${s.color} hover:text-white transition-all duration-300`}
        title={s.name}
      >
        <span className="text-xl">{s.icon}</span>
      </motion.a>
    ))}
  </div>
);

export default SocialLinks;

