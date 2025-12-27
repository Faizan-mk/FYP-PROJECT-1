const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 shadow-xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Start your personalized journey today!
          </h2>
          <p className="text-xl md:text-2xl text-blue-100/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust AI to plan their perfect trips
          </p>
          <button
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700/40"
            onClick={() => {
              const authed = typeof window !== 'undefined' && localStorage.getItem('authToken');
              if (authed) window.location.href = '/dashboard';
              else window.location.href = '/login';
            }}
          >
            Plan Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
