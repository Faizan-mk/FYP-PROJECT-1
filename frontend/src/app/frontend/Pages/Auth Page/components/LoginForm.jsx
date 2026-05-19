import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../../../src/services/api'
import { setAuthToken } from '../../../src/config/api'

const ADMIN_EMAIL = 'admin@gmail.com'

export default function LoginForm({ isAdmin = false, onForgotPassword }) {
  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    if (isAdmin && email !== ADMIN_EMAIL) {
      setErrorMsg('❌ Access Denied! Only the Admin can login here.')
      return
    }

    if (!isAdmin && email === ADMIN_EMAIL) {
      setErrorMsg('❌ Admin cannot login from Traveler portal. Please use Admin Login.')
      return
    }

    try {
      const response = await authService.login(email, password)
      setAuthToken(response.token)

      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('userRole', response.user.role || 'traveler')
        if (response.user.name) localStorage.setItem('userName', response.user.name)
      }

      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error.message)
      setErrorMsg('❌ Login failed: ' + error.message)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5">
        {errorMsg && (
          <div className="rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700 font-medium">
            {errorMsg}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1 relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6.75 10.5h10.5a1.5 1.5 0 011.5 1.5v6.75a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" /></svg>
            </span>
            <input
              name="password"
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 font-semibold shadow hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Login
        </button>
      </form>

      {!isAdmin && (
        <div className="mt-4 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="rounded border-gray-300" />
            Remember Me
          </label>
          <button
            type="button"
            onClick={() => (onForgotPassword ? onForgotPassword() : navigate('/login?view=forgot'))}
            className="text-sm text-blue-600 hover:underline bg-transparent border-0 p-0 cursor-pointer font-normal"
          >
            Forgot Password?
          </button>
        </div>
      )}
    </>
  )
}

