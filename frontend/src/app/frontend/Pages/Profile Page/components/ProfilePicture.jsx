import React, { useRef, useState } from 'react';

const ProfilePicture = () => {
  const [image, setImage] = useState('/default-profile.png');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center mb-7">
      <img src={image} alt="Profile" className="w-28 h-28 rounded-full border-4 border-blue-300 object-cover shadow-md mb-2 bg-gray-200" />
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      <button onClick={() => fileInputRef.current.click()} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full px-5 py-2 font-medium shadow hover:from-cyan-400 hover:to-blue-500 transition mb-1 mt-1 flex items-center">
        <span role="img" aria-label="camera" style={{fontSize: '1.2em', marginRight: '0.3em'}}>📷</span>
        Edit
      </button>
    </div>
  );
};

export default ProfilePicture;
