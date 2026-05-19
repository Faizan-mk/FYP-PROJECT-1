import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../../src/services/api'

export default function SignupForm() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')

  const getPasswordStrength = (pass) => {
    let strength = 0
    if (pass.length === 0) return { score: 0, label: '', color: 'bg-gray-200' }
    if (pass.length >= 8) strength++
    if (/[A-Z]/.test(pass)) strength++
    if (/[a-z]/.test(pass)) strength++
    if (/\d/.test(pass)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++

    if (strength <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (strength === 3) return { score: 2, label: 'Fair', color: 'bg-yellow-500' }
    if (strength === 4) return { score: 3, label: 'Good', color: 'bg-blue-500' }
    return { score: 4, label: 'Strong', color: 'bg-green-500' }
  }

  const strength = getPasswordStrength(password)

  const validatePassword = (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) return 'Password must be at least 8 characters long.'
    if (!hasUpperCase) return 'Password must include at least one uppercase letter.'
    if (!hasLowerCase) return 'Password must include at least one lowercase letter.'
    if (!hasNumber) return 'Password must include at least one number.'
    if (!hasSpecialChar) return 'Password must include at least one special character.'
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const formData = new FormData(e.target)
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const passwordConfirm = formData.get('passwordConfirm')

    // Client-side validations
    if (password !== passwordConfirm) {
      setError('Passwords do not match')
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setLoading(true)
    try {
      await authService.register({ name, email, password, passwordConfirm })
      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      console.error('Signup failed:', err.message)
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm animate-shake">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <div className="mt-1 relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 9a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 20.25a7.5 7.5 0 1115 0" /></svg>
          </span>
          <input name="name" type="text" placeholder="Faizan Khan" autoComplete="name" required className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="mt-1 relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </span>
          <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="mt-1 relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6.75 10.5h10.5a1.5 1.5 0 011.5 1.5v6.75a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" /></svg>
            </span>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              minLength="8"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 text-left">
              <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 rounded-full transition-all duration-500 ${step <= strength.score ? strength.color : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
              <p className={`text-[10px] mt-1 font-bold uppercase tracking-widest ${strength.color.replace('bg-', 'text-')}`}>
                {strength.label}
              </p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="mt-1 relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6.75 10.5h10.5a1.5 1.5 0 011.5 1.5v6.75a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" /></svg>
            </span>
            <input name="passwordConfirm" type="password" placeholder="Confirm password" minLength="8" autoComplete="new-password" required className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Password requirements:</p>
        <ul className="list-disc pl-4 grid grid-cols-2 gap-x-2">
          <li>Min 8 characters</li>
          <li>One uppercase</li>
          <li>One lowercase</li>
          <li>One number</li>
          <li>One special char</li>
        </ul>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" required className="rounded border-gray-300" />
        I agree to Terms & Privacy
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 font-semibold shadow hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
