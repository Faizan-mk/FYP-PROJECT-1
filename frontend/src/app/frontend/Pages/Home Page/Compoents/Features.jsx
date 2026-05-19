import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Travel Assistant',
    description: 'Ask about routes, packing, permits, and trip ideas in English or Urdu-style chat.',
  },
  {
    icon: '✈️',
    title: 'Domestic Flights',
    description: 'Search PIA, Air Sial, Serene Air and more — compare fares in PKR.',
  },
  {
    icon: '🏨',
    title: 'Hotels',
    description: 'Browse hotels across cities with live PKR pricing and amenities.',
    path: '/traveler/hotels',
  },
  {
    icon: '🚌',
    title: 'Transport',
    description: 'Book buses and coaches between major Pakistani cities.',
    path: '/transport',
  },
  {
    icon: '🗺️',
    title: 'Destinations',
    description: 'Explore Hunza, Swat, Lahore, Karachi and curated travel guides.',
    path: '/destination',
  },
  {
    icon: '🧳',
    title: 'Tour Packages',
    description: 'Ready-made packages from travel agencies with clear inclusions.',
    path: '/packages',
  },
  {
    icon: '💰',
    title: 'Cost Estimator',
    description: 'Estimate flights, hotels, food, transport and activities in one PKR total.',
    path: '/cost-estimator',
  },
  {
    icon: '📊',
    title: 'Budget Planner',
    description: 'Set a budget and get suggestions to stay within your limit.',
    path: '/budget-planner',
  },
  {
    icon: '🧭',
    title: 'Plan My Trip',
    description: 'Step-by-step hub to build your itinerary from start to finish.',
    path: '/plan-my-trip',
  },
  {
    icon: '☁️',
    title: 'Live Weather',
    description: 'Check conditions before you leave — especially for northern areas.',
    path: '/weather',
  },
  {
    icon: '🛡️',
    title: 'Safety & SOS',
    description: 'Emergency contacts, travel tips, and safety info when you need it.',
    path: '/safety-emergency',
  },
  {
    icon: '📑',
    title: 'My Bookings',
    description: 'Flight and transport bookings, trip overview, and past trips in one place.',
    path: '/my-bookings',
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Everything in one app
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Built for Pakistan travel
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From booking to budgeting — every module your FYP project offers, ready after you sign
            in.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURES.map((feature) => (
            <button
              key={feature.title}
              type="button"
              onClick={() => navigate('/login')}
              className="group text-left bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/80 hover:shadow-xl hover:ring-blue-200 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              <span className="inline-block mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Sign in to use →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
