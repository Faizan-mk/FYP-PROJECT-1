import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Ready to explore Pakistan?
          </h2>
          <p className="text-lg md:text-xl text-blue-100/95 mb-8 max-w-2xl mx-auto">
            Sign in to book flights, plan budgets, chat with AI, and manage your entire trip from
            one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-white text-indigo-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition shadow-lg hover:scale-[1.02]"
            >
              Get started free
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto border-2 border-white/60 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
