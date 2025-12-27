import React, { useState } from "react";

export default function ShareLocationToggle({ enabled, onToggle }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);

  const enable = async () => {
    setBusy(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser.");
      setBusy(false);
      onToggle(false, null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = {
          lat: Number(pos.coords.latitude),
          lon: Number(pos.coords.longitude),
        };
        setCoords(position);
        onToggle(true, position);
        setBusy(false);
      },
      (err) => {
        setError(err.message || "Failed to get location.");
        setBusy(false);
        onToggle(false, null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const disable = () => {
    setCoords(null);
    setError("");
    onToggle(false, null);
  };

  const share = async () => {
    if (!coords) return;
    const url = `https://www.google.com/maps?q=${coords.lat},${coords.lon}`;
    const text = `My location: ${coords.lat}, ${coords.lon} — ${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Location", text, url });
      } catch {
        // ignore
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        alert("Location copied to clipboard.");
      } catch {
        alert(text);
      }
    } else {
      alert(text);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="inline-flex items-center gap-3">
        <button
          onClick={enabled ? disable : enable}
          disabled={busy}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow transition-all duration-200 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            enabled ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          } ${enabled ? "focus-visible:ring-emerald-400" : "focus-visible:ring-gray-400"} ${busy ? "opacity-75" : ""}`}
        >
          <span>{enabled ? "🟢" : "📍"}</span>
          <span>{enabled ? "Location On" : busy ? "Getting..." : "Share My Location"}</span>
        </button>
        {enabled && coords && (
          <button
            onClick={share}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
          >
            <span>🔗</span>
            <span>Share</span>
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${
            enabled
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-gray-50 text-gray-700 ring-gray-200"
          }`}
        >
          <span>{enabled ? "✔" : "ℹ"}</span>
          <span>{enabled ? "Location enabled" : "Enable to personalize nearby results"}</span>
        </span>
        {enabled && coords && (
          <div className="text-xs text-gray-700">
            <span className="font-medium">Coords:</span> {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
          </div>
        )}
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
