import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaLock,
  FaBell,
  FaPlane,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaCamera,
} from 'react-icons/fa';
import { userService } from '../../src/services/api';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import SettingToggle from './components/SettingToggle';
import { PAKISTAN_CITIES } from '../../utils/tripCostCalculator';

const PREFS_KEY = 'travelPreferences';
const ALERTS_KEY = 'travelAlertsEnabled';

const TABS = [
  { id: 'profile', label: 'Profile', icon: <FaUser /> },
  { id: 'security', label: 'Security', icon: <FaLock /> },
  { id: 'travel', label: 'Travel', icon: <FaPlane /> },
  { id: 'notifications', label: 'Alerts', icon: <FaBell /> },
];

const DEFAULT_PREFS = {
  currency: 'PKR',
  language: 'en',
  homeCity: 'Islamabad',
  budgetAlerts: true,
  weatherAlerts: true,
  flightAlerts: true,
  safetyAlerts: true,
};

function loadPrefs() {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function parseUser(res) {
  const body = res?.data ?? res;
  return body?.data ?? body?.user ?? body;
}

function StatusToast({ message, onDismiss }) {
  if (!message.text) return null;
  const ok = message.type === 'success';
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`fixed top-6 right-6 z-50 max-w-sm p-4 rounded-2xl flex items-center gap-3 shadow-2xl ${
        ok ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
      }`}
    >
      {ok ? <FaCheckCircle /> : <FaExclamationCircle />}
      <span className="text-xs font-black uppercase tracking-wide flex-1">{message.text}</span>
      <button type="button" onClick={onDismiss} className="text-white/80 hover:text-white text-lg leading-none">
        ×
      </button>
    </motion.div>
  );
}

