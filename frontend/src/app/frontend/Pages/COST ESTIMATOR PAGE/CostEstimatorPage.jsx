import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PieChart from "./Components/PieChart";
import BudgetMeter from "./Components/BudgetMeter";
import CostCard from "./Components/CostCard";
import BackToDashboardButton from '../../components/BackToDashboardButton';

const STORAGE_KEY = 'travelCostEstimatorData';

const getInitialState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {
    flights: 0,
    hotels: 0,
    food: 0,
    transport: 0,
    activities: 0,
    budget: 0,
  };
};

export default function CostEstimatorPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(getInitialState());
  const [estimates, setEstimates] = useState(draft);

  // Save to localStorage whenever draft changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const total = useMemo(
    () => estimates.flights + estimates.hotels + estimates.food + estimates.transport + estimates.activities,
    [estimates]
  );

  const costCards = [
    { key: "flights", label: "Flights", color: "#6366F1", icon: "✈️" },
    { key: "hotels", label: "Hotels", color: "#10B981", icon: "🏨" },
    { key: "food", label: "Food", color: "#F59E0B", icon: "🍽️" },
    { key: "transport", label: "Transport", color: "#3B82F6", icon: "🚗" },
    { key: "activities", label: "Activities", color: "#EF4444", icon: "🎡" },
  ];

  const chartData = useMemo(
    () => costCards
      .map(c => ({ label: c.label, value: Number(estimates[c.key] || 0), color: c.color }))
      .filter(d => d.value > 0),
    [estimates]
  );

  const handleChange = (key, val) => {
    const num = Number(String(val).replace(/[^0-9.]/g, "")) || 0;
    setDraft(prev => ({ ...prev, [key]: num }));
  };

  const recalc = () => setEstimates(draft);

  const clearForm = () => {
    const resetState = {
      flights: 0,
      hotels: 0,
      food: 0,
      transport: 0,
      activities: 0,
      budget: 0,
    };
    setDraft(resetState);
    setEstimates(resetState);
    localStorage.removeItem(STORAGE_KEY);
  };


  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <BackToDashboardButton />
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-2xl font-extrabold tracking-tight">Cost Estimator</h1>
            <div className="rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 px-5 py-2 text-indigo-800 shadow-inner">
              💰 Total Estimated Cost: <span className="font-semibold">{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2 shadow-sm">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <PieChart data={chartData} />
            <div className="w-full space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {costCards.map(c => (
                  <div key={c.key} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="flex items-center gap-1">{c.icon}<span>{c.label}</span></span>
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={draft[c.key] || ""}
                      onChange={e => handleChange(c.key, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={draft.budget || ""}
                    onChange={e => handleChange("budget", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={clearForm}
                    className="w-1/2 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-800 shadow hover:shadow-md hover:bg-gray-300 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Clear
                  </button>
                  <button
                    onClick={recalc}
                    className="w-20% rounded-lg bg-gradient-to-r from-indigo-300 to-indigo-600 px-4 py-2 font-semibold text-black shadow hover:shadow-md hover:from-indigo-400 hover:to-indigo-700 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Recalculate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            {costCards.map(c => (
              <CostCard key={c.key} label={c.label} value={estimates[c.key] || 0} color={c.color} icon={c.icon} />
            ))}
          </div>
          <div className="my-6 h-px w-full bg-gray-200" />
          <BudgetMeter total={total} budget={Number(estimates.budget || 0)} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Breakdown</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {costCards.map(c => (
            <div key={c.key} className="rounded-lg bg-gray-50 p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500">{c.label}</div>
              <div className="text-lg font-bold">{Number(estimates[c.key] || 0).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-gray-200"
          onClick={() => navigate('/transportation-planner')}
        >
          Back
        </button>
        <button
          className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-indigo-700"
          onClick={() => navigate('/budget-planner')}
        >
          Next
        </button>
      </div>
    </div>
  );
}
