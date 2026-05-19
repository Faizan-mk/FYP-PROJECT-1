import React from 'react';

const AISuggestion = ({ suggestion }) => (
  <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 mt-6 flex items-center gap-4">
    <div className="text-2xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
      💡
    </div>
    <div>
      <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Travel Tip</h4>
      <p className="text-slate-700 font-bold">{suggestion}</p>
    </div>
  </div>
);

export default AISuggestion;
