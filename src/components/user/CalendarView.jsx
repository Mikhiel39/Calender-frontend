import React, { useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import AppContext from "../../context/AppContext";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import NextContactModal from "./NextContactModal";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CalendarView = () => {
  const { companies, activeSchedules, methods, scheduleNextCommunication } =
    useContext(AppContext);
  const [selectedView, setSelectedView] = useState("month");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [nextContactData, setNextContactData] = useState({
    nextCommunicationType: "",
    nextCommunicationDate: "",
  });

  const handleEventClick = (event) => {
    if (event.type === "upcoming") {
      setSelectedEvent(event);
      setNextContactData({
        nextCommunicationType: event.method,
        nextCommunicationDate: new Date(event.start)
          .toISOString()
          .split("T")[0],
      });
      setShowRescheduleModal(true);
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (selectedEvent) {
      scheduleNextCommunication(
        selectedEvent.companyId,
        nextContactData.nextCommunicationType,
        nextContactData.nextCommunicationDate
      );
      setShowRescheduleModal(false);
      setSelectedEvent(null);
    }
  };

  const events = companies.flatMap((company) => {
    const pastEvents = (company.lastCommunications || []).map((comm) => ({
      title: `${company.name} - ${comm.communicationType}`,
      start: new Date(comm.communicationDate),
      end: new Date(comm.communicationDate),
      type: "past",
      notes: comm.notes,
      companyId: company._id,
    }));

    const upcomingEvent = activeSchedules[company._id]
      ? [
          {
            title: `${company.name} - ${
              activeSchedules[company._id].communicationType
            }`,
            start: new Date(activeSchedules[company._id].scheduledDate),
            end: new Date(activeSchedules[company._id].scheduledDate),
            type: "upcoming",
            companyId: company._id,
            method: activeSchedules[company._id].communicationType,
          },
        ]
      : [];

    return [...pastEvents, ...upcomingEvent];
  });

  const moveEvent = ({ event, start }) => {
    if (event.type === "upcoming") {
      scheduleNextCommunication(
        event.companyId,
        event.method,
        moment(start).format("YYYY-MM-DD")
      );
    }
  };

  const eventStyleGetter = (event) => {
    const isUpcoming = event.type === "upcoming";
    const today = new Date().toISOString().split("T")[0];
    const eventDate = new Date(event.start).toISOString().split("T")[0];

    const backgroundColor = isUpcoming
      ? eventDate < today
        ? "#EF4444" // Overdue
        : eventDate === today
        ? "#F59E0B" // Due Today
        : "#34D399" // Upcoming
      : "#9CA3AF"; // Past

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        color: "white",
        border: "none",
        display: "block",
        cursor: isUpcoming ? "move" : "default",
        padding: "8px",
      },
    };
  };

  const CustomToolbar = ({ label, onNavigate }) => (
    <div className="flex flex-col gap-4 mb-6 p-4 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 rounded-lg shadow-lg text-white">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate("PREV")}
            className="bg-purple-700 hover:bg-purple-600 text-white rounded-md px-3 py-2 transition"
          >
            Previous
          </button>
          <button
            onClick={() => onNavigate("NEXT")}
            className="bg-purple-700 hover:bg-purple-600 text-white rounded-md px-3 py-2 transition"
          >
            Next
          </button>
        </div>
        <span className="text-xl font-bold">{label}</span>
        <div className="flex gap-2">
          {["month", "week", "day"].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`${
                selectedView === view
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white"
              } rounded-md px-3 py-2 transition`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        {["Overdue", "Due Today", "Upcoming", "Past"].map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full ${
                [
                  "bg-[#EF4444]",
                  "bg-[#F59E0B]",
                  "bg-[#34D399]",
                  "bg-[#9CA3AF]",
                ][index]
              }`}
            ></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={(event) => `${event.company}: ${event.notes || ""}`}
          views={["month", "week", "day"]}
          view={selectedView}
          onView={setSelectedView}
          onEventDrop={moveEvent}
          draggableAccessor={(event) => event.type === "upcoming"}
          resizable={false}
          components={{ toolbar: CustomToolbar }}
          onSelectEvent={handleEventClick}
        />
      </div>
      <NextContactModal
        show={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        methods={methods}
        nextContactData={nextContactData}
        setNextContactData={setNextContactData}
        onSubmit={handleRescheduleSubmit}
      />
    </div>
  );
};

export default CalendarView;
