// TeamCards.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';
import { FiCamera } from 'react-icons/fi';

const initialTeam = [
  { id: 1, name: 'Muhammad Faizan', role: 'Frontend Developer', linkedin: 'https://www.linkedin.com/in/muhammad-faizanmk/' },
  { id: 2, name: 'Zeeshan', role: 'Backend Developer', linkedin: 'https://linkedin.com' },
  { id: 3, name: 'Naila', role: 'UI/UX Designer', linkedin: 'https://linkedin.com' },
];

const TeamCards = () => {
  const [team, setTeam] = useState(initialTeam);
  const fileInputRef = useRef(null);
  const [activeMemberId, setActiveMemberId] = useState(null);

  // Load images from localStorage on mount
  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem('team_images') || '{}');
    setTeam(prev => prev.map(member => ({
      ...member,
      image: savedImages[member.id] || null
    })));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeMemberId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;

        // Update state
        setTeam(prev => prev.map(member =>
          member.id === activeMemberId ? { ...member, image: base64String } : member
        ));

        // Update localStorage
        const savedImages = JSON.parse(localStorage.getItem('team_images') || '{}');
        savedImages[activeMemberId] = base64String;
        localStorage.setItem('team_images', JSON.stringify(savedImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (id) => {
    setActiveMemberId(id);
    fileInputRef.current.click();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {team.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -10 }}
          className="group relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all group-hover:h-3"></div>

          {/* Image / Initial Avatar */}
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden shadow-inner border-4 border-white">
              {member.image ? (
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-indigo-600 font-bold">{member.name[0]}</span>
              )}
            </div>

            {/* Upload Button Overlay */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                triggerUpload(member.id);
              }}
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border-2 border-white hover:from-indigo-700 hover:to-blue-700 transition-all z-40 cursor-pointer animate-pulse-subtle"
            >
              <FiCamera size={18} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Upload</span>
            </motion.button>
          </div>

          <style jsx>{`
            @keyframes pulse-subtle {
              0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
              50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
            }
            .animate-pulse-subtle {
              animation: pulse-subtle 2s infinite;
            }
          `}</style>

          <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
          <p className="text-sm font-medium text-indigo-500 mb-6 uppercase tracking-wider">{member.role}</p>

          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#0077b5] hover:text-white transition-all duration-300 shadow-sm"
          >
            <FaLinkedin size={20} />
          </motion.a>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamCards;


