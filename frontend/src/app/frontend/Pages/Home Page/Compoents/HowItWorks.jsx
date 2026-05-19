const STEPS = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up as a traveler to access flights, hotels, transport, and trip tools.',
  },
  {
    number: '02',
    title: 'Pick destination & dates',
    description: 'Choose where in Pakistan you want to go and set your travel window.',
  },
  {
    number: '03',
    title: 'Book & estimate in PKR',
    description: 'Compare flights, hotels, and coaches. Use the cost estimator and budget planner.',
  },
  {
    number: '04',
    title: 'Travel with confidence',
    description: 'Track your trip, check weather, chat with AI, and use safety alerts on the road.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Simple workflow
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">How it works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Go from idea to booked trip in four steps — the same flow as your dashboard and Plan My
            Trip module.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-400 to-blue-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black mb-6 shadow-lg shadow-blue-500/25 rotate-3 group-hover:rotate-0 transition-transform">
                  {step.number}
                </div>
                {index < STEPS.length - 1 && (
                  <div className="lg:hidden mx-auto w-0.5 h-8 bg-gradient-to-b from-indigo-300 to-transparent my-2" />
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
