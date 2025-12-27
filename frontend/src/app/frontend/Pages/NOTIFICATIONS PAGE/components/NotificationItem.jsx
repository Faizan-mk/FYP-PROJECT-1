import React from "react";

function timeAgo(ts) {
  const diff = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  const units = [
    [60, 'sec'],
    [60, 'min'],
    [24, 'h'],
    [7, 'd'],
  ];
  let val = diff;
  let unit = 'sec';
  for (const [step, name] of units) {
    if (val < step) { unit = name; break; }
    val = Math.floor(val / step);
    unit = name;
  }
  return `${val} ${unit} ago`;
}

function palette(type) {
  switch (type) {
    case 'Budget':
      return {
        icon: 'from-emerald-50 to-emerald-100 ring-emerald-200 text-emerald-700',
        chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      };
    case 'Weather':
      return {
        icon: 'from-sky-50 to-sky-100 ring-sky-200 text-sky-700',
        chip: 'bg-sky-50 text-sky-700 ring-sky-200'
      };
    case 'Flights':
      return {
        icon: 'from-indigo-50 to-indigo-100 ring-indigo-200 text-indigo-700',
        chip: 'bg-indigo-50 text-indigo-700 ring-indigo-200'
      };
    case 'Safety':
      return {
        icon: 'from-rose-50 to-rose-100 ring-rose-200 text-rose-700',
        chip: 'bg-rose-50 text-rose-700 ring-rose-200'
      };
    default:
      return {
        icon: 'from-purple-50 to-purple-100 ring-purple-200 text-purple-700',
        chip: 'bg-purple-50 text-purple-700 ring-purple-200'
      };
  }
}

export default function NotificationItem({ n }) {
  const p = palette(n.type);
  return (
    <div className="group relative flex items-start gap-3 py-3 transition-colors hover:bg-gray-50/60 rounded-xl px-2">
      <span className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${p.icon} text-lg ring-1`}>
        {n.icon || '🔔'}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="truncate font-semibold text-gray-900">{n.title}</div>
          <div className="shrink-0 text-xs text-gray-500" title={new Date(n.ts).toLocaleString()}>{timeAgo(n.ts)}</div>
        </div>
        <div className="text-sm text-gray-700">{n.message}</div>
        <div className="mt-1 inline-flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ring-1 ${p.chip}`}>
            <span>#{n.type}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
