import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import { authService } from '../../src/services/api'

function validatePassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters long.'
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.'
  if (!/\d/.test(password)) return 'Password must include at least one number.'
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character.'
  return null
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [checking, setChecking] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [accountEmail, setAccountEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) {
      setChecking(false)
      setTokenValid(false)
      setError('Invalid reset link. Please request a new one.')
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const data = await authService.validateResetToken(token)
        if (!cancelled) {
          setTokenValid(true)
          setAccountEmail(data.email || '')
        }
      } catch (err) {
        if (!cancelled) {
          setTokenValid(false)
          setError(err.message || 'This reset link is invalid or has expired.')
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const pwdError = validatePassword(password)
    if (pwdError) {
      setError(pwdError)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const data = await authService.resetPassword(token, password)
      setSuccess(data.message || 'Password reset successfully.')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.message || 'Could not reset password.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <AuthLayout title="Reset password" subtitle="Verifying your link…">
        <p className="text-sm text-gray-600 text-center py-8">Please wait…</p>
      </AuthLayout>
    )
  }

  if (!tokenValid) {
    return (
      <AuthLayout title="Link expired" subtitle="Request a new reset link">
        <div className="rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700 mb-5">
          {error}
        </div>
        <Link
          to="/login?view=forgot"
          className="block w-full text-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 font-semibold shadow hover:from-blue-700 hover:to-indigo-700"
        >
          Request new code
        </Link>
        <Link to="/login" className="mt-4 block text-center text-sm text-blue-600 hover:underline">
          Back to login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Set new password" subtitle={accountEmail ? `For ${accountEmail}` : 'Choose a strong password'}>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-300 px-4 py-3 text-sm text-green-800 font-medium">
          {success} Redirecting to login…
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !!success}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 font-semibold shadow hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  )
}
