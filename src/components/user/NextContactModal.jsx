import React from "react";

const NextContactModal = ({
  show,
  onClose,
  methods = [],
  nextContactData = {},
  setNextContactData,
  onSubmit,
}) => {
  if (!show) return null;

  const handleInputChange = (field, value) => {
    setNextContactData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-2xl shadow-xl w-96">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Schedule Next Contact
        </h3>
        <form onSubmit={onSubmit}>
          <div className="mb-5">
            <label
              htmlFor="communication-type"
              className="text-sm font-medium text-white mb-2 block"
            >
              Communication Type:
            </label>
            <select
              id="communication-type"
              value={nextContactData.nextCommunicationType || ""}
              onChange={(e) =>
                handleInputChange("nextCommunicationType", e.target.value)
              }
              className="mt-2 w-full rounded-lg border-2 border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 p-2"
              required
            >
              <option value="">Select Communication Type</option>
              {methods.map(({ _id, name }) => (
                <option key={_id} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label
              htmlFor="next-contact-date"
              className="text-sm font-medium text-white mb-2 block"
            >
              Next Contact Date:
            </label>
            <input
              id="next-contact-date"
              type="date"
              value={nextContactData.nextCommunicationDate || ""}
              onChange={(e) =>
                handleInputChange("nextCommunicationDate", e.target.value)
              }
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NextContactModal;
