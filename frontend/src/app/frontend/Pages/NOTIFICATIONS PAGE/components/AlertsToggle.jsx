import React from "react";
import { motion } from "framer-motion";

export default function AlertsToggle({ enabled, onChange }) {
  return (
    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
      <div className="flex flex-col ml-2 text-left">
        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Travel alerts</span>
        <span className={`text-[10px] font-bold ${enabled ? "text-indigo-600" : "text-slate-400"}`}>
          {enabled ? "On — inbox visible" : "Off — inbox hidden"}
        </span>
      </div>

      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${enabled ? "bg-slate-900" : "bg-slate-200"
          }`}
      >
        <motion.span
          animate={{ x: enabled ? 28 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`h-6 w-6 rounded-full bg-white shadow-lg flex items-center justify-center text-[10px]`}
        >
          {enabled ? "🔔" : "🔕"}
        </motion.span>
      </button>
    </div>
  );
}