export default function SettingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [memberSince, setMemberSince] = useState('');
  const [role, setRole] = useState('traveler');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profilePicture: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [prefs, setPrefs] = useState(loadPrefs);
  const [alertsEnabled, setAlertsEnabled] = useState(() => {
    const v = localStorage.getItem(ALERTS_KEY);
    return v === null ? true : v === 'true';
  });

  const showStatus = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4500);
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getMe();
      const user = parseUser(res);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
      });
      setIsGoogleAccount(Boolean(user.googleId));
      setRole(user.role || localStorage.getItem('userRole') || 'traveler');
      if (user.createdAt) {
        setMemberSince(
          new Date(user.createdAt).toLocaleDateString('en-PK', {
            month: 'long',
            year: 'numeric',
          })
        );
      }
    } catch {
      showStatus('error', 'Could not load your profile.');
    } finally {
      setLoading(false);
    }
  }, [showStatus]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await userService.updateProfile(formData);
      const updated = parseUser(res);
      if (updated?.name) {
        localStorage.setItem('userName', updated.name);
        window.dispatchEvent(new Event('storage'));
      }
      showStatus('success', 'Profile saved.');
    } catch (err) {
      showStatus('error', err.response?.data?.message || err.message || 'Profile update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      return showStatus('error', 'Password must be at least 6 characters.');
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showStatus('error', 'New passwords do not match.');
    }
    try {
      setSaving(true);
      await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showStatus('success', 'Password updated.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Password update failed.');
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    localStorage.setItem(ALERTS_KEY, String(alertsEnabled));
    showStatus('success', 'Travel preferences saved.');
  };

  const handleLogout = () => {
    ['authToken', 'user', 'userName', 'userRole', 'notificationsCount'].forEach((k) =>
      localStorage.removeItem(k)
    );
    navigate('/auth');
  };

  const inputClass =
    'w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-400';
  const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1';

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4"
      >
        <motion.div
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-slate-500 font-bold text-sm">Loading account settings…</p>
      </motion.div>
    );
  }

  const initials = (formData.name || 'T').charAt(0).toUpperCase();
  const roleLabel = role === 'admin' ? 'Administrator' : 'Traveler';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pb-20"
    >
      <AnimatePresence>
        {message.text && (
          <StatusToast message={message} onDismiss={() => setMessage({ type: '', text: '' })} />
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white">
        <motion.div
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BackToDashboardButton />
          <motion.div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/30 border-2 border-white/20 flex items-center justify-center text-3xl font-black overflow-hidden">
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-black uppercase tracking-[0.25em]">Account</p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                  {formData.name || 'Traveler'}
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-1">{formData.email}</p>
                <motion.div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 border border-white/20">
                    {roleLabel}
                  </span>
                  {memberSince && (
                    <span className="text-[10px] font-bold text-indigo-200 px-3 py-1">
                      Member since {memberSince}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex text-black items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-sm font-black hover:bg-rose-500/20 hover:border-rose-400/40 transition-all"
            >
              <FaSignOutAlt />
              Sign out
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-black shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm opacity-80">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-white rounded-3xl ring-1 ring-slate-200 shadow-sm p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-black text-slate-900">Profile details</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    Update how you appear across PakTrip Planner.
                  </p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <motion.div className="space-y-2">
                    <label className={labelClass}>Profile photo URL</label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={formData.profilePicture}
                        onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                        className={inputClass}
                        placeholder="https://…"
                      />
                      <motion.div className="w-14 h-14 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FaCamera />
                      </motion.div>
                    </div>
                  </motion.div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={labelClass}>Full name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputClass}
                        placeholder="Your name"
                      />
                    </div>
                    <motion.div className="space-y-2">
                      <label className={labelClass}>Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className={`${inputClass} opacity-60 cursor-not-allowed`}
                      />
                    </motion.div>
                    <div className="space-y-2">
                      <label className={labelClass}>Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={inputClass}
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Bio</label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className={inputClass}
                      placeholder="Your travel style, favourite regions in Pakistan…"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3.5 rounded-2xl bg-indigo-600 text-black font-black text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
                  >
                    {saving ? 'Saving…' : 'Save profile'}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-black text-slate-900">Password &amp; security</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    Keep your bookings and trip data secure.
                  </p>
                </div>

                {isGoogleAccount ? (
                  <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-6">
                    <p className="text-sm font-bold text-indigo-900">
                      You signed in with Google. Password changes are managed in your Google account.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-6">
                    {[
                      ['currentPassword', 'Current password'],
                      ['newPassword', 'New password'],
                      ['confirmPassword', 'Confirm new password'],
                    ].map(([key, label]) => (
                      <div key={key} className="space-y-2">
                        <label className={labelClass}>{label}</label>
                        <input
                          type="password"
                          value={passwordData[key]}
                          onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                          className={inputClass}
                          required
                          minLength={key === 'newPassword' ? 6 : undefined}
                        />
                      </div>
                    ))}
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3.5 rounded-2xl bg-slate-900 text-black font-black text-sm hover:bg-indigo-600 disabled:opacity-50 transition-all"
                    >
                      {saving ? 'Updating…' : 'Update password'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {activeTab === 'travel' && (
              <motion.div
                key="travel"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-black text-slate-900">Travel preferences</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    Defaults for budget planner, cost estimator, and trip tools (saved on this device).
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className={labelClass}>Home city</label>
                    <select
                      value={prefs.homeCity}
                      onChange={(e) => setPrefs({ ...prefs, homeCity: e.target.value })}
                      className={inputClass}
                    >
                      {PAKISTAN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Currency</label>
                    <select
                      value={prefs.currency}
                      onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
                      className={inputClass}
                    >
                      <option value="PKR">PKR — Pakistani Rupee (₨)</option>
                      <option value="USD">USD — US Dollar ($)</option>
                    </select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className={labelClass}>Language</label>
                    <select
                      value={prefs.language}
                      onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                      className={inputClass}
                    >
                      <option value="en">English</option>
                      <option value="ur">Urdu</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={savePreferences}
                  className="px-8 py-3.5 rounded-2xl bg-indigo-600 text-black font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  Save travel preferences
                </button>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-black text-slate-900">Alerts &amp; notifications</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    Control which updates you see in your notification inbox.
                  </p>
                </div>

                <div className="space-y-3 max-w-lg bg-amber-100 ">
                  < SettingToggle
                    label="Travel alerts"
                    hint="Show your notification inbox on the alerts page"
                    enabled={alertsEnabled}
                    onChange={setAlertsEnabled}
                    icon=" 🔔"
                  />
                  <SettingToggle
                    label="Budget alerts"
                    hint="Spending and budget threshold warnings"
                    enabled={prefs.budgetAlerts}
                    onChange={(v) => setPrefs({ ...prefs, budgetAlerts: v })}
                    icon="💰"
                  />
                  <SettingToggle
                    label="Weather alerts"
                    hint="Forecasts for destinations on your trip"
                    enabled={prefs.weatherAlerts}
                    onChange={(v) => setPrefs({ ...prefs, weatherAlerts: v })}
                    icon="🌤️"
                  />
                  <SettingToggle
                    label="Flight updates"
                    hint="Booking confirmations and schedule changes"
                    enabled={prefs.flightAlerts}
                    onChange={(v) => setPrefs({ ...prefs, flightAlerts: v })}
                    icon="✈️"
                  />
                  <SettingToggle
                    label="Safety alerts"
                    hint="Emergency tips and regional safety notices"
                    enabled={prefs.safetyAlerts}
                    onChange={(v) => setPrefs({ ...prefs, safetyAlerts: v })}
                    icon="🛡️"
                  />
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      savePreferences();
                    }}
                    className="px-8 py-3.5 rounded-2xl bg-indigo-600 text-black font-black text-sm hover:bg-indigo-700 transition-all"
                  >
                    Save alert settings
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/notifications')}
                    className="px-8 py-3.5 rounded-2xl bg-white text-indigo-700 font-black text-sm ring-1 ring-indigo-200 hover:bg-indigo-50 transition-all"
                  >
                    Open notifications →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick links */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'My bookings', path: '/my-bookings', icon: '📋' },
            { label: 'Budget planner', path: '/budget-planner', icon: '📊' },
            { label: 'Notifications', path: '/notifications', icon: '🔔' },
          ].map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white ring-1 ring-slate-200 text-left hover:ring-indigo-200 hover:bg-indigo-50/30 transition-all group"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-sm font-black text-slate-800 group-hover:text-indigo-700">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
