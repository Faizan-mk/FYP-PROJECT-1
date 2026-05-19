import { useState, useEffect } from 'react';

const TESTIMONIALS = [
  {
    quote:
      'Booked Islamabad to Skardu flights and a hotel in one evening. The PKR cost estimator saved me from overspending.',
    author: 'Ayesha Khan',
    location: 'Islamabad',
    avatar: '👩‍💼',
  },
  {
    quote:
      'The AI chatbot told me about NOC for Gilgit and what to pack. Perfect before my Hunza trip.',
    author: 'Hassan Raza',
    location: 'Lahore',
    avatar: '👨‍💻',
  },
  {
    quote:
      'Bus booking from Karachi to Lahore plus live weather for Swat — exactly what I needed for family travel.',
    author: 'Fatima Ali',
    location: 'Karachi',
    avatar: '👩‍🎓',
  },
];

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Trusted by Pakistani travelers
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Students, families, and explorers using AI Trip Planner for domestic adventures.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {TESTIMONIALS.map((testimonial, index) => (
                <div key={index} className="w-full shrink-0">
                  <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl mx-2 md:mx-4 ring-1 ring-slate-100">
                    <div className="text-center">
                      <div className="text-5xl mb-5">{testimonial.avatar}</div>
                      <blockquote className="text-xl md:text-2xl font-medium text-slate-800 mb-6 leading-relaxed">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      <p className="text-slate-600">
                        <span className="font-semibold text-slate-900">{testimonial.author}</span>
                        <span className="mx-2 text-slate-400">•</span>
                        <span>{testimonial.location}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex justify-center mt-8 gap-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-blue-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
