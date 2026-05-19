import React, { useState, useEffect } from "react";
import SOSButton from "./components/SOSButton";
import EmergencyNumbers from "./components/EmergencyNumbers";
import MapEmbed from "./components/MapEmbed";
import ShareLocationToggle from "./components/ShareLocationToggle";
import SafetyTips from "./components/SafetyTips";
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { safetyService } from "../../src/services/api";
import { FaGlobe } from "react-icons/fa";

const DESTINATION_OPTIONS = [
  { value: "Pakistan", label: "Pakistan (default)" },
  { value: "Global", label: "International travel" },
];

export default function SafetyEmergencyPage() {
  const [coords, setCoords] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [safetyData, setSafetyData] = useState(null);
  const [destination, setDestination] = useState("Pakistan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("selectedDestinations") || "[]");
    if (saved[0]?.country === "Pakistan" || saved[0]?.name) {
      setDestination("Pakistan");
    }
  }, []);

  useEffect(() => {
    fetchSafetyData(destination);
  }, [destination]);

  const fetchSafetyData = async (dest) => {
    try {
      setLoading(true);
      setError("");
      const res = await safetyService.getSafetyData(dest);
      setSafetyData(res?.data ?? null);
    } catch (err) {
      console.error("Failed to fetch safety data:", err);
      setError("Could not load safety information. Showing local defaults.");
      setSafetyData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.06),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(79,70,229,0.06),transparent_45%)]">
      <div className="rounded-2xl p-[2px] bg-gradient-to-r from-rose-100 via-red-100 to-indigo-100 shadow-md">
        <div className="rounded-[14px] bg-white/80 backdrop-blur-xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200">
              <span className="text-2xl">🆘</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Safety & Emergency</h1>
              <p className="text-sm text-gray-500 font-medium">
                SOS, local helplines, and tips for travel in Pakistan
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label className="flex flex-col gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Region
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                {DESTINATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <BackToDashboardButton />
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-center text-sm font-medium text-gray-500 py-12">Loading safety information…</p>
      ) : (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SOSButton safetyData={safetyData} />
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

          {safetyData?.embassyInfo && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span>🏢</span>
                  <span>Embassy / Consulate Info</span>
                </h2>
                <button
                  onClick={() => {
                    const q = encodeURIComponent(`embassy consulate in ${safetyData.destination}`);
                    window.open(`https://www.google.com/maps/search/${q}`, "_blank");
                  }}
                  className="text-xs font-black text-indigo-600 hover:text-indigo-700 underline flex items-center gap-1"
                >
                  <FaGlobe className="text-[10px]" />
                  Find on Map
                </button>
              </div>
              <div className="p-4 rounded-xl border-l-4 border-indigo-600 bg-indigo-50/50">
                <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                  "{safetyData.embassyInfo}"
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <span>✅</span>
              <span>Safety Tips</span>
            </h2>
            <SafetyTips tips={safetyData?.tips} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <span>📞</span>
              <span>Emergency Numbers</span>
            </h2>
            <EmergencyNumbers safetyData={safetyData} />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
