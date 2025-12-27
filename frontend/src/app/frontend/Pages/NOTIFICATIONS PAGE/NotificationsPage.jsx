import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import NotificationFilters from "./components/NotificationFilters";
import AlertsToggle from "./components/AlertsToggle";
import NotificationItem from "./components/NotificationItem";
import EmptyState from "./components/EmptyState";
import BackToDashboardButton from '../../components/BackToDashboardButton';

const seed = [
  { id: "n1", type: "Budget", icon: "💰", title: "Budget limit nearing", message: "You've used 80% of your budget.", ts: Date.now() - 1000 * 60 * 15 },
  { id: "n2", type: "Weather", icon: "☔", title: "Rain expected", message: "Light showers tomorrow afternoon.", ts: Date.now() - 1000 * 60 * 60 * 3 },
  { id: "n3", type: "Flights", icon: "✈️", title: "Gate change", message: "Flight AF123 now departs from Gate B12.", ts: Date.now() - 1000 * 60 * 60 * 7 },
  { id: "n4", type: "Safety", icon: "🛡️", title: "Local advisory", message: "Avoid crowded areas downtown tonight.", ts: Date.now() - 1000 * 60 * 60 * 24 },
];

const filters = ["All", "Budget", "Weather", "Flights", "Safety"];

export default function NotificationsPage() {
  const [enabled, setEnabled] = useState(true);
  const [active, setActive] = useState("All");
  const [items, setItems] = useState(seed);
  const navigate = useNavigate();

  const list = useMemo(() => {
    const base = active === "All" ? items : items.filter((n) => n.type === active);
    return base.sort((a, b) => b.ts - a.ts);
  }, [active, items]);

  const clearAll = () => setItems([]);

  // Persist count and notify listeners (e.g., TopBar) whenever items change
  useEffect(() => {
    const count = items.length;
    try {
      localStorage.setItem('notificationsCount', String(count));
    } catch {}
    try {
      window.dispatchEvent(new CustomEvent('notifications:update', { detail: count }));
    } catch {}
  }, [items]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.06),transparent_45%)]">
      <div className="rounded-2xl p-[2px] bg-gradient-to-r from-indigo-100 via-violet-100 to-purple-100 shadow-md">
        <div className="rounded-[14px] border border-gray-200 bg-white/80 backdrop-blur p-4 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Notifications</span>
              </h1>
              <AlertsToggle enabled={enabled} onChange={setEnabled} />
            </div>
            <BackToDashboardButton />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <NotificationFilters filters={filters} value={active} onChange={setActive} />
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
              <span>🔔</span>
              <span>{list.length}</span>
            </span>
          </div>
          <button
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              items.length
                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 hover:shadow-md active:translate-y-[1px] focus-visible:ring-rose-400'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed focus-visible:ring-gray-300'
            }`}
            onClick={clearAll}
            disabled={!items.length}
          >
            <span>🗑️</span>
            <span>Clear All</span>
          </button>
        </div>

        <div className="mt-4 divide-y divide-gray-100">
          {list.length ? (
            list.map((n) => <NotificationItem key={n.id} n={n} />)
          ) : (
            <EmptyState enabled={enabled} />)
          }
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <button
          className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-black font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:bg-gray-200 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
          onClick={() => navigate('/safety-emergency')}
        >
          Back
        </button>
        <button
          className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-black font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:bg-indigo-700 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
          onClick={() => navigate('/settings')}
        >
          Next
        </button>
      </div>
    </div>
  );
}
