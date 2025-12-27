import React from "react";

export default function SOSButton() {
  const callNumber = (num) => {
    try {
      window.location.href = `tel:${num}`;
    } catch (e) {
      alert(`Dial: ${num}`);
    }
  };

  const handleClick = () => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          try {
            const lat = Number(pos.coords.latitude);
            const lon = Number(pos.coords.longitude);
            if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=police+station+near+${lat},${lon}`;
              window.open(mapsUrl, "_blank", "noopener,noreferrer");
            }
          } catch {
            // ignore map errors, still attempt call
          }
          callNumber("112");
        },
        () => {
          callNumber("112");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      callNumber("112");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-red-500/25 animate-ping" aria-hidden />
          <button
            onClick={handleClick}
            className="group relative inline-flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-xl transition-all duration-200 hover:from-red-700 hover:to-rose-700 hover:shadow-2xl active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400"
            aria-label="Call emergency"
          >
            <span className="text-2xl font-extrabold tracking-wide">SOS</span>
            <span className="absolute -inset-2 -z-10 rounded-full bg-red-500/30 blur-lg group-hover:bg-red-500/40" />
          </button>
        </div>
      </div>
      <p className="mt-3 text-center text-sm text-gray-600">
        Default emergency: <span className="font-semibold text-red-700">112</span>. Use the list to dial specific services.
      </p>
    </div>
  );
}
