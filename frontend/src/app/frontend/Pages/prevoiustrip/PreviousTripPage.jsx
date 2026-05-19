import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BackToDashboardButton from '../../components/BackToDashboardButton';

const trips = [
  {
    id: 1,
    destination: "Hunza Valley, Pakistan",
    date: "June 2024",
    status: "Completed",
    description: "Road trip to Hunza with breathtaking views of Rakaposhi and Attabad Lake. A journey through the Karakoram highway.",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800",
    stats: { days: 7, miles: "450km", memories: 124 }
  },
  {
    id: 2,
    destination: "Murree & Patriata",
    date: "Dec 2023",
    status: "Completed",
    description: "Weekend getaway with chairlift rides and pine forest walks in the snow-covered hills of Punjab.",
    image: "https://images.unsplash.com/photo-1629197576571-08f310f845a7?q=80&w=800",
    stats: { days: 3, miles: "120km", memories: 56 }
  },
  {
    id: 3,
    destination: "Historic Lahore",
    date: "March 2023",
    status: "Completed",
    description: "Visited Badshahi Mosque, Lahore Fort and explored the vibrant street food culture of the Walled City.",
    image: "https://images.unsplash.com/photo-1549488494-1ca4082269a3?q=80&w=800",
    stats: { days: 4, miles: "85km", memories: 89 }
  },
  {
    id: 4,
    destination: "Swat Valley",
    date: "Sept 2022",
    status: "Completed",
    description: "Explored the 'Switzerland of the East' with lush green meadows and crystal clear Swat river views.",
    image: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?q=80&w=800",
    stats: { days: 6, miles: "310km", memories: 210 }
  }
];

const PreviousTripPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden"
        >
          <div className="relative z-10 flex-1">
            <BackToDashboardButton />
            <h1 className="text-5xl font-black text-slate-900 mt-6 tracking-tighter">
              Travel <span className="text-indigo-600">Archives.</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-2 italic">Revisit your footprints across the globe.</p>
          </div>

          <div className="flex gap-4 relative z-10">
            <div className="bg-indigo-50 px-6 py-4 rounded-3xl border border-indigo-100 text-center">
              <p className="text-2xl font-black text-indigo-600 leading-none">{trips.length}</p>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Total Trips</p>
            </div>
            <div className="bg-amber-50 px-6 py-4 rounded-3xl border border-amber-100 text-center">
              <p className="text-2xl font-black text-amber-600 leading-none">479</p>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mt-1">Memories</p>
            </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </motion.div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence>
            {trips.map((trip, idx) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[3rem] overflow-hidden shadow-xl border-2 border-slate-100 hover:border-indigo-100 transition-all group flex flex-col h-full"
              >
                {/* Image Holder */}
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent group-hover:opacity-80 transition-opacity" />

                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="px-4 py-2 bg-white/95 backdrop-blur shadow-xl rounded-2xl text-[10px] font-black text-slate-900 border border-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      {trip.status}
                    </span>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-1">{trip.date}</p>
                    <h3 className="text-3xl font-black tracking-tight leading-tight group-hover:translate-x-2 transition-transform duration-500">{trip.destination}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex-1 flex flex-col">
                  <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                    "{trip.description}"
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 text-center">
                      <p className="text-lg font-black text-slate-900">{trip.stats.days}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Days</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 text-center">
                      <p className="text-lg font-black text-slate-900">{trip.stats.miles}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Walked</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 text-center">
                      <p className="text-lg font-black text-slate-900">{trip.stats.memories}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Photos</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-100 transition-all`}>
                          <img src={`https://i.pravatar.cc/100?u=${trip.id}${i}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all"
                    >
                      View Album
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state or Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 py-20 text-center border-t-2 border-dashed border-slate-200"
        >
          <div className="text-6xl mb-6 opacity-20">📸</div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">More adventures await.</h2>
          <p className="text-slate-400 font-medium max-w-md mx-auto italic">Keep exploring, keep making memories. Your future journeys are waiting to be written.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PreviousTripPage;
