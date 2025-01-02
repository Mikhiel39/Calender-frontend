import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State variables
  const [companies, setCompanies] = useState([]);
  const [methods, setMethods] = useState([]);
  const [lastFiveCommunicationDate, setLastFiveCommunicationDate] = useState(
    []
  );
  const [nextCommunications, setNextCommunications] = useState({});
  const [activeSchedules, setActiveSchedules] = useState({});
  const [notifications, setNotifications] = useState({
    overdue: [],
    dueToday: [],
  });
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );

  const defaultPeriodicInterval = 14; // Default interval in days (2 weeks)

  // Fetch initial data for companies, methods, and schedules
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [companiesRes, methodsRes, schedulesRes] = await Promise.all([
          axios.get("https://calender-backend-i1bj.onrender.com/api/companies"),
          axios.get(
            "https://calender-backend-i1bj.onrender.com/api/communications"
          ),
          axios.get(
            "https://calender-backend-i1bj.onrender.com/api/next-communications"
          ),
        ]);

        const fetchedCompanies = companiesRes.data || [];
        setCompanies(fetchedCompanies);
        setMethods(methodsRes.data || []);

        // Populate last five communication dates for each company
        const communicationsData = fetchedCompanies.map((company) =>
          (company.lastCommunications || [])
            .map((comm) => ({
              _id: comm._id,
              communicationDate: comm.communicationDate,
              method: comm.communicationType,
              notes: comm.notes,
            }))
            .sort(
              (a, b) =>
                new Date(b.communicationDate) - new Date(a.communicationDate)
            )
            .slice(0, 5)
        );
        setLastFiveCommunicationDate(communicationsData);

        // Map schedules by company ID
        const schedulesMap = schedulesRes.data.reduce((acc, schedule) => {
          acc[schedule.companyId] = schedule;
          return acc;
        }, {});
        setActiveSchedules(schedulesMap);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Compute overdue and due today notifications
  useEffect(() => {
    const computeNotifications = () => {
      const overdue = [];
      const dueToday = [];
      const today = new Date().toISOString().split("T")[0];

      companies.forEach((company) => {
        const schedule = activeSchedules[company._id];
        const scheduledDate =
          schedule &&
          new Date(schedule.scheduledDate).toISOString().split("T")[0];

        if (scheduledDate) {
          if (scheduledDate < today) overdue.push(company);
          else if (scheduledDate === today) dueToday.push(company);
        } else if (company.nextCommunication) {
          const nextDate = new Date(company.nextCommunication)
            .toISOString()
            .split("T")[0];
          if (nextDate < today) overdue.push(company);
          else if (nextDate === today) dueToday.push(company);
        }
      });

      setNotifications({ overdue, dueToday });
    };

    computeNotifications();
  }, [companies, activeSchedules]);

  // Add a new company
  const addCompany = async (newCompany) => {
    try {
      if (!newCompany.nextCommunication) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + defaultPeriodicInterval);
        newCompany.nextCommunication = nextDate.toISOString().split("T")[0];
      }
      await axios.post(
        "https://calender-backend-i1bj.onrender.com/api/companies",
        newCompany
      );
      const response = await axios.get(
        "https://calender-backend-i1bj.onrender.com/api/companies"
      );
      setCompanies(response.data || []);
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  // Update an existing company
  const updateCompany = async (updatedCompany) => {
    try {
      if (!updatedCompany.nextCommunication) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + defaultPeriodicInterval);
        updatedCompany.nextCommunication = nextDate.toISOString().split("T")[0];
      }
      await axios.put(
        `https://calender-backend-i1bj.onrender.com/api/companies/${updatedCompany._id}`,
        updatedCompany
      );
      setCompanies((prev) =>
        prev.map((company) =>
          company._id === updatedCompany._id ? updatedCompany : company
        )
      );
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  // Delete a company
  const deleteCompany = async (id) => {
    try {
      await axios.delete(
        `https://calender-backend-i1bj.onrender.com/api/companies/${id}`
      );
      setCompanies((prev) => prev.filter((company) => company._id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  // Schedule or update next communication
  const scheduleNextCommunication = async (
    companyId,
    communicationType,
    scheduledDate
  ) => {
    try {
      let response;
      if (activeSchedules[companyId]) {
        response = await axios.put(
          `https://calender-backend-i1bj.onrender.com/api/next-communications/${activeSchedules[companyId]._id}`,
          { communicationType, scheduledDate }
        );
      } else {
        response = await axios.post(
          "https://calender-backend-i1bj.onrender.com/api/next-communications",
          { companyId, communicationType, scheduledDate }
        );
      }
      setActiveSchedules((prev) => ({ ...prev, [companyId]: response.data }));
    } catch (error) {
      console.error("Error scheduling next communication:", error);
    }
  };

  // Log a communication action
  const logCommunication = async (companyId, communicationData) => {
    try {
      const response = await axios.post(
        "https://calender-backend-i1bj.onrender.com/api/communications",
        { ...communicationData, companyId }
      );

      setCompanies((prev) =>
        prev.map((company) =>
          company._id === companyId ? response.data.updatedCompany : company
        )
      );

      updateLastFiveCommunicationDate(companyId, {
        communicationDate: communicationData.communicationDate,
        method: communicationData.communicationType,
        notes: communicationData.notes,
      });
    } catch (error) {
      console.error("Error logging communication:", error);
    }
  };

  // Update last five communications
  const updateLastFiveCommunicationDate = (companyId, newCommunication) => {
    setLastFiveCommunicationDate((prev) => {
      const companyIndex = companies.findIndex((c) => c._id === companyId);
      if (companyIndex === -1) return prev;

      const updatedCommunications = [
        newCommunication,
        ...(prev[companyIndex] || []),
      ]
        .sort(
          (a, b) =>
            new Date(b.communicationDate) - new Date(a.communicationDate)
        )
        .slice(0, 5);

      return prev.map((comms, idx) =>
        idx === companyIndex ? updatedCommunications : comms
      );
    });
  };

  // Cancel next communication
  const cancelNextCommunication = async (companyId) => {
    try {
      if (activeSchedules[companyId]) {
        await axios.delete(
          `https://calender-backend-i1bj.onrender.com/api/next-communications/${activeSchedules[companyId]._id}`
        );
        setActiveSchedules((prev) => {
          const updated = { ...prev };
          delete updated[companyId];
          return updated;
        });
      }
    } catch (error) {
      console.error("Error cancelling next communication:", error);
    }
  };

  // Get total notification count
  const getNotificationCount = () =>
    notifications.overdue.length + notifications.dueToday.length;

  return (
    <AppContext.Provider
      value={{
        companies,
        methods,
        notifications,
        addCompany,
        updateCompany,
        deleteCompany,
        logCommunication,
        scheduleNextCommunication,
        cancelNextCommunication,
        activeSchedules,
        getNotificationCount,
        userRole,
        setUserRole,
        lastFiveCommunicationDate,
        updateLastFiveCommunicationDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
