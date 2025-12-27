import { Link } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from './components/AuthLayout'
import SocialButtons from './components/SocialButtons'
import LoginForm from './components/LoginForm'

export default function LoginPage() {
  const [selectedPortal, setSelectedPortal] = useState(null)

  if (!selectedPortal) {
    return (
      <AuthLayout title="Welcome" subtitle="Choose your portal">
        <div className="space-y-4">
          <button
            onClick={() => setSelectedPortal('traveler')}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 font-semibold shadow hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            🧳 Traveler Login
          </button>
          <button
            onClick={() => setSelectedPortal('admin')}
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 font-semibold shadow hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            👨‍💼 Admin Login
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={selectedPortal === 'admin' ? 'Admin Portal' : 'Traveler Portal'}
      subtitle={selectedPortal === 'admin' ? 'Admin login' : 'Login to continue planning'}
    >
      <button
        onClick={() => setSelectedPortal(null)}
        className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
      >
        ← Back to portal selection
      </button>

      <LoginForm isAdmin={selectedPortal === 'admin'} />

      {selectedPortal === 'traveler' && (
        <>
          <div className="my-6 flex items-center gap-3 text-gray-500">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs">Or Continue With</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <SocialButtons />

          <div className="mt-6 text-sm text-gray-700">
            Don't have an account?{' '}
            <Link className="text-blue-600 hover:underline" to="/signup">Create one</Link>
          </div>
        </>
      )}
    </AuthLayout>
  )
}
