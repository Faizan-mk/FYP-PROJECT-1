const Features = () => {
  const features = [
    {
      icon: "🧠",
      title: "AI-Based Suggestions",
      description: "Get personalized recommendations based on your preferences, budget, and travel history."
    },
    {
      icon: "💰",
      title: "Smart Budget Estimation",
      description: "AI calculates optimal spending across flights, hotels, and activities to maximize your experience."
    },
    {
      icon: "🏨",
      title: "Hotels, Flights & Activities in One Place",
      description: "Complete travel planning with integrated booking for all your travel needs."
    },
    {
      icon: "🌦️",
      title: "Live Weather & Safety Alerts",
      description: "Real-time weather updates and safety notifications to keep you informed and secure."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose AI Trip Planner?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of travel planning with our intelligent features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group"
            >
              <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
