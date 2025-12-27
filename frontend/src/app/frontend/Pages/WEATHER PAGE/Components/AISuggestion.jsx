import React from 'react';

const AISuggestion = ({ suggestion }) => (
  <div className="bg-yellow-100 text-yellow-800 rounded-lg px-4 py-2 flex items-center gap-2 my-2 max-w-md mx-auto">
    <span className="text-xl">💡</span>
    <span className="font-medium">{suggestion}</span>
  </div>
);

export default AISuggestion;
