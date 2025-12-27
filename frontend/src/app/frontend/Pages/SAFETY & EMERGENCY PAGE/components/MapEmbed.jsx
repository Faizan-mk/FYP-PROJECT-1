import React, { useMemo } from "react";

export default function MapEmbed({ coords, locationEnabled }) {
  const { lat, lon } = coords || {};
  const hasCoords = locationEnabled && typeof lat === "number" && typeof lon === "number";

  const osmSrc = useMemo(() => {
    // OpenStreetMap embed centered on user's location or a default world view
    if (hasCoords) {
      const delta = 0.01; // small bbox around point
      const left = lon - delta;
      const right = lon + delta;
      const top = lat + delta;
      const bottom = lat - delta;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
    }
    return "https://www.openstreetmap.org/export/embed.html?bbox=-10.0%2C35.0%2C40.0%2C60.0&layer=mapnik";
  }, [hasCoords, lat, lon]);

  const nearbyLinks = useMemo(() => {
    if (!hasCoords) return [];
    const base = `https://www.google.com/maps/search/?api=1&query=`;
    return [
      { label: "Hospitals", href: `${base}hospital+near+${lat},${lon}` },
      { label: "Embassies", href: `${base}embassy+near+${lat},${lon}` },
      { label: "Police", href: `${base}police+station+near+${lat},${lon}` },
    ];
  }, [hasCoords, lat, lon]);

  return (
    <div className="space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-xl border shadow-sm">
        <iframe
          title="map"
          src={osmSrc}
          className="h-full w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {hasCoords ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600">Quick search:</span>
          {nearbyLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 font-medium text-indigo-700 ring-1 ring-indigo-200 hover:from-indigo-100 hover:to-purple-100"
            >
              <span>🔎</span>
              <span>{l.label}</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Enable location to find nearby help.</p>
      )}
    </div>
  );
}
