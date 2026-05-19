import React from "react";
import { motion } from "framer-motion";

export default function EmptyState({ enabled, onEnable, filterEmpty }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-20 animate-pulse" />
        <div className="relative grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 shadow-inner ring-1 ring-indigo-100">
          <span className="text-5xl transform -rotate-12">🔔</span>
        </div>
      </div>

      {filterEmpty ? (
        <>
          <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
            Nothing in this category
          </h3>
          <p className="max-w-sm text-sm text-slate-600 font-semibold leading-relaxed">
            You still have alerts — pick another filter or choose <span className="text-indigo-600">All</span> to see everything.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
            {enabled ? "No alerts right now" : "Alerts paused"}
          </h3>
          <p className="max-w-sm text-sm text-slate-600 font-semibold leading-relaxed">
            {enabled
              ? "When your trips, flights, budget, weather, or safety need attention, new messages will show up here automatically."
              : "Turn alerts back on to see your travel updates in this inbox. You can still browse the rest of the app."}
          </p>
        </>
      )}

      {!enabled && (
        <button
          type="button"
          onClick={onEnable}
          className="mt-8 text-sm font-black text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Turn on alerts →
        </button>
      )}
    </motion.div>
  );
}
