import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hunzaImg from '../../../pictures/img 3.jpg';
import skarduImg from '../../../pictures/img 2.jpg';
import swatImg from '../../../pictures/img 4.jpg';
import lahoreImg from '../../../pictures/img 5.jpg';
import karachiImg from '../../../pictures/hotal 3.jpg';
import islamabadImg from '../../../pictures/hotal 1.jpg';

const DESTINATIONS = [
  {
    name: 'Hunza Valley',
    region: 'Gilgit-Baltistan',
    tag: 'Mountains',
    image: hunzaImg,
  },
  {
    name: 'Skardu',
    region: 'Gilgit-Baltistan',
    tag: 'Lakes & peaks',
    image: skarduImg,
  },
  {
    name: 'Swat',
    region: 'Khyber Pakhtunkhwa',
    tag: 'Green valleys',
    image: swatImg,
  },
  {
    name: 'Lahore',
    region: 'Punjab',
    tag: 'Culture & food',
    image: lahoreImg,
  },
  {
    name: 'Karachi',
    region: 'Sindh',
    tag: 'Coast & city',
    image: karachiImg,
  },
  {
    name: 'Islamabad',
    region: 'Capital',
    tag: 'Nature & museums',
    image: islamabadImg,
  },
];

function DestinationCard({ dest }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-2xl aspect-[4/3] ring-1 ring-white/10 shadow-xl bg-slate-800">
      {!imgError ? (
        <img
          src={dest.image}
          alt={dest.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-800 to-slate-800 text-6xl">
          🏔️
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full mb-2">
          {dest.tag}
        </span>
        <h3 className="text-xl font-bold">{dest.name}</h3>
        <p className="text-slate-300 text-sm">{dest.region}</p>
      </div>
    </article>
  );
}

export default function PakistanHighlights() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Explore Pakistan
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            From northern peaks to southern shores
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Discover destinations, compare domestic flights, book hotels and coaches — all in PKR,
            with weather, safety tips, and an AI assistant by your side.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest) => (
            <DestinationCard key={dest.name} dest={dest} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition shadow-lg"
          >
            Sign in to explore all destinations
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
