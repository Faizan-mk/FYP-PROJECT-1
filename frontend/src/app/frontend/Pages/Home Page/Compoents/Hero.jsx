import { useEffect, useState } from 'react';
import img1 from '../../../pictures/img1.jpg';
import img2 from '../../../pictures/img 2.jpg';
import img3 from '../../../pictures/img 3.jpg';
import img4 from '../../../pictures/img 4.jpg';
import img5 from '../../../pictures/img 5.jpg';

const Hero = () => {
  const images = [img1, img2, img3, img4, img5];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 rounded-xl md:rounded-2xl overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Hero background ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-5000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        {/* Uniform dark scrim for overall contrast */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Bottom-to-top gradient to boost legibility near content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
      </div>

      {/* Animated Plane */}
      <div className="absolute top-20 left-0 w-16 h-16 opacity-80 animate-fly">
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-4xl mx-auto bg-black/20 md:bg-transparent backdrop-blur-[2px] md:backdrop-blur-0 rounded-xl md:rounded-none py-6 md:py-0">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          Plan Your Next Adventure with AI
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
          Smart, fast, and personalized travel planning — powered by Artificial Intelligence.
        </p>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600/20"
          onClick={() => {
            const authed = typeof window !== 'undefined' && localStorage.getItem('authToken');
            if (authed) window.location.href = '/dashboard';
            else window.location.href = '/login';
          }}
        >
          Start Your Trip
        </button>
      </div>

      {/* Custom CSS for plane animation */}
      <style jsx>{`
        @keyframes fly {
          0% {
            transform: translateX(-100px) translateY(0px);
          }
          25% {
            transform: translateX(25vw) translateY(-20px);
          }
          50% {
            transform: translateX(50vw) translateY(10px);
          }
          75% {
            transform: translateX(75vw) translateY(-15px);
          }
          100% {
            transform: translateX(100vw) translateY(0px);
          }
        }
        
        .animate-fly {
          animation: fly 8s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
