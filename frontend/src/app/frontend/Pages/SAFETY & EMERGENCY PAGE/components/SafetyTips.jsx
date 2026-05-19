import React from "react";

const defaultTips = [
  { icon: "🧭", text: "Save local emergency numbers before you travel." },
  { icon: "🛂", text: "Keep copies of passport and IDs in a secure place." },
  { icon: "🚖", text: "Use registered taxis or ride services." },
  { icon: "🌃", text: "Avoid poorly lit or isolated areas at night." },
  { icon: "📤", text: "Share your itinerary with a trusted contact." },
];

export default function SafetyTips({ tips }) {
  const displayTips = tips && tips.length > 0
    ? tips.map(t => ({ icon: "🛡️", text: t }))
    : defaultTips;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {displayTips.map((tip, i) => (
        <div
          key={i}
          className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100/50 text-lg flex-none">
            {tip.icon}
          </span>
          <p className="text-sm font-bold text-slate-700 leading-relaxed">{tip.text}</p>
        </div>
      ))}
    </div>
  );
}
