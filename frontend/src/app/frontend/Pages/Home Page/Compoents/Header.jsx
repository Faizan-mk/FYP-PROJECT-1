import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const featuresRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close desktop features dropdown if clicking outside
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setFeaturesOpen(false);
      }
      // Close mobile menu if clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        // Checking if the click was not on the toggle button itself (to avoid double toggle)
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        if (toggleBtn && !toggleBtn.contains(event.target)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (event) => {
      setIsDarkMode(event.matches);
    };

    applyTheme(mq);
    mq.addEventListener('change', applyTheme);

    return () => mq.removeEventListener('change', applyTheme);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleStartPlanning = () => {
    const authed = typeof window !== 'undefined' && localStorage.getItem('authToken');
    if (authed) navigate('/dashboard'); else navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const headerClass = `sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b ${isDarkMode
    ? isScrolled
      ? 'bg-slate-900/95 border-slate-800 shadow-lg'
      : 'bg-slate-900/90 border-slate-800 shadow-md'
    : isScrolled
      ? 'bg-white/90 border-gray-100 shadow-md'
      : 'bg-white/80 border-gray-100 shadow-sm'
    }`;

  const features = [
    { icon: '🤖', title: 'AI Travel Assistant', desc: 'Chatbot jo trip plan karta hai' },
    { icon: '💰', title: 'Cost Estimator', desc: 'Total travel cost calculate karta hai' },
    { icon: '🏨', title: 'Hotel & Flight Search', desc: 'Flights aur hotels compare karo' },
    { icon: '🚗', title: 'Transport Planner', desc: 'Car, bus, train options suggest karta hai' },
    { icon: '📊', title: 'Budget Planner', desc: 'Budget ke andar plan banata hai' },
    { icon: '☁️', title: 'Weather Info', desc: 'Weather live dekho' },
    { icon: '💸', title: 'Expense Tracker', desc: 'Trip ke kharche dekho' },
    { icon: '🛡️', title: 'Safety Module', desc: 'SOS & emergency info' },
    { icon: '🔔', title: 'Smart Alerts', desc: 'Price drop & budget alert' },
    { icon: '🏠', title: 'Trip Dashboard', desc: 'Sab trip ek jaga par' },
    { icon: '🗺️', title: 'Destination Selection', desc: 'Pasand ki jagah choose karo' },
  ];

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✈️</span>
            <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}> Trip Planner</h1>
          </div>

          {/* Desktop Menu */}
          <nav className={`hidden md:flex items-center gap-2 px-2 py-2 rounded-full shadow ring-1 ${isDarkMode ? 'bg-gray-900/85 ring-white/15' : 'bg-gray-900/80 ring-white/10'
            }`}>
            <a
              href="#"
              style={{ color: '#ffffff' }}
              className="relative inline-block px-3 py-1.5 text-white transition duration-200 ease-out after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-white/90 after:transition-all after:duration-300 hover:opacity-95 hover:drop-shadow font-semibold hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-md"
            >
              Home
            </a>
            <div className="relative" ref={featuresRef}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setFeaturesOpen((v) => !v); }}
                aria-expanded={featuresOpen}
                style={{ color: '#ffffff' }}
                className="relative inline-block px-3 py-1.5 text-white font-semibold transition duration-200 ease-out after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white/80 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-100 hover:scale-[1.02] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              >
                Features
              </a>
              {featuresOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-[360px] max-h-[70vh] overflow-auto bg-white text-left rounded-xl shadow-2xl border border-gray-200 p-2 z-50"
                  onClick={() => setFeaturesOpen(false)}
                >
                  <ul className="divide-y divide-gray-100">
                    {features.map((f) => (
                      <li key={f.title} className="py-1.5">
                        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 text-left">
                          <span className="text-xl leading-6">{f.icon}</span>
                          <span className="text-sm font-semibold text-gray-900">{f.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Link
              to="/about"
              style={{ color: '#ffffff' }}
              className="relative inline-block px-3 py-1.5 text-white font-semibold transition duration-200 ease-out after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white/80 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-100 hover:bg-white/5 hover:scale-[1.02] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              About
            </Link>
            <Link
              to="/contact"
              style={{ color: '#ffffff' }}
              className="relative inline-block px-3 py-1.5 text-white font-semibold transition duration-200 ease-out after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white/80 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-100 hover:bg-white/5 hover:scale-[1.02] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              Contact
            </Link>
            <Link
              to="/login"
              style={{ color: '#ffffff' }}
              className="relative inline-block px-3 py-1.5 text-white font-semibold transition duration-200 ease-out after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white/80 after:transition-all after:duration-300 hover:after:w-full hover:text-gray-100 hover:bg-white/5 hover:scale-[1.02] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              Login
            </Link>
          </nav>

          {/* Desktop CTA Button */}
          <button onClick={handleStartPlanning} className="hidden md:block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Start Planning
          </button>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div ref={mobileMenuRef} className={`md:hidden py-4 border-t backdrop-blur rounded-xl shadow-lg mt-2 ${isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/90 border border-gray-100'
            }`}>
            <nav className="flex flex-col space-y-2">
              <a href="#" className={`${isDarkMode ? 'text-white hover:text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'} transition-colors py-2 px-3 rounded-md`}>Home</a>
              <div>
                <button
                  onClick={() => setMobileFeaturesOpen((v) => !v)}
                  className={`w-full flex items-center justify-between transition-colors py-2 px-3 rounded-md ${isDarkMode ? 'text-white hover:text-gray-200 hover:bg-white/5' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  <span>Features</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform ${mobileFeaturesOpen ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                {mobileFeaturesOpen && (
                  <ul className="mt-1 mb-2 space-y-1 px-3">
                    {features.map((f) => (
                      <li key={f.title}>
                        <div className="flex items-center gap-3 py-2">
                          <span className="text-lg leading-6">{f.icon}</span>
                          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{f.title}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Link to="/about" className={`${isDarkMode ? 'text-white hover:text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'} transition-colors py-2 px-3 rounded-md`}>About</Link>
              <Link to="/contact" className={`${isDarkMode ? 'text-white hover:text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'} transition-colors py-2 px-3 rounded-md`}>Contact</Link>
              <button onClick={handleLoginClick} className={`${isDarkMode ? 'text-white hover:text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'} transition-colors py-2 px-3 rounded-md text-left`}>Login</button>
              <button onClick={handleStartPlanning} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 w-full mt-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Start Planning
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
