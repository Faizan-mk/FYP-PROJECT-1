import React from 'react';

const ProfileInfo = () => {
  return (
    <div className="w-full flex flex-col gap-4 mt-4">
      {/* Name, Email, Phone fields */}
      <input type="text" placeholder="Name" className="p-3 rounded-xl border-2 border-blue-100 bg-gray-50 text-base font-normal outline-none focus:border-blue-500 focus:shadow-md transition" />
      <input type="email" placeholder="Email" className="p-3 rounded-xl border-2 border-blue-100 bg-gray-50 text-base font-normal outline-none focus:border-blue-500 focus:shadow-md transition" />
      <input type="tel" placeholder="Phone" className="p-3 rounded-xl border-2 border-blue-100 bg-gray-50 text-base font-normal outline-none focus:border-blue-500 focus:shadow-md transition" />
    </div>
  );
};

export default ProfileInfo;
