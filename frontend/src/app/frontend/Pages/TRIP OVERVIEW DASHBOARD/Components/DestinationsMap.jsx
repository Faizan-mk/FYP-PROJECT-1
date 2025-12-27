import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function DestinationsMap({ points = [] }) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-sm p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Destinations Map</h2>
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
          🧭 Map
        </span>
      </div>
      {/* Interactive map using react-leaflet */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200">
        <MapContainer center={points.length ? [points[0].lat, points[0].lng] : [0,0]} zoom={10} scrollWheelZoom={false} className="w-full h-full rounded-xl">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {points.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lng]}>
              <Popup>
                <span className="font-semibold">{p.name}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-700 mb-1">Places</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          {points.map((p, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="inline-grid place-items-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-semibold">{i+1}</span>
              <span className="truncate">{p.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
