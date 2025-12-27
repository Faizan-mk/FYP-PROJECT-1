import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BudgetInput from './components/BudgetInput'
import BudgetSlider from './components/BudgetSlider'
import AITip from './components/AITip'
import BackToDashboardButton from '../../components/BackToDashboardButton'

export default function BudgetPlannerPage() {
  const navigate = useNavigate()

    const STORAGE_KEY = 'travelBudgetPlannerData';

  const getInitialState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          totalBudget: parsed.totalBudget || 0,
          parts: parsed.parts || {
            Flights: 20,
            Hotels: 30,
            Food: 15,
            Activities: 25,
            Transport: 10,
          }
        };
      } catch (e) {
        console.error('Failed to parse saved budget data', e);
      }
    }
    return {
      totalBudget: 0,
      parts: {
        Flights: 20,
        Hotels: 30,
        Food: 15,
        Activities: 25,
        Transport: 10,
      }
    };
  };

  // Initialize state with saved data or defaults
  const [state, setState] = useState(() => {
    // Get initial state from localStorage or use defaults
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved budget data', e);
      }
    }
    // Default values if no saved data
    return {
      totalBudget: 0,
      parts: {
        Flights: 20,
        Hotels: 30,
        Food: 15,
        Activities: 25,
        Transport: 10,
      }
    };
  });

  // Destructure state for easier access
  const { totalBudget, parts } = state;

  // Update state helper function
  const updateState = (updates) => {
    setState(prev => ({
      ...prev,
      ...updates,
      parts: {
        ...prev.parts,
        ...(updates.parts || {})
      }
    }));
  };

  // Update parts
  const setParts = (newParts) => {
    updateState({ parts: newParts });
  };

  // Update total budget
  const setTotalBudget = (value) => {
    updateState({ totalBudget: Number(value) || 0 });
  };

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [state]);

  const sum = useMemo(() => Object.values(parts).reduce((a, b) => a + Number(b || 0), 0), [parts])
  const remaining = useMemo(() => 100 - sum, [sum])

  const handlePartChange = (key, val) => {
    const n = Math.max(0, Math.min(100, Number(val)))
    setParts((p) => ({ ...p, [key]: n }))
  }

  const formatted = (num) => Number(num || 0).toLocaleString()

  const breakdown = useMemo(() => {
    const tb = Number(totalBudget) || 0
    return Object.entries(parts)
      .map(([k, v]) => ({
        key: k,
        percent: Number(v),
        amount: Math.round((Number(v) / 100) * tb),
      }))
      .sort((a, b) => b.percent - a.percent) // Sort by percentage (highest first)
  }, [parts, totalBudget])

  const canSave = sum === 100

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all budget data? This cannot be undone.')) {
      const defaultState = {
        totalBudget: 0,
        parts: {
          Flights: 20,
          Hotels: 30,
          Food: 15,
          Activities: 25,
          Transport: 10,
        }
      };
      setState(defaultState);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSave = () => {
    if (totalBudget <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }
    if (!canSave) {
      alert('Please allocate 100% of your budget before saving');
      return;
    }
    alert('Budget plan saved successfully!');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 p-5 shadow-lg text-white flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <span>🧾</span>
              <span>Budget Planner</span>
            </h1>
            <p className="mt-1 text-sm text-white/90">Set spending limits and adjust your plan.</p>
          </div>
          <BackToDashboardButton />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5">
            <div className="rounded-xl border border-indigo-100/70 bg-white/80 backdrop-blur-sm shadow-sm p-4">
              <BudgetInput value={totalBudget} onChange={setTotalBudget} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Allocation</h2>
                <div className={`text-sm font-medium ${sum === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {sum === 100 ? 'Balanced (100%)' : `Adjust: ${remaining > 0 ? '+' : ''}${remaining}%`}
                </div>
              </div>

              <div className="space-y-4">
                {Object.keys(parts).map((key) => (
                  <BudgetSlider
                    key={key}
                    label={key}
                    value={parts[key]}
                    onChange={(v) => handlePartChange(key, v)}
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="md:col-span-1 space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-medium mb-2">Summary</h3>
              <div className="space-y-2">
                {breakdown
                  .filter(b => b.percent > 0) // Only show categories with percentage > 0
                  .map((b) => (
                    <div key={b.key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{b.key} ({b.percent}%)</span>
                      <span className="font-semibold">{formatted(b.amount)}</span>
                    </div>
                  ))}
                {breakdown.every(b => b.percent === 0) && (
                  <p className="text-sm text-gray-500 text-center py-2">Adjust the sliders to allocate your budget</p>
                )}
              </div>
              {totalBudget > 0 && (
                <>
                  <div className="h-px w-full bg-gray-200 my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Budget</span>
                    <span className="text-base font-bold">{formatted(totalBudget)}</span>
                  </div>
                </>
              )}
            </div>

            <AITip tip="You can save 15% by choosing 3-star hotels." />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={clearForm}
                  className="w-full flex items-center justify-center rounded-xl bg-white border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-indigo-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Clear All
                </button>
                <button
                  onClick={handleSave}
                  disabled={!canSave}
                  className={`w-full flex items-center justify-center rounded-xl border-2 border-transparent px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    canSave 
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700' 
                      : 'cursor-not-allowed bg-gray-300 text-gray-500'
                  }`}
                >
                  Save Budget
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-gray-200"
                  onClick={() => navigate('/cost-estimator')}
                >
                  Back
                </button>
                <button
                  onClick={() => navigate('/trip-overview', { 
                    state: { 
                      budgetData: {
                        totalBudget,
                        breakdown: breakdown.filter(b => b.percent > 0)
                      } 
                    } 
                  })}
                  className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-700 hover:to-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {sum !== 100 && (
              <p className="text-xs text-rose-600">Tip: Make sure your sliders add up to 100% to enable saving.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
