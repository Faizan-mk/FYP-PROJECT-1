import React from "react";

export default function EmptyState({ enabled }) {
  return (
    <div className="py-10 text-center text-gray-600">
      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
        <span>🔔</span>
        <span>Notifications</span>
      </div>
      <div className="mt-3 text-sm">
        {enabled ? 'No notifications right now.' : 'Alerts are disabled.'}
      </div>
    </div>
  );
}
