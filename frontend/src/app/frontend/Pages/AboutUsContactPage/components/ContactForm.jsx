import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMessageSquare, FiSend, FiTag, FiAlertCircle } from 'react-icons/fi';
import { contactService } from '../../../src/services/api';

const SUBJECTS = [
  'General inquiry',
  'Booking help',
  'AI chatbot question',
  'Bug report',
  'Feature suggestion',
  'FYP / academic inquiry',
];

const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: SUBJECTS[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contactService.sendMessage(form);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' });
    } catch (err) {
      setError(err?.message || 'Could not send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Message sent</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Thanks for reaching out to AI Trip Planner. Your message was saved and our FYP team will
          respond within 24–48 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-blue-600 font-semibold hover:text-blue-700"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const inputClass =
    'w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          <FiAlertCircle className="shrink-0 mt-0.5 text-lg" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative">
          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <motion.div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email address"
            className={inputClass}
          />
        </motion.div>
      </div>

      <div className="relative">
        <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <FiMessageSquare className="absolute left-4 top-4 text-slate-400" />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          minLength={10}
          placeholder="Describe your question or issue..."
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <span>Send message</span>
            <FiSend className="text-lg" />
          </>
        )}
      </motion.button>
    </form>
  );
};

export default ContactForm;
