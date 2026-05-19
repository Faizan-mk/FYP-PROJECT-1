import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../../src/services/api'

function validatePassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters long.'
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.'
  if (!/\d/.test(password)) return 'Password must include at least one number.'
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character.'
  return null
}

export default function ForgotPasswordForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const onSendCode = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)

    try {
      const data = await authService.forgotPassword(email.trim())

      if (data.unknownAccount) {
        setSuccess(
          data.message ||
            'If an account exists with that email, we sent a verification code. Check your inbox.'
        )
        return
      }

      if (data.emailSent === false) {
        setError(data.message || 'Could not send verification email. Please try again.')
        return
      }

      setSuccess(
        data.message ||
          'We sent a 6-digit code to your email. Open your inbox and enter the code below.'
      )
      setStep('otp')
    } catch (err) {
      const msg =
        err?.name === 'TimeoutError' || String(err?.message || '').includes('timed out')
          ? 'Request took too long. Please try again — or restart the backend server.'
          : err.message || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const onVerifyOtp = async (e) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)

    try {
      const data = await authService.verifyResetOtp(email.trim(), otp.trim())
      setResetToken(data.resetToken || '')
      setSuccess(data.message || 'Code verified.')
      setStep('password')
    } catch (err) {
      setError(err.message || 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  const onResetPassword = async (e) => {
    e.preventDefault()
    clearMessages()

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
      const data = await authService.resetPassword(resetToken, password)
      setSuccess(data.message || 'Password reset successfully.')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.message || 'Could not reset password.')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    clearMessages()
    setOtp('')
    setLoading(true)
    try {
      const data = await authService.forgotPassword(email.trim())
      if (data.emailSent === false && !data.unknownAccount) {
        setError(data.message || 'Could not resend code.')
        return
      }
      setSuccess(
        data.message ||
          'A new code has been sent to your email. Check your inbox and spam folder.'
      )
    } catch (err) {
      setError(err.message || 'Could not resend code.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'email') {
    return (
      <>
        <p className="mb-5 text-sm text-gray-600">
          Enter the email you used to sign up. We will send a 6-digit verification code (valid for 15 minutes).
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-300 px-4 py-3 text-sm text-green-800 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={onSendCode} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 font-semibold shadow hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Sending...' : 'Send verification code'}
          </button>
        </form>
      </>
    )
  }

  if (step === 'otp') {
    return (
      <>
        <p className="mb-2 text-sm text-gray-600">
          We sent a code to <span className="font-medium text-gray-900">{email}</span>. Check your email
          (subject starts with &quot;OTP&quot;) and enter the 6-digit code below.
        </p>
        <button
          type="button"
          onClick={() => {
            setStep('email')
            clearMessages()
            setOtp('')
          }}
          className="mb-4 text-xs text-blue-600 hover:underline"
        >
          Change email
        </button>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-300 px-4 py-3 text-sm text-green-800 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={onVerifyOtp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Verification code</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              required
              autoComplete="one-time-code"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-center text-2xl font-semibold tracking-[0.4em] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 font-semibold shadow hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Verifying...' : 'Verify code'}
          </button>

          <button
            type="button"
            onClick={resendCode}
            disabled={loading}
            className="w-full text-sm text-blue-600 hover:underline disabled:opacity-60"
          >
            Resend code
          </button>
        </form>
      </>
    )
  }

  return (
    <>
      <p className="mb-5 text-sm text-gray-600">Choose a new password for {email}.</p>

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

      <form onSubmit={onResetPassword} className="space-y-5">
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
          {loading ? 'Saving…' : 'Reset password'}
        </button>
      </form>
    </>
  )
}
