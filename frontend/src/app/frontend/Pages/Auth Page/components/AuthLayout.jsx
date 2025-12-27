export default function AuthLayout({ title, subtitle, illustration, children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-10">
        <div className="h-full w-full rounded-2xl bg-white/10 backdrop-blur-md p-8 flex flex-col justify-between">
          <div>
            <div className="text-3xl">🗺️</div>
            <h2 className="mt-4 text-3xl font-bold">Plan trips with ease</h2>
            <p className="mt-2 text-white/90">Smart itineraries, budgets, weather, and more in one place.</p>
          </div>
          <div className="mt-8 rounded-xl overflow-hidden border border-white/20">
            <img src={illustration || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop'} alt="Travel" className="w-full h-80 object-cover" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl">✈️</div>
              <div className="mt-3 text-2xl font-bold text-gray-900">{title}</div>
              {subtitle && <div className="text-gray-600 text-sm">{subtitle}</div>}
            </div>
            {children}
          </div>
          <div className="mt-6 text-center text-xs text-gray-500">Protected by reCAPTCHA and subject to Terms & Privacy.</div>
        </div>
      </div>
    </div>
  )
}
