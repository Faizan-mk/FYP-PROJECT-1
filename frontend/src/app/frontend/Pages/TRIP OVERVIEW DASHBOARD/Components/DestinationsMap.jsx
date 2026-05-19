import { motion } from 'framer-motion';

export default function DestinationsMap({ points = [] }) {
  // Get the main destination name from points or default to Pakistan
  const destinationQuery = points.length > 0 ? points[0].name : "Pakistan";

  return (
    <div className="rounded-[3rem] border-2 border-slate-100 bg-white p-8 shadow-xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-tight">Map</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{destinationQuery}</p>
        </div>
        <span className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-indigo-100">
          🗺️
        </span>
      </div>

      {/* Real Interactive Map Area */}
      <div className="relative w-full h-80 rounded-[2.5rem] overflow-hidden border-2 border-slate-50 bg-slate-100 shadow-inner group">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(destinationQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          allowFullScreen
        ></iframe>

        {/* Premium Overlay for Visual Polish */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-slate-900/5 rounded-[2.5rem]" />

        {/* Floating City Tag */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-6 right-6 px-6 py-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-100">
              {destinationQuery.charAt(0)}
            </div>
            <span className="text-sm font-black text-slate-900 truncate max-w-[150px]">{destinationQuery}</span>
          </div>
          <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">On route</span>
        </motion.div>
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Waypoints</h3>
        <div className="space-y-4">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group/item"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900 shadow-sm shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white group-hover/item:border-indigo-600 transition-all">
                0{i + 1}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{p.name}</p>
                <p className="text-[10px] font-bold text-slate-400">Waypoint</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
