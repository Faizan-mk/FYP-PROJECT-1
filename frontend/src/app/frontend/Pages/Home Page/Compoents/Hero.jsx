import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img2 from '../../../pictures/img 2.jpg';
import img3 from '../../../pictures/img 3.jpg';
import img4 from '../../../pictures/img 4.jpg';
import img5 from '../../../pictures/img 5.jpg';
import img6 from '../../../pictures/hotal 2.jpg';

const HERO_IMAGES = [img2, img3, img4, img5, img6];

const STATS = [
  { value: '12+', label: 'Travel modules' },
  { value: 'PKR', label: 'Local pricing' },
  { value: 'AI', label: 'Trip assistant' },
  { value: '24/7', label: 'Safety & weather' },
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(() => new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const markFailed = (i) => {
    setFailed((prev) => new Set(prev).add(i));
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {!failed.has(i) ? (
              <img
                src={src}
                alt={`Pakistan travel ${i + 1}`}
                className="w-full h-full object-cover"
                onError={() => markFailed(i)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 via-indigo-900 to-emerald-900" />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
      </div>

      <div className="absolute top-24 left-0 w-14 h-14 opacity-70 animate-hero-fly pointer-events-none z-[1]">
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full drop-shadow-lg">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </div>

      <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-5xl mx-auto py-16">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-4 py-1.5 rounded-full mb-6">
          <span>🇵🇰</span> Smart travel for Pakistan
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
          Plan your Pakistan trip with AI
        </h1>
        <p className="text-lg md:text-2xl mb-10 text-slate-100 max-w-3xl mx-auto leading-relaxed drop-shadow">
          Flights, hotels, transport, budgets, weather, safety alerts, and an AI chatbot — one
          platform built for domestic and northern-area travel in PKR.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Start planning
          </button>
          <button
            type="button"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto bg-white/10 backdrop-blur border border-white/30 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300"
          >
            See all features
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 px-4 py-3"
            >
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              <p className="text-xs md:text-sm text-slate-200 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
