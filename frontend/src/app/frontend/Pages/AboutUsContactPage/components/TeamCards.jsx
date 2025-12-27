// TeamCards.jsx
import React from 'react';

const team = [
  { name: 'Alice Johnson', role: 'Frontend Developer', linkedin: 'https://linkedin.com/in/alicejohnson' },
  { name: 'Bob Smith', role: 'Backend Developer', linkedin: 'https://linkedin.com/in/bobsmith' },
  { name: 'Carol Lee', role: 'UI/UX Designer', linkedin: 'https://linkedin.com/in/carollee' },
];

const TeamCards = () => (
  <section className="bg-white rounded-2xl shadow p-6 mb-6">
    <h3 className="text-xl font-semibold text-purple-800 mb-4">Our Team</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {team.map(member => (
        <div key={member.name} className="p-4 bg-purple-50 rounded-xl shadow flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-2xl text-white mb-2">
            {member.name[0]}
          </div>
          <div className="font-bold text-gray-800">{member.name}</div>
          <div className="text-sm text-gray-500 mb-2">{member.role}</div>
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">LinkedIn</a>
        </div>
      ))}
    </div>
  </section>
);

export default TeamCards;
