import React, { useState } from 'react'
import { FaUserCircle, FaGlobeAmericas, FaBell, FaShieldAlt } from 'react-icons/fa'

function SettingPage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1 234 567 890',
  })

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'usd',
    theme: 'light',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
  })

  const [statusMessage, setStatusMessage] = useState('')
  const [statusError, setStatusError] = useState('')

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreferencesChange = (e) => {
    const { name, value } = e.target
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationsChange = (e) => {
    const { name, checked } = e.target
    setNotifications((prev) => ({ ...prev, [name]: checked }))
  }

  const handlePrivacyChange = (e) => {
    const { checked } = e.target
    setPrivacy({ dataSharing: checked })
  }

  const handleLogout = () => {
    window.location.href = '/auth'
  }

  const handleSave = (e) => {
    e.preventDefault()
    console.log('Saved settings (demo):', { profile, preferences, notifications, privacy })
    setStatusError('')
    setStatusMessage('Settings saved (demo mode).')
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_28px_80px_rgba(15,23,42,0.15)] border border-slate-200/80 p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-200/60 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-16 h-52 w-52 rounded-full bg-emerald-200/60 blur-3xl" />

          <div className="relative mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => { window.location.href = '/dashboard' }}
              className="inline-flex items-center w-max rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium px-3 py-1.5 shadow-sm transition-colors mb-1"
            >
              <span className="mr-1">←</span>
              Back to Dashboard
            </button>
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-sky-500 uppercase mb-1">
                Travel Profile
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2 sm:gap-3">
                <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/40">
                  <FaUserCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <span>Settings &amp; Profile</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl">
                Tune your personal details, travel preferences, and privacy controls to get
                smarter, more personalized trip suggestions.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSave}
            className="grid gap-5 sm:gap-6 md:grid-cols-2"
          >
            <section className="group bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-md p-5 sm:p-6 flex flex-col gap-4 transition-transform transition-shadow duration-200 hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium">
                1
              </span>
                <span className="inline-flex items-center gap-2">
                  <FaUserCircle className="h-4 w-4 text-sky-500" />
                  <span>Profile</span>
                </span>
              </h2>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                JD
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium px-3 py-1.5 shadow-sm transition-colors"
              >
                Change Picture
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-slate-600 uppercase tracking-wide"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/60 outline-none transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-600 uppercase tracking-wide"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/60 outline-none transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone"
                  className="text-xs font-medium text-slate-600 uppercase tracking-wide"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/60 outline-none transition"
                />
              </div>
            </div>
          </section>

            <section className="group bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-md p-5 sm:p-6 flex flex-col gap-4 transition-transform transition-shadow duration-200 hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium">
                2
              </span>
                <span className="inline-flex items-center gap-2">
                  <FaGlobeAmericas className="h-4 w-4 text-emerald-500" />
                  <span>Preferences</span>
                </span>
              </h2>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="language"
                  className="text-xs font-medium text-slate-600 uppercase tracking-wide"
                >
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferencesChange}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/60 outline-none transition"
                >
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="currency"
                  className="text-xs font-medium text-slate-600 uppercase tracking-wide"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={preferences.currency}
                  onChange={handlePreferencesChange}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/60 outline-none transition"
                >
                  <option value="usd">USD ($)</option>
                  <option value="pkr">PKR (₨)</option>
                  <option value="eur">EUR (€)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Theme
                </span>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={preferences.theme === 'light'}
                      onChange={handlePreferencesChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Light</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={preferences.theme === 'dark'}
                      onChange={handlePreferencesChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Dark</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={preferences.theme === 'system'}
                      onChange={handlePreferencesChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>System</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

            <section className="group bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-md p-5 sm:p-6 flex flex-col gap-4 transition-transform transition-shadow duration-200 hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium">
                3
              </span>
                <span className="inline-flex items-center gap-2">
                  <FaBell className="h-4 w-4 text-amber-500" />
                  <span>Notification Settings</span>
                </span>
              </h2>
            <div className="space-y-2">
              <label className="flex items-center justify-between gap-3 text-sm text-slate-700">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  name="email"
                  checked={notifications.email}
                  onChange={handleNotificationsChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
              </label>
              <label className="flex items-center justify-between gap-3 text-sm text-slate-700">
                <span>SMS Notifications</span>
                <input
                  type="checkbox"
                  name="sms"
                  checked={notifications.sms}
                  onChange={handleNotificationsChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
              </label>
              <label className="flex items-center justify-between gap-3 text-sm text-slate-700">
                <span>Push Notifications</span>
                <input
                  type="checkbox"
                  name="push"
                  checked={notifications.push}
                  onChange={handleNotificationsChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
              </label>
            </div>
          </section>

            <section className="group bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-md p-5 sm:p-6 flex flex-col justify-between gap-4 transition-transform transition-shadow duration-200 hover:shadow-xl hover:-translate-y-1">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 text-sm font-medium">
                  4
                </span>
                  <span className="inline-flex items-center gap-2">
                    <FaShieldAlt className="h-4 w-4 text-rose-500" />
                    <span>Privacy</span>
                  </span>
                </h2>
              <label className="flex items-center justify-between gap-3 text-sm text-slate-700">
                <span>Allow data sharing to improve recommendations</span>
                <input
                  type="checkbox"
                  name="dataSharing"
                  checked={privacy.dataSharing}
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
              </label>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You can change this anytime. We only use your data to personalize your
                  travel experience and keep your journeys secure.
                </p>
                {statusMessage && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    {statusMessage}
                  </p>
                )}
                {statusError && (
                  <p className="text-xs text-rose-600 font-medium mt-1">
                    {statusError}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3">
                <div className="text-[11px] sm:text-xs text-slate-400">
                  Your settings apply across all your trips, wishlists, and saved places.
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 shadow-lg shadow-sky-500/50 hover:shadow-xl hover:shadow-sky-500/70 hover:from-sky-500 hover:via-blue-500 hover:to-indigo-500 active:scale-[0.97] transition-transform transition-shadow duration-150"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50/70 text-rose-600 text-sm font-medium px-5 py-2.5 shadow-sm hover:bg-rose-100 hover:border-rose-300 hover:text-rose-700 active:scale-[0.97] transition-transform transition-colors duration-150"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingPage
