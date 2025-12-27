import React from 'react';

const RefreshButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow mx-auto block mt-2"
  >
    Refresh
  </button>
);

export default RefreshButton;
