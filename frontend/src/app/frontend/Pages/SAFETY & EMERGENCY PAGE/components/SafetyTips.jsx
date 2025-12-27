import React from "react";

const tips = [
  { icon: "🧭", text: "Save local emergency numbers before you travel." },
  { icon: "🛂", text: "Keep copies of passport and IDs in a secure place." },
  { icon: "🚖", text: "Use registered taxis or ride services." },
  { icon: "🌃", text: "Avoid poorly lit or isolated areas at night." },
  { icon: "📤", text: "Share your itinerary with a trusted contact." },
];

export default function SafetyTips() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {tips.map((tip, i) => (
        <div
          key={i}
          className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-3 shadow-sm hover:shadow-md transition"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 text-lg ring-1 ring-indigo-100">
            {tip.icon}
          </span>
          <p className="text-sm text-gray-800 leading-snug">{tip.text}</p>
        </div>
      ))}
    </div>
  );
}
