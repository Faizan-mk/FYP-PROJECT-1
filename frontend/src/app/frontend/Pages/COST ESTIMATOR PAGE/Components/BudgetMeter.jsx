import React from "react";

export default function BudgetMeter({ total, budget }) {
  const ratio = budget > 0 ? total / budget : 0;
  const widthPct = budget > 0 ? Math.min(100, ratio * 100) : 0;
  const near = ratio >= 0.8 && ratio <= 1;
  const over = ratio > 1;
  const barColor = over ? "from-red-400 to-red-600" : near ? "from-amber-400 to-amber-600" : "from-green-400 to-green-600";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Budget usage</span>
        <span className={over ? "text-red-600" : near ? "text-amber-600" : "text-green-600"}>
          {budget > 0 ? `${total.toLocaleString()} / ${budget.toLocaleString()}` : `Set a budget`}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-gradient-to-b from-gray-200 to-gray-100 shadow-inner">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${barColor} transition-all duration-300`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      {budget > 0 && (
        <div className={`text-sm ${over ? "text-red-600" : "text-gray-600"}`}>
          {over ? `Over budget by ${(total - budget).toLocaleString()}` : `${Math.max(0, Math.round((1 - ratio) * 100))}% budget remaining`}
        </div>
      )}
    </div>
  );
}
