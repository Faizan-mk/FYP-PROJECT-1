import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import SOSButton from "./components/SOSButton";
import EmergencyNumbers from "./components/EmergencyNumbers";
import MapEmbed from "./components/MapEmbed";
import ShareLocationToggle from "./components/ShareLocationToggle";
import SafetyTips from "./components/SafetyTips";
import BackToDashboardButton from '../../components/BackToDashboardButton';

export default function SafetyEmergencyPage() {
  const [coords, setCoords] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.06),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(79,70,229,0.06),transparent_45%)]">
      <div className="rounded-2xl p-[2px] bg-gradient-to-r from-rose-100 via-red-100 to-indigo-100 shadow-md">
        <div className="rounded-[14px] border border-gray-200 bg-white/80 backdrop-blur p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">Safety & Emergency</span>
              </h1>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-rose-100 px-4 py-2 text-red-700 ring-1 ring-red-200">
                <span>🛡️</span>
                <span className="font-semibold">Stay prepared. Act fast.</span>
              </div>
            </div>
            <BackToDashboardButton />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SOSButton />
              <ShareLocationToggle
                enabled={locationEnabled}
                onToggle={(enabled, position) => {
                  setLocationEnabled(enabled);
                  setCoords(position ?? null);
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <span>📍</span>
              <span>Nearby Help</span>
            </h2>
            <MapEmbed coords={coords} locationEnabled={locationEnabled} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <span>✅</span>
              <span>Safety Tips</span>
            </h2>
            <SafetyTips />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <span>📞</span>
              <span>Emergency Numbers</span>
            </h2>
            <EmergencyNumbers />
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <button
          className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-black font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:bg-gray-200 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
          onClick={() => navigate('/chatbot')}
        >
          Back
        </button>
        <button
          className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-black font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:bg-indigo-700 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
          onClick={() => navigate('/notifications')}
        >
          Next
        </button>
      </div>
    </div>
  );
}
