import React from "react";

const CommunicationModal = ({
  show,
  methods,
  communicationData,
  setCommunicationData,
  handleCommunicationSubmit,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Log Communication
        </h3>
        <form onSubmit={handleCommunicationSubmit}>
          {/* Communication Type */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Communication Type:
            </label>
            <select
              value={communicationData.communicationType || ""}
              onChange={(e) =>
                setCommunicationData((prev) => ({
                  ...prev,
                  communicationType: e.target.value,
                }))
              }
              className="w-full rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 p-3 text-gray-800"
              required
            >
              <option value="">Select Communication Type</option>
              {methods.map((method) => (
                <option key={method._id} value={method.name}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          {/* Communication Date */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Communication Date:
            </label>
            <input
              type="date"
              value={communicationData.communicationDate || ""}
              onChange={(e) =>
                setCommunicationData((prev) => ({
                  ...prev,
                  communicationDate: e.target.value,
                }))
              }
              className="w-full rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 p-3 text-gray-800"
              required
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Notes:
            </label>
            <textarea
              value={communicationData.notes || ""}
              onChange={(e) =>
                setCommunicationData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              className="w-full rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 p-3 text-gray-800"
              rows="4"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunicationModal;
