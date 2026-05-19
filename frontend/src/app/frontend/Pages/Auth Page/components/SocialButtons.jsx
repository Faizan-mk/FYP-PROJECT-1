import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { authService } from '../../../src/services/api'
import { setAuthToken } from '../../../src/config/api'
import { getGoogleOAuthClientId } from '../../../src/config/googleAuth.js'

const GOOGLE_ICON = 'https://www.svgrepo.com/show/475656/google-color.svg'

const persistSession = (response, navigate) => {
  setAuthToken(response.token)
  if (response.user) {
    localStorage.setItem('user', JSON.stringify(response.user))
    localStorage.setItem('userRole', response.user.role || 'traveler')
    if (response.user.name) localStorage.setItem('userName', response.user.name)
  }
  navigate('/dashboard')
}

function GoogleSignInButton({ onSuccess, onError, busy }) {
  const containerRef = useRef(null)
  const [btnWidth, setBtnWidth] = useState(320)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateWidth = () => {
      const w = el.offsetWidth
      setBtnWidth(Math.min(400, Math.max(240, w)))
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="group relative h-12 w-full cursor-pointer rounded-xl"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-blue-300 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-gray-900 group-hover:shadow-md group-active:translate-y-0 group-active:shadow-sm ${
          busy ? 'opacity-70' : ''
        }`}
      >
        {busy ? (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        ) : (
          <img
            src={GOOGLE_ICON}
            alt=""
            className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
            width={20}
            height={20}
          />
        )}
        <span>{busy ? 'Signing in…' : 'Continue with Google'}</span>
      </div>

      <div
        className={`absolute inset-0 z-10 overflow-hidden opacity-[0.01] [&>div]:!h-full [&>div]:!w-full [&_iframe]:!h-full [&_iframe]:!w-full ${
          busy ? 'pointer-events-none' : ''
        }`}
      >
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          text="continue_with"
          theme="outline"
          shape="rectangular"
          size="large"
          width={btnWidth}
          locale="en"
          useOneTap={false}
          auto_select={false}
          cancel_on_tap_outside
          context="signin"
          use_fedcm_for_button
        />
      </div>
    </div>
  )
}

export default function SocialButtons() {
  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] = useState('')
  const [googleBusy, setGoogleBusy] = useState(false)
  const googleInFlight = useRef(false)

  const googleClientId = getGoogleOAuthClientId()
  const useRealGoogle = Boolean(googleClientId)
  const useLocalDemo = !useRealGoogle && !import.meta.env.PROD

  // Google popup cancel/close does not always fire onError — reset when window refocuses.
  useEffect(() => {
    if (!useRealGoogle) return

    let resetTimer

    const onWindowFocus = () => {
      resetTimer = window.setTimeout(() => {
        if (!googleInFlight.current) {
          setGoogleBusy(false)
        }
      }, 400)
    }

    window.addEventListener('focus', onWindowFocus)
    return () => {
      window.removeEventListener('focus', onWindowFocus)
      clearTimeout(resetTimer)
    }
  }, [useRealGoogle])

  const resetGoogleState = () => {
    setGoogleBusy(false)
    googleInFlight.current = false
  }

  const runGoogleFlow = async (fn) => {
    if (googleInFlight.current) return
    googleInFlight.current = true
    setErrorMsg('')
    setGoogleBusy(true)
    try {
      const response = await fn()
      persistSession(response, navigate)
    } catch (error) {
      setErrorMsg(
        error.message ||
          'Sign-in failed. Make sure the backend is running (port 5000) and MySQL is up.'
      )
    } finally {
      setGoogleBusy(false)
      googleInFlight.current = false
    }
  }

  const onGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential
    if (!idToken) {
      resetGoogleState()
      setErrorMsg('Google did not return a credential. Please try again.')
      return
    }
    await runGoogleFlow(() => authService.loginWithGoogle(idToken))
  }

  const onGoogleError = () => {
    resetGoogleState()
  }

  const onLocalDemoClick = () => {
    runGoogleFlow(() => authService.loginWithGoogleDemo())
  }

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {useRealGoogle ? (
          <GoogleSignInButton
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            busy={googleBusy}
          />
        ) : useLocalDemo ? (
          <button
            type="button"
            disabled={googleBusy}
            onClick={onLocalDemoClick}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-gray-900 hover:shadow-md active:translate-y-0 active:shadow-sm disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
          >
            <img src={GOOGLE_ICON} alt="" className="h-5 w-5 shrink-0" width={20} height={20} />
            {googleBusy ? 'Signing in…' : 'Continue with Google'}
          </button>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs text-gray-600">
            Google sign-in is not configured for this production build.
          </p>
        )}

        <button
          type="button"
          disabled
          title="Facebook sign-in is not configured yet"
          className="flex h-12 cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 text-sm font-semibold text-gray-400"
        >
          <img
            alt=""
            className="h-5 w-5 opacity-50"
            src="https://www.svgrepo.com/show/475647/facebook-color.svg"
          />
          Facebook (coming soon)
        </button>
      </div>
    </div>
  )
}
