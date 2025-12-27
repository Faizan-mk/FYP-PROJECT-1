import React from 'react';

import ProfilePicture from './components/ProfilePicture';
import ProfileInfo from './components/ProfileInfo';

const ProfilePage = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center font-sans mt-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-900 tracking-wide">Profile</h2>
      <ProfilePicture />
      <ProfileInfo />
    </div>
  );
};

export default ProfilePage;
