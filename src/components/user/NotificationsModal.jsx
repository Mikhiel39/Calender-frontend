import React, { useContext } from "react";
import AppContext from "../../context/AppContext";

const NotificationsModal = ({
  show,
  onClose,
  overdueCompanies,
  todayCompanies,
}) => {
  const { activeSchedules } = useContext(AppContext);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-500 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white shadow-xl rounded-xl w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto p-8 border-2 border-indigo-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-800 tracking-tight">
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-indigo-700 hover:text-red-600 transition duration-200 p-2 rounded-full"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="space-y-10">
          {/* Overdue Communications Section */}
          <div>
            <h3 className="text-2xl font-semibold text-red-600 mb-5">
              Overdue Communications ({overdueCompanies.length})
            </h3>
            <div className="grid gap-5">
              {overdueCompanies.map((company) => (
                <div
                  key={company._id}
                  className="p-6 bg-red-50 border-l-8 border-red-600 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  <p className="font-semibold text-red-700 text-lg">
                    {company.name}
                  </p>
                  {activeSchedules[company._id] && (
                    <p className="text-sm text-gray-600 mt-2">
                      Due:{" "}
                      {new Date(
                        activeSchedules[company._id].scheduledDate
                      ).toLocaleDateString()}
                      <br />
                      Type: {activeSchedules[company._id].communicationType}
                    </p>
                  )}
                </div>
              ))}
              {overdueCompanies.length === 0 && (
                <p className="text-gray-500">No overdue communications</p>
              )}
            </div>
          </div>

          {/* Today Communications Section */}
          <div>
            <h3 className="text-2xl font-semibold text-teal-600 mb-5">
              Due Today ({todayCompanies.length})
            </h3>
            <div className="grid gap-5">
              {todayCompanies.map((company) => (
                <div
                  key={company._id}
                  className="p-6 bg-teal-50 border-l-8 border-teal-600 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  <p className="font-semibold text-teal-700 text-lg">
                    {company.name}
                  </p>
                  {activeSchedules[company._id] && (
                    <p className="text-sm text-gray-600 mt-2">
                      Type: {activeSchedules[company._id].communicationType}
                    </p>
                  )}
                </div>
              ))}
              {todayCompanies.length === 0 && (
                <p className="text-gray-500">No communications due today</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
