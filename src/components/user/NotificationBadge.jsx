import React from "react";

const NotificationBadge = ({ count }) => {
  return (
    <div className="relative">
      <span className="material-icons text-indigo-600 text-5xl hover:text-indigo-800 transition duration-300 ease-in-out">
        notifications
      </span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-xl animate-pulse">
          {count}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;
