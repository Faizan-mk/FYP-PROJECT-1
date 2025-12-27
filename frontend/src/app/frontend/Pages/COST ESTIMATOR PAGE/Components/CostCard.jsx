import React from "react";

export default function CostCard({ label, value, color, icon }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 bg-white/80 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-medium flex items-center gap-2">
          {icon}
          {label}
        </span>
      </div>
      <div className="font-semibold">{Number(value || 0).toLocaleString()}</div>
    </div>
  );
}
