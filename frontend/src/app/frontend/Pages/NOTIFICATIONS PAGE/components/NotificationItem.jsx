import React from "react";
import { motion } from "framer-motion";

function timeAgo(dateString) {
  const ts = new Date(dateString).getTime();
  if (Number.isNaN(ts)) return "";
  const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (sec < 10) return "Just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function palette(type) {
  switch (type) {
    case 'Budget':
      return { icon: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-100', dot: 'bg-emerald-600' };
    case 'Weather':
      return { icon: 'bg-sky-50 text-sky-600', ring: 'ring-sky-100', dot: 'bg-sky-600' };
    case 'Flights':
      return { icon: 'bg-indigo-50 text-indigo-600', ring: 'ring-indigo-100', dot: 'bg-indigo-600' };
    case 'Safety':
      return { icon: 'bg-rose-50 text-rose-600', ring: 'ring-rose-100', dot: 'bg-rose-600' };
    case 'Trip':
      return { icon: 'bg-amber-50 text-amber-600', ring: 'ring-amber-100', dot: 'bg-amber-600' };
    default:
      return { icon: 'bg-slate-50 text-slate-600', ring: 'ring-slate-100', dot: 'bg-slate-600' };
  }
}

export default function NotificationItem({ n, onDelete, onToggleRead, hideType }) {
  const p = palette(n.type);

  return (
    <div
      onClick={() => !n.isRead && onToggleRead()}
      className={`group relative flex items-start gap-5 p-5 transition-all duration-300 rounded-[2rem] border-2 cursor-pointer shadow-sm ${n.isRead
        ? 'bg-white/50 border-slate-50 opacity-60'
        : 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100'
        }`}
    >
      {/* Unread Indicator */}
      {!n.isRead && (
        <span className={`absolute top-6 right-6 h-2 w-2 rounded-full ${p.dot} animate-pulse`} />
      )}

      {/* Icon */}
      <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${p.icon} text-2xl ring-4 ring-white shadow-sm transition-transform duration-500 group-hover:scale-110 shadow-inner`}>
        {n.icon || '🔔'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {!hideType && (
              <>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    n.isRead ? "text-slate-400" : "text-indigo-100/90"
                  }`}
                >
                  {n.type}
                </span>
                <span className={`h-1 w-1 rounded-full ${n.isRead ? "bg-slate-200" : "bg-indigo-300/80"}`} />
              </>
            )}
            <span className={`text-[10px] font-bold ${n.isRead ? "text-slate-400" : "text-indigo-100/80"}`}>
              {timeAgo(n.createdAt)}
            </span>
          </div>

          <h4 className={`text-lg font-black leading-snug transition-colors ${n.isRead ? 'text-slate-600' : 'text-white group-hover:text-indigo-100'}`}>
            {n.title}
          </h4>

          <p className={`text-sm font-medium leading-relaxed ${n.isRead ? 'text-slate-400' : 'text-slate-100'}`}>
            {n.message}
          </p>
        </div>

        {/* Actions Overlay */}
        <div className="absolute right-6 bottom-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-sm"
            title="Remove"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
