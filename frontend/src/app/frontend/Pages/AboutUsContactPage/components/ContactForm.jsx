// ContactForm.jsx
import React, { useState } from 'react';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-6">
      <h3 className="text-xl font-semibold text-green-800 mb-4">Contact Us</h3>
      {submitted ? (
        <div className="text-green-600 font-semibold">Thank you for contacting us!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="w-full p-3 rounded-xl border-2 border-green-100 bg-gray-50 text-base outline-none focus:border-green-400" />
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full p-3 rounded-xl border-2 border-green-100 bg-gray-50 text-base outline-none focus:border-green-400" />
          <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Message" className="w-full p-3 rounded-xl border-2 border-green-100 bg-gray-50 text-base outline-none focus:border-green-400" rows={4} />
          <button type="submit" className="bg-gradient-to-r from-green-500 to-blue-400 text-white rounded-xl px-6 py-2 font-semibold shadow hover:from-blue-400 hover:to-green-500 transition">Send</button>
        </form>
      )}
    </section>
  );
};

export default ContactForm;
