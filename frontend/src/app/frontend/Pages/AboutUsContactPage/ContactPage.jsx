import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiClock, FiHelpCircle } from 'react-icons/fi';
import PublicPageShell from './components/PublicPageShell';
import ContactForm from './components/ContactForm';
import SocialLinks from './components/SocialLinks';
import { CONTACT } from '../../src/config/contact';

const CONTACT_INFO = [
  {
    icon: <FiMail />,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: <FiPhone />,
    label: 'Phone',
    value: CONTACT.whatsapp.displayIntl,
    href: `tel:+${CONTACT.whatsapp.number}`,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: <FiMapPin />,
    label: 'Location',
    value: CONTACT.location,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: <FiClock />,
    label: 'Response time',
    value: CONTACT.responseTime,
    color: 'bg-amber-100 text-amber-600',
  },
];

const FAQ = [
  {
    q: 'Is AI Trip Planner free to use?',
    a: 'Yes — sign up to access flights, hotels, transport search, cost estimator, budget planner, weather, and the AI chatbot.',
  },
  {
    q: 'Which cities and routes are supported?',
    a: 'We focus on domestic Pakistan travel — major cities, northern areas (Hunza, Swat, etc.), and inter-city bus and flight routes.',
  },
  {
    q: 'How does the AI chatbot work?',
    a: 'Our TensorFlow-based model answers travel questions about routes, budgets, packing, and trip planning. It runs via a Flask API connected to the main backend.',
  },
  {
    q: 'I found a bug in my booking. What should I do?',
    a: 'Use the form below and select “Bug report” — include your booking reference if you have one. For airline refunds, contact the airline directly as noted in your cancellation email.',
  },
];

const ContactPage = () => {
  return (
    <PublicPageShell>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-200 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-6">
            We are here to help
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Contact us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Questions about flights, bookings, the AI assistant, or our FYP project? Send us a
            message and the team will get back to you.
          </motion.p>
        </div>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-12 fill-slate-50 -mb-px">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58,117.26,163.75,124.47,242.43,101.58,284.15,89.51,321.39,56.44,321.39,56.44Z" />
        </svg>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-8 relative z-10"
        >
          {/* Contact details */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              className="bg-white p-8 rounded-3xl shadow-lg ring-1 ring-slate-200/80"
              whileHover={{ y: -2 }}
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Get in touch</h2>
              <div className="space-y-6">
                {CONTACT_INFO.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`p-3 rounded-xl ${info.color} shrink-0`}>
                      <span className="text-lg">{info.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-slate-900 font-semibold hover:text-blue-600 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-slate-900 font-semibold">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-center text-slate-500 text-sm mb-4 font-medium">Follow the project</p>
                <SocialLinks />
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="font-bold mb-2">Already have an account?</p>
              <p className="text-blue-100 text-sm mb-4">
                Log in to manage bookings, trips, and settings from your dashboard.
              </p>
              <Link
                to="/login"
                className="inline-block w-full text-center py-2.5 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Go to login
              </Link>
            </motion.div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white p-8 md:p-10 rounded-3xl shadow-lg ring-1 ring-slate-200/80 h-full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send a message</h2>
              <p className="text-slate-600 text-sm mb-8">
                Tell us about a booking issue, feature idea, or general question about AI Trip
                Planner.
              </p>
              <ContactForm />
            </motion.div>
          </div>
        </motion.div>

        {/* FAQ */}
        <section className="mt-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
              <FiHelpCircle />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
              <p className="text-slate-600 text-sm">Quick answers before you write to us</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQ.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-6 ring-1 ring-slate-200/80"
              >
                <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PublicPageShell>
  );
};

export default ContactPage;
