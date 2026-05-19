import React, { useEffect, useState } from "react";

export default function EmergencyNumbers({ safetyData }) {
  const [numbers, setNumbers] = useState([
    { key: "police", label: "Police", number: "15", emoji: "👮" },
    { key: "ambulance", label: "Ambulance", number: "1122", emoji: "🚑" },
    { key: "fire", label: "Fire", number: "16", emoji: "🚒" },
  ]);

  useEffect(() => {
    setNumbers([
      { key: "police", label: "Police", number: safetyData?.police || "15", emoji: "👮" },
      { key: "ambulance", label: "Ambulance", number: safetyData?.ambulance || "1122", emoji: "🚑" },
      { key: "fire", label: "Fire", number: safetyData?.fire || "16", emoji: "🚒" },
    ]);
  }, [safetyData]);

  const dial = (num) => {
    try {
      window.location.href = `tel:${num}`;
    } catch (e) {
      alert(`Dial: ${num}`);
    }
  };

  const updateNumber = (idx, value) => {
    setNumbers((prev) => prev.map((n, i) => (i === idx ? { ...n, number: value } : n)));
  };

  return (
    <div className="space-y-3">
      {numbers.map((item, idx) => (
        <div
          key={item.key}
          className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-lg">
              {item.emoji}
            </span>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-gray-500">{item.label}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-700">Number:</span>
                <input
                  type="tel"
                  className="w-full sm:w-48 md:w-56 max-w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  value={item.number}
                  onChange={(e) => updateNumber(idx, e.target.value)}
                />
              </div>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:scale-[1.02] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 ring-1 ring-indigo-300/50 shrink-0 whitespace-nowrap"
            onClick={() => dial(item.number)}
            aria-label={`Call ${item.label} at ${item.number}`}
          >
            <span>📞</span>
            <span>Call</span>
          </button>
        </div>
      ))}
    </div>
  );
}
