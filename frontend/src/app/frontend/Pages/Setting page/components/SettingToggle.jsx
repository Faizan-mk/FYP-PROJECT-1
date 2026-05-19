import React from 'react';
import { motion } from 'framer-motion';

export default function SettingToggle({ label, hint, enabled, onChange, icon }) {
  return (
    <motion.div
      layout
      className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors"
    >
      <motion.div className="flex items-start gap-3 min-w-0">
        {icon && <span className="text-lg shrink-0 mt-0.5">{icon}</span>}
        <div>
          <p className="text-sm font-black text-slate-900">{label}</p>
          {hint && <p className="text-xs font-medium text-slate-500 mt-0.5">{hint}</p>}
        </div>
      </motion.div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors duration-300 ${
          enabled ? 'bg-indigo-600' : 'bg-slate-200'
        }`}
      >
        <motion.span
          animate={{ x: enabled ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute h-6 w-6 rounded-full bg-white shadow-md"
        />
      </button>
    </motion.div>
  );
}
