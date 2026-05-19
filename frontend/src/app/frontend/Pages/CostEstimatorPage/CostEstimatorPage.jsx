import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { estimationService } from '../../src/services/api';
import {
  PAKISTAN_CITIES,
  HOTEL_TIERS,
  TRANSPORT_MODES,
  FOOD_LEVELS,
  ACTIVITY_OPTIONS,
  calculateTripCost,
  formatPkr,
  STORAGE_KEYS,
} from '../../utils/tripCostCalculator';

const DEFAULT_FORM = {
  origin: 'Islamabad',
  destination: 'Hunza',
  days: 5,
  travelers: 2,
  hotelTierId: 'standard',
  transportModeId: 'bus',
  foodLevelId: 'standard',
  activityIds: ['sightseeing', 'local_tour'],
};

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (raw) return { ...DEFAULT_FORM, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_FORM;
}

export default function CostEstimatorPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(loadDraft);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const estimate = useMemo(() => calculateTripCost(form), [form]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(form));
    localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(estimate));
  }, [form, estimate]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const toggleActivity = (id) => {
    setForm((f) => {
      const ids = f.activityIds.includes(id)
        ? f.activityIds.filter((x) => x !== id)
        : [...f.activityIds, id];
      return { ...f, activityIds: ids };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg('');
    try {
      await estimationService.saveEstimation({
        destination: form.destination,
        duration: form.days,
        travelers: form.travelers,
        transportType: form.transportModeId,
        accommodationType: form.hotelTierId,
        dailyAllowance: FOOD_LEVELS.find((f) => f.id === form.foodLevelId)?.perDay || 0,
        totalEstimate: estimate.total,
        breakdown: estimate.breakdown,
      });
      localStorage.setItem(
        STORAGE_KEYS.BUDGET,
        JSON.stringify({
          totalBudget: estimate.total,
          breakdown: estimate.breakdown,
          destination: form.destination,
          origin: form.origin,
        })
      );
      setSavedMsg('Estimation saved! Open Budget Planner to set your limit.');
    } catch (e) {
      setSavedMsg(e?.message || 'Could not save. Try again after login.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <div className="bg-gradient-to-br from-amber-950 via-orange-950 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
          <BackToDashboardButton />
          <div className="mt-8">
            <p className="text-amber-300 text-xs font-black uppercase tracking-[0.25em]">
              Module 6 · Cost Estimator
            </p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-2">Trip cost calculator</h1>
            
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-4">✈️ Route &amp; travelers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase">Origin</span>
                <select
                  value={form.origin}
                  onChange={(e) => update({ origin: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase">Destination</span>
                <select
                  value={form.destination}
                  onChange={(e) => update({ destination: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase">Days</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={form.days}
                  onChange={(e) => update({ days: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase">Travelers</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={form.travelers}
                  onChange={(e) => update({ travelers: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium"
                />
              </label>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-4">🏨 Hotel type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HOTEL_TIERS.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => update({ hotelTierId: h.id })}
                  className={`text-left rounded-2xl p-4 ring-1 transition-all ${
                    form.hotelTierId === h.id
                      ? 'ring-amber-500 bg-amber-50'
                      : 'ring-slate-200 hover:ring-amber-200'
                  }`}
                >
                  <p className="font-black text-slate-900">{h.label}</p>
                  <p className="text-sm text-slate-500">{formatPkr(h.perNight)} / night</p>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-4">🍽️ Food &amp; 🚌 Transport</h2>
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Food (local restaurant prices)</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {FOOD_LEVELS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => update({ foodLevelId: f.id })}
                  className={`px-4 py-2 rounded-full text-sm font-bold ring-1 ${
                    form.foodLevelId === f.id
                      ? 'bg-amber-600 text-black ring-amber-600'
                      : 'bg-white text-slate-700 ring-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Transportation</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRANSPORT_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => update({ transportModeId: m.id })}
                  className={`text-left rounded-2xl p-4 ring-1 ${
                    form.transportModeId === m.id
                      ? 'ring-amber-500 bg-amber-50'
                      : 'ring-slate-200'
                  }`}
                >
                  <p className="font-bold text-slate-900">{m.label}</p>
                  <p className="text-xs text-slate-500">{formatPkr(m.perDay)} / day / person</p>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-4">🎯 Activities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACTIVITY_OPTIONS.map((a) => (
                <label
                  key={a.id}
                  className={`flex items-center gap-3 rounded-2xl p-4 ring-1 cursor-pointer ${
                    form.activityIds.includes(a.id) ? 'ring-amber-500 bg-amber-50' : 'ring-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.activityIds.includes(a.id)}
                    onChange={() => toggleActivity(a.id)}
                    className="w-5 h-5 rounded border-slate-300 text-amber-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{a.label}</p>
                    <p className="text-xs text-slate-500">{formatPkr(a.cost)} / person</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-lg">
              <p className="text-xs font-black uppercase tracking-widest text-amber-600">Estimated total</p>
              <p className="text-4xl font-black text-slate-900 mt-2">{formatPkr(estimate.total)}</p>
              <p className="text-sm text-slate-500 mt-1">
                {form.travelers} traveler(s) · {form.days} day(s) · {form.origin} → {form.destination}
              </p>

              <ul className="mt-6 space-y-3">
                {estimate.breakdown.map((row) => (
                  <li key={row.key} className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-600">
                      {row.icon} {row.label}
                      <span className="block text-xs text-slate-400">{row.hint}</span>
                    </span>
                    <span className="font-black text-slate-900 shrink-0">{formatPkr(row.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="w-full rounded-2xl bg-amber-600 text-blue-900 py-4 font-black hover:bg-amber-500 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save estimation'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/budget-planner', { state: { estimate } })}
                className="w-full rounded-2xl bg-slate-900 text-black py-4 font-black hover:bg-slate-800"
              >
                Set budget &amp; get suggestions →
              </button>
              {savedMsg && (
                <p className="text-sm text-center font-medium text-emerald-600">{savedMsg}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
