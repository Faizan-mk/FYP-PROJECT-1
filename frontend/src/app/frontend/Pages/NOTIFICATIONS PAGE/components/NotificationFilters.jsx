import React from "react";
import { motion } from "framer-motion";

export default function NotificationFilters({ filters, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
      {filters.map((f) => {
        const active = f === value;
        return (
          <motion.button
            key={f}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(f)}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-black shadow-sm transition-all border-2 ${active
              ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-transparent shadow-md shadow-indigo-200/50"
              : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40"
              }`}
          >
            <span className="text-base">{iconFor(f)}</span>
            <span>{f}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function iconFor(key) {
  switch (key) {
    case "Budget":
      return "💰";
    case "Weather":
      return "☁️";
    case "Flights":
      return "✈️";
    case "Safety":
      return "🛡️";
    case "Trip":
      return "🌍";
    case "System":
      return "⚙️";
    default:
      return "🔔";
  }
}

