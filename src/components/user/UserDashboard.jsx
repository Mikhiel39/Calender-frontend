import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import CommunicationModal from "./CommunicationModal";
import NextContactModal from "./NextContactModal";
import CompanyCard from "./CompanyCard";

const Dashboard = () => {
  const {
    companies,
    notifications,
    lastFiveCommunicationDate,
    methods,
    logCommunication,
    activeSchedules,
    scheduleNextCommunication,
    cancelNextCommunication,
    removeCommunication,
  } = useContext(AppContext);

  const [highlightDisabled, setHighlightDisabled] = useState({});
  const [hoveredCommunication, setHoveredCommunication] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showNextContactModal, setShowNextContactModal] = useState(false);
  const [selectedCompanyForNextContact, setSelectedCompanyForNextContact] =
    useState(null);
  const [communicationData, setCommunicationData] = useState({
    communicationType: "",
    communicationDate: "",
    notes: "",
  });
  const [nextContactData, setNextContactData] = useState({
    nextCommunicationType: "",
    nextCommunicationDate: "",
  });

  const toggleHighlight = (companyId) => {
    setHighlightDisabled((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const toggleCompanySelection = (companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleCommunicationSubmit = (e) => {
    e.preventDefault();

    const communicationDate = new Date(communicationData.communicationDate);
    const today = new Date();

    if (communicationDate > today) {
      alert(
        "Cannot log future communications. Use the Schedule feature instead."
      );
      return;
    }

    if (
      !communicationData.communicationType ||
      !communicationData.communicationDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const newCommunication = {
      ...communicationData,
      communicationDate: communicationDate.toISOString(),
    };

    selectedCompanies.forEach((companyId) => {
      logCommunication(companyId, newCommunication);
      setHighlightDisabled((prev) => ({
        ...prev,
        [companyId]: true,
      }));
    });

    setShowCommunicationModal(false);
    resetCommunicationData();
  };

  const resetCommunicationData = () => {
    setCommunicationData({
      communicationType: "",
      communicationDate: "",
      notes: "",
    });
    setSelectedCompanies([]);
  };

  const handleNextContactSubmit = (e) => {
    e.preventDefault();

    if (
      !nextContactData.nextCommunicationType ||
      !nextContactData.nextCommunicationDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    scheduleNextCommunication(
      selectedCompanyForNextContact,
      nextContactData.nextCommunicationType,
      nextContactData.nextCommunicationDate
    );

    setShowNextContactModal(false);
    resetNextContactData();
  };

  const resetNextContactData = () => {
    setNextContactData({
      nextCommunicationType: "",
      nextCommunicationDate: "",
    });
    setSelectedCompanyForNextContact(null);
  };

  return (
    <div className="p-8 bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 min-h-screen">
      {selectedCompanies.length > 0 && (
        <button
          onClick={() => setShowCommunicationModal(true)}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Communication Performed ({selectedCompanies.length})
        </button>
      )}

      <CommunicationModal
        show={showCommunicationModal}
        onClose={() => setShowCommunicationModal(false)}
        methods={methods}
        communicationData={communicationData}
        setCommunicationData={setCommunicationData}
        handleCommunicationSubmit={handleCommunicationSubmit}
      />

      <NextContactModal
        show={showNextContactModal}
        onClose={() => setShowNextContactModal(false)}
        methods={methods}
        nextContactData={nextContactData}
        setNextContactData={setNextContactData}
        onSubmit={handleNextContactSubmit}
      />

      <div className="grid grid-cols-1 gap-4">
        <h1 className="text-3xl font-bold text-gray-400 mb-2">Company Info</h1>
        {companies.map((company, index) => (
          <CompanyCard
            key={company._id}
            company={company}
            isSelected={selectedCompanies.includes(company._id)}
            highlightDisabled={highlightDisabled}
            notifications={notifications}
            lastFiveDates={lastFiveCommunicationDate[index]}
            activeSchedules={activeSchedules}
            onToggleSelection={() => toggleCompanySelection(company._id)}
            onToggleHighlight={() => toggleHighlight(company._id)}
            onScheduleNext={() => {
              setSelectedCompanyForNextContact(company._id);
              setNextContactData(
                activeSchedules[company._id]
                  ? {
                      nextCommunicationType:
                        activeSchedules[company._id].communicationType,
                      nextCommunicationDate:
                        activeSchedules[company._id].scheduledDate,
                    }
                  : { nextCommunicationType: "", nextCommunicationDate: "" }
              );
              setShowNextContactModal(true);
            }}
            onCancelNext={() => cancelNextCommunication(company._id)}
            hoveredCommunication={hoveredCommunication}
            setHoveredCommunication={setHoveredCommunication}
            onRemoveCommunication={(communicationId) => {
              if (
                window.confirm(
                  "Are you sure you want to remove this communication?"
                )
              ) {
                removeCommunication(company._id, communicationId);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
