import React from "react";

export default function AlertsToggle({ enabled, onChange }) {
  const title = enabled ? "Alerts enabled" : "Alerts disabled";
  return (
    <div className="inline-flex items-center gap-3 shrink-0">
      <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
        <span>🔔</span>
        <span>Alerts</span>
      </span>
      <span
        className={`hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${
          enabled ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-gray-50 text-gray-700 ring-gray-200"
        }`}
      >
        {enabled ? "On" : "Off"}
      </span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-9 w-16 items-center rounded-full transition-all shadow ${
          enabled
            ? "bg-gradient-to-r from-emerald-500 to-green-600 ring-1 ring-emerald-300 hover:from-emerald-600 hover:to-green-700"
            : "bg-gradient-to-r from-gray-300 to-gray-400 ring-1 ring-gray-300 hover:from-gray-300 hover:to-gray-400"
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          enabled ? "focus-visible:ring-emerald-400" : "focus-visible:ring-gray-400"
        } active:scale-[0.98]`} 
        role="switch"
        aria-checked={enabled}
        aria-label="Toggle alerts"
        title={title}
      >
        {enabled && (
          <span className="pointer-events-none absolute inset-0 -z-0 rounded-full bg-emerald-400/25 blur-sm" aria-hidden />
        )}
        <span
          className={`relative inline-grid h-7 w-7 place-items-center transform rounded-full bg-white text-sm shadow transition-all ${
            enabled ? "translate-x-8 text-emerald-600" : "translate-x-1 text-gray-600"
          }`}
        >
          {enabled ? "🔔" : "🔕"}
        </span>
      </button>
    </div>
  );
}
