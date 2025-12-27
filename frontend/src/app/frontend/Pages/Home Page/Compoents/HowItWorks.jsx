const HowItWorks = () => {
  const steps = [
    {
      number: "1️⃣",
      title: "Enter Destination",
      description: "Tell us where you want to go and when"
    },
    {
      number: "2️⃣",
      title: "AI Creates Plan",
      description: "Our AI analyzes and creates your perfect itinerary"
    },
    {
      number: "3️⃣",
      title: "Adjust Budget",
      description: "Fine-tune your budget and preferences"
    },
    {
      number: "4️⃣",
      title: "Download or Share",
      description: "Get your plan and share with travel companions"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your personalized travel plan in just 4 simple steps
          </p>
        </div>

        <div className="relative">
          {/* Timeline line for desktop */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step number and icon */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow-lg ring-2 ring-white/40">
                    {step.number}
                  </div>
                  
                  {/* Connecting line for mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden w-0.5 h-8 bg-gradient-to-b from-blue-400 to-blue-200"></div>
                  )}
                </div>

                {/* Step content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
