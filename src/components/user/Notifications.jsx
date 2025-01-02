import React, { useContext } from "react";
import AppContext from "../../context/AppContext";

const Notifications = () => {
  const { notifications } = useContext(AppContext);
  const totalCount =
    notifications.overdue.length + notifications.dueToday.length;

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 via-white to-gray-100 rounded-lg shadow-lg relative border border-gray-200">
      {totalCount > 0 && (
        <span className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold shadow-md">
          {totalCount}
        </span>
      )}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
        Notifications
        {notifications.overdue.length > 0 && (
          <span className="ml-3 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium shadow-inner">
            {notifications.overdue.length} overdue
          </span>
        )}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Overdue Communications Section */}
        <div className="bg-white p-6 rounded-lg border border-red-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-red-700 mb-4 flex items-center">
            <span className="material-icons text-red-500 mr-2">
              error_outline
            </span>
            Overdue Communications ({notifications.overdue.length})
          </h3>
          <ul className="space-y-3">
            {notifications.overdue.map((company) => (
              <li
                key={company._id}
                className="p-4 bg-red-50 rounded-lg border border-red-300 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between"
              >
                <span className="text-gray-800 font-medium">
                  {company.name}
                </span>
                <span className="text-red-500 text-xs font-semibold">
                  Overdue
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Today's Communications Section */}
        <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
            <span className="material-icons text-blue-500 mr-2">event</span>
            Today's Communications ({notifications.dueToday.length})
          </h3>
          <ul className="space-y-3">
            {notifications.dueToday.map((company) => (
              <li
                key={company._id}
                className="p-4 bg-blue-50 rounded-lg border border-blue-300 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between"
              >
                <span className="text-gray-800 font-medium">
                  {company.name}
                </span>
                <span className="text-blue-500 text-xs font-semibold">
                  Due Today
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
