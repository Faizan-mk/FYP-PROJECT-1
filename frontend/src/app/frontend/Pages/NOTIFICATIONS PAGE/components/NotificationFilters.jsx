import React from "react";

export default function NotificationFilters({ filters, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f) => {
        const active = f === value;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              active
                ? "bg-indigo-600 text-white ring-indigo-400 hover:bg-indigo-700"
                : "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 ring-indigo-200 hover:from-indigo-100 hover:to-purple-100"
            }`}
          >
            <span>{iconFor(f)}</span>
            <span>{f}</span>
          </button>
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
    default:
      return "🔔";
  }
}
