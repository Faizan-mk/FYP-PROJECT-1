import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiTarget,
  FiCpu,
  FiMap,
  FiShield,
  FiMessageCircle,
  FiLayers,
} from 'react-icons/fi';
import PublicPageShell from './components/PublicPageShell';
import TeamCards from './components/TeamCards';
import SocialLinks from './components/SocialLinks';

const PROJECT_FEATURES = [
  { icon: '🤖', title: 'AI Travel Assistant', desc: 'Neural-network chatbot for routes, budgets, and trip ideas.' },
  { icon: '✈️', title: 'Domestic Flights', desc: 'Search PIA, Air Sial, Serene Air and compare fares in PKR.' },
  { icon: '🏨', title: 'Hotels', desc: 'Browse hotels across Pakistani cities with live pricing.' },
  { icon: '🚌', title: 'Transport', desc: 'Book buses and coaches between major cities.' },
  { icon: '🗺️', title: 'Destinations', desc: 'Guides for Hunza, Swat, Lahore, Karachi and more.' },
  { icon: '💰', title: 'Cost Estimator', desc: 'Flights, hotels, food, transport and activities in one PKR total.' },
  { icon: '📊', title: 'Budget Planner', desc: 'Set a budget and get suggestions to stay within limit.' },
  { icon: '☁️', title: 'Live Weather', desc: 'Conditions before you travel — especially northern areas.' },
  { icon: '🛡️', title: 'Safety & SOS', desc: 'Emergency contacts and travel safety tips.' },
  { icon: '📑', title: 'My Bookings', desc: 'Flights, transport, trip overview and past trips in one place.' },
];

const TECH_STACK = [
  { label: 'Frontend', value: 'React + Vite + Tailwind CSS' },
  { label: 'Backend', value: 'Node.js + Express + MySQL' },
  { label: 'AI Engine', value: 'Python + TensorFlow + Flask API' },
  { label: 'Auth', value: 'JWT + Google Sign-In' },
];

const MISSION_CARDS = [
  {
    icon: <FiTarget />,
    title: 'Our Mission',
    text: 'Make Pakistan travel planning simple — one platform for flights, hotels, transport, budgets, weather, and safety in PKR.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: <FiMap />,
    title: 'Built for Pakistan',
    text: 'Domestic routes, local transport operators, northern-area tips, and pricing that reflects how Pakistanis actually travel.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: <FiShield />,
    title: 'Travel with confidence',
    text: 'Weather alerts, budget tracking, safety modules, and smart notifications so you are prepared before you leave.',
    color: 'bg-indigo-100 text-indigo-600',
  },
];

const AboutPage = () => {
  return (
    <PublicPageShell>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white overflow-hidden">
        <motion.div
          className="absolute top-24 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-4 py-1.5 rounded-full mb-6">
            <span>🇵🇰</span> Final Year Project
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            About AI Trip Planner
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed"
          >
            A full-stack AI travel assistant built for Pakistan — plan domestic trips, compare
            flights and hotels in PKR, estimate costs, check weather, and chat with our AI
            chatbot from one dashboard.
          </motion.p>
        </div>
        <motion.div
          className="absolute -bottom-1 left-0 w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-12 fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58,117.26,163.75,124.47,242.43,101.58,284.15,89.51,321.39,56.44,321.39,56.44Z" />
          </svg>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Mission */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-8 relative z-10"
          >
            {MISSION_CARDS.map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -4 }}
                className="bg-white p-8 rounded-3xl shadow-lg ring-1 ring-slate-200/80 text-center"
              >
                <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* What we built */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">
              Platform modules
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What you can do with AI Trip Planner
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every feature in our FYP — from booking to budgeting — designed for domestic and
              northern-area travel across Pakistan.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {PROJECT_FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-slate-50 rounded-2xl p-5 ring-1 ring-slate-200/80 hover:ring-blue-200 hover:shadow-md transition-all"
              >
                <span className="text-3xl block mb-3">{f.icon}</span>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{f.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              Start planning your trip
            </Link>
          </div>
        </section>

        {/* Tech stack */}
        <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="md:w-1/3">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-4">
                <FiCpu />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">How it works</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                React talks to our Node.js API, which stores bookings and user data in MySQL. The
                AI chatbot runs on a separate Flask service powered by a TensorFlow model trained
                on travel intents.
              </p>
            </div>
            <motion.div
              className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {TECH_STACK.map((item) => (
                <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">
                    {item.label}
                  </p>
                  <p className="text-white font-medium">{item.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <FiLayers /> 12+ travel modules
            </span>
            <span className="flex items-center gap-2">
              <FiMessageCircle /> AI chatbot (English / Urdu-style)
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">PKR</span> Local pricing throughout
            </span>
          </div>
        </section>

        {/* Team */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Meet the FYP Team</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Built by students passionate about making travel across Pakistan smarter and more
              accessible.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mt-4" />
          </div>
          <TeamCards />
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 md:p-14 text-center ring-1 ring-blue-100">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Questions or feedback?</h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            We would love to hear from travelers, reviewers, or anyone interested in our project.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/contact"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Contact us
            </Link>
            <Link
              to="/"
              className="px-8 py-3 bg-white text-slate-800 rounded-full font-semibold ring-1 ring-slate-200 hover:ring-blue-200 transition-all"
            >
              Back to home
            </Link>
          </div>
          <SocialLinks />
        </section>
      </div>
    </PublicPageShell>
  );
};

export default AboutPage;
