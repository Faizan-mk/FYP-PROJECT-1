import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { estimationService } from '../../src/services/api';
import {
  calculateTripCost,
  getBudgetSuggestions,
  formatPkr,
  STORAGE_KEYS,
  HOTEL_TIERS,
  FOOD_LEVELS,
} from '../../utils/tripCostCalculator';

function loadEstimateFromStorage(locationState) {
  if (locationState?.estimate) return locationState.estimate;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULT);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  try {
    const draft = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (draft) return calculateTripCost(JSON.parse(draft));
  } catch {
    /* ignore */
  }
  return calculateTripCost({});
}

export default function BudgetPlannerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [estimate, setEstimate] = useState(() => loadEstimateFromStorage(location.state));
  const [maxBudget, setMaxBudget] = useState(() => {
    try {
      const b = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGET) || '{}');
      return b.maxBudget || b.totalBudget || estimate?.total || 100000;
    } catch {
      return estimate?.total || 100000;
    }
  });
  const [appliedIds, setAppliedIds] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await estimationService.getEstimations();
        setSavedPlans(Array.isArray(list) ? list : []);
      } catch {
        setSavedPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    })();
  }, []);

  const analysis = useMemo(
    () => getBudgetSuggestions(estimate, maxBudget),
    [estimate, maxBudget]
  );

  const percentUsed = maxBudget > 0 ? Math.min(100, Math.round((estimate.total / maxBudget) * 100)) : 0;
  const isOver = estimate.total > maxBudget;

  const applySuggestion = (suggestion) => {
    if (appliedIds.includes(suggestion.id)) return;
    let nextForm = {
      origin: estimate.origin,
      destination: estimate.destination,
      days: estimate.days,
      travelers: estimate.travelers,
      hotelTierId: estimate.hotelTierId,
      transportModeId: estimate.transportModeId,
      foodLevelId: estimate.foodLevelId,
      activityIds: [...(estimate.activityIds || [])],
    };

    if (suggestion.id === 'hotel') {
      const idx = HOTEL_TIERS.findIndex((h) => h.id === nextForm.hotelTierId);
      if (idx > 0) nextForm.hotelTierId = HOTEL_TIERS[idx - 1].id;
    } else if (suggestion.id === 'transport') {
      nextForm.transportModeId = 'bus';
    } else if (suggestion.id === 'food') {
      const idx = FOOD_LEVELS.findIndex((f) => f.id === nextForm.foodLevelId);
      if (idx > 0) nextForm.foodLevelId = FOOD_LEVELS[idx - 1].id;
    } else if (suggestion.id === 'activities') {
      nextForm.activityIds = nextForm.activityIds.filter(
        (id) => !['adventure', 'trekking'].includes(id)
      );
    } else if (suggestion.id === 'activities_min') {
      nextForm.activityIds = nextForm.activityIds.slice(0, 1);
    } else if (suggestion.id === 'days') {
      nextForm.days = Math.max(1, nextForm.days - 1);
    }

    const next = calculateTripCost(nextForm);
    setEstimate(next);
    setAppliedIds((ids) => [...ids, suggestion.id]);
    localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(next));
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(nextForm));
  };

  const saveBudgetPlan = () => {
    const payload = {
      maxBudget: Number(maxBudget),
      estimatedCost: estimate.total,
      breakdown: estimate.breakdown,
      destination: estimate.destination,
      suggestions: analysis.suggestions,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(payload));
    navigate('/trip-overview', { state: { budgetData: payload } });
  };

  const loadSavedPlan = (plan) => {
    const total = plan.totalEstimate || 0;
    setMaxBudget(total);
    if (plan.breakdown) {
      setEstimate({
        ...estimate,
        destination: plan.destination,
        days: plan.duration,
        travelers: plan.travelers,
        total,
        breakdown: Array.isArray(plan.breakdown) ? plan.breakdown : estimate.breakdown,
        hotelTierId: plan.accommodationType,
        transportModeId: plan.transportType,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <div className="bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
          <BackToDashboardButton />
          <div className="mt-8">
            <p className="text-violet-300 text-xs font-black uppercase tracking-[0.25em]">
              Module 7 · Budget Planner
            </p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-2">Stay within budget</h1>
            <p className="text-slate-400 font-medium mt-3 max-w-2xl">
              Set your maximum trip budget. We compare it to your cost estimate and suggest cheaper hotels,
              food, transport, or activities.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-4">Your maximum budget</h2>
            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase">Budget limit (PKR)</span>
              <input
                type="number"
                min={5000}
                step={1000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-5 py-4 text-2xl font-black"
              />
            </label>
            <div className="mt-6">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-600">Estimated cost</span>
                <span className={isOver ? 'text-rose-600' : 'text-emerald-600'}>
                  {formatPkr(estimate.total)}
                </span>
              </div>
              <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOver ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {isOver
                  ? `Over budget by ${formatPkr(analysis.overBy)}`
                  : `You have ${formatPkr(maxBudget - estimate.total)} remaining`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 ring-1 ring-slate-100">
            <h3 className="font-black text-slate-900 mb-3">Cost breakdown</h3>
            <ul className="space-y-2 text-sm">
              {estimate.breakdown?.map((row) => (
                <li key={row.key} className="flex justify-between">
                  <span>{row.icon} {row.label}</span>
                  <span className="font-bold">{formatPkr(row.amount)}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => navigate('/cost-estimator')}
              className="mt-4 text-sm font-black text-violet-600 hover:underline"
            >
              ← Edit in Cost Estimator
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!isOver ? (
            <div className="bg-emerald-50 rounded-3xl p-8 ring-1 ring-emerald-200 text-center">
              <p className="text-4xl mb-2">✅</p>
              <p className="text-xl font-black text-emerald-800">Within budget!</p>
              <p className="text-emerald-700 font-medium mt-2">
                Your plan fits under {formatPkr(maxBudget)}.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 ring-1 ring-slate-100 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-2">Suggested changes</h2>
              <p className="text-slate-500 text-sm mb-6">
                Apply suggestions to lower your total. Each change updates your estimate live.
              </p>
              <div className="space-y-3">
                {analysis.suggestions.length === 0 ? (
                  <p className="text-slate-500">Open Cost Estimator first to build an estimate.</p>
                ) : (
                  analysis.suggestions.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 hover:border-violet-200"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{s.title}</p>
                        <p className="text-sm text-emerald-600 font-bold">
                          Save ~{formatPkr(s.save)} → {formatPkr(s.newTotal)}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={appliedIds.includes(s.id)}
                        onClick={() => applySuggestion(s)}
                        className="rounded-xl bg-violet-600 text-white px-4 py-2 text-sm font-black disabled:bg-slate-300"
                      >
                        {appliedIds.includes(s.id) ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {!loadingPlans && savedPlans.length > 0 && (
            <section className="bg-white rounded-3xl p-6 ring-1 ring-slate-100">
              <h2 className="text-lg font-black text-slate-900 mb-4">Saved estimations</h2>
              <div className="space-y-3">
                {savedPlans.slice(0, 5).map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => loadSavedPlan(plan)}
                    className="w-full text-left rounded-2xl p-4 ring-1 ring-slate-100 hover:ring-violet-200"
                  >
                    <p className="font-bold text-slate-900">{plan.destination}</p>
                    <p className="text-sm text-slate-500">
                      {plan.duration} days · {plan.travelers} travelers · {formatPkr(plan.totalEstimate)}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveBudgetPlan}
              className="flex-1 min-w-[200px] rounded-2xl bg-violet-600 text-black py-4 font-black hover:bg-violet-500"
            >
              Save plan &amp; view trip overview
            </button>
            <button
              type="button"
              onClick={() => navigate('/cost-estimator')}
              className="rounded-2xl bg-white text-violet-700 px-6 py-4 font-black ring-1 ring-violet-200"
            >
              Recalculate costs
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
