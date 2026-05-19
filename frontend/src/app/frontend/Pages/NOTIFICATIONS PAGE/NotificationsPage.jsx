import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AlertsToggle from "./components/AlertsToggle";
import NotificationFilters from "./components/NotificationFilters";
import NotificationItem from "./components/NotificationItem";
import EmptyState from "./components/EmptyState";
import BackToDashboardButton from '../../components/BackToDashboardButton';
import api, { API_ENDPOINTS } from "../../src/config/api";
import {
  parseNotificationsList,
  countUnreadNotifications,
  syncNotificationBadge,
} from "../../src/services/api";

const filters = ["All", "Budget", "Weather", "Flights", "Safety", "Trip", "System"];

/** Poll while this page is open so new server notifications appear without refresh. */
const NOTIFICATIONS_POLL_MS = 20000;

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [alertsEnabled, setAlertsEnabled] = useState(() => {
    const v = localStorage.getItem('travelAlertsEnabled');
    return v === null ? true : v === 'true';
  });

  useEffect(() => {
    localStorage.setItem('travelAlertsEnabled', String(alertsEnabled));
  }, [alertsEnabled]);

  useEffect(() => {
    let cancelled = false;

    const load = async (silent) => {
      if (!silent) setLoading(true);
      try {
        const res = await api.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
        if (cancelled) return;
        const list = parseNotificationsList(res);
        setNotifications(list);
        setFetchError("");
        syncNotificationBadge(countUnreadNotifications(list));
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch notifications:", err);
          setFetchError(err.response?.data?.message || "Could not load notifications. Check you are logged in.");
        }
      } finally {
        if (!cancelled && !silent) setLoading(false);
      }
    };

    load(false);
    const intervalId = setInterval(() => load(true), NOTIFICATIONS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      syncNotificationBadge(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete(API_ENDPOINTS.NOTIFICATIONS.BASE);
      setNotifications([]);
      syncNotificationBadge(0);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}`);
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== id);
        syncNotificationBadge(countUnreadNotifications(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleToggleRead = async (id, currentStatus) => {
    if (currentStatus) return; // Already read
    try {
      await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
        syncNotificationBadge(countUnreadNotifications(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to toggle read status:", err);
    }
  };

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const unreadCount = useMemo(
    () => countUnreadNotifications(notifications),
    [notifications]
  );

  // Group notifications by date
  const grouped = useMemo(() => {
    const groups = { Today: [], Yesterday: [], Earlier: [] };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;

    filtered.forEach(n => {
      const date = new Date(n.createdAt).getTime();
      if (Number.isNaN(date)) {
        groups.Earlier.push(n);
        return;
      }
      if (date >= today) groups.Today.push(n);
      else if (date >= yesterday) groups.Yesterday.push(n);
      else groups.Earlier.push(n);
    });

    return groups;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-50/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 text-center md:text-left">
              <BackToDashboardButton />
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <h1 className="text-5xl md:text-6xl font-extrabold text-[#1a1a1a] tracking-tight">
                  Notifications
                </h1>
                <div className="h-1.5 w-24 bg-indigo-600 rounded-full mt-4 mx-auto md:mx-0" />
              </motion.div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-900 px-3 py-1.5 text-xs font-bold border border-emerald-100">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Live inbox
                </span>
               
              </div>
              <p className="text-slate-500 font-bold text-sm">
                {unreadCount === 0 ? "You're all caught up." : `${unreadCount} unread`}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AlertsToggle enabled={alertsEnabled} onChange={setAlertsEnabled} />
            </motion.div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-3 sm:p-4 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
            <NotificationFilters filters={filters} value={activeFilter} onChange={setActiveFilter} />

            <div className="flex items-center gap-1 pr-2 shrink-0">
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="px-4 py-2.5 text-xs font-black text-slate-800 hover:text-indigo-600 disabled:opacity-30 transition-all uppercase tracking-wide whitespace-nowrap"
              >
                Mark all read
              </button>
              <div className="w-px h-4 bg-slate-200" />
              <button
                type="button"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
                className="px-4 py-2.5 text-xs font-black text-rose-600 hover:text-rose-700 disabled:opacity-30 transition-all uppercase tracking-wide whitespace-nowrap"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>

        {fetchError && (
          <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm font-bold text-rose-800">
            {fetchError}
          </div>
        )}

        {!alertsEnabled && notifications.length > 0 && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
            Alerts are paused in settings, but your inbox is still shown below.
          </div>
        )}

        {/* Content Section */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
              </div>
              <p className="text-sm font-bold text-slate-600">Loading your notifications…</p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              enabled={alertsEnabled}
              onEnable={() => setAlertsEnabled(true)}
              filterEmpty={
                notifications.length > 0 &&
                activeFilter !== "All" &&
                filtered.length === 0
              }
            />
          ) : (
            <div className="space-y-20 pb-20">
              {Object.entries(grouped).map(([title, items]) => items.length > 0 && (
                <div key={title} className="space-y-10">
                  <div className="flex items-center gap-8">
                    <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] whitespace-nowrap px-4 py-2 bg-slate-50 rounded-full">{title}</h2>
                    <div className="h-[1px] grow bg-slate-100" />
                  </div>

                  <div className="grid gap-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {items.map((n) => (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <NotificationItem
                            n={n}
                            hideType={activeFilter !== 'All'}
                            onDelete={() => handleDelete(n.id)}
                            onToggleRead={() => handleToggleRead(n.id, n.isRead)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation for functional parity */}
        {!loading && (
          <div className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              className="group flex items-center justify-center gap-3 bg-white border-2 border-slate-200 py-4 rounded-2xl text-slate-900 font-black text-sm hover:border-indigo-200 hover:bg-indigo-50/50 transition-all shadow-sm active:scale-[0.98]"
              onClick={() => navigate("/dashboard")}
            >
              <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">←</span>
              <span>Back to dashboard</span>
            </button>
            <button
              type="button"
              className="group flex items-center justify-center gap-3 bg-gradient-to-br from-indigo-600 to-violet-600 py-4 rounded-2xl text-white font-black text-sm hover:opacity-95 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
              onClick={() => navigate("/settings")}
            >
              <span>Account &amp; preferences</span>
              <span className="text-white/80 group-hover:text-white transition-colors">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
