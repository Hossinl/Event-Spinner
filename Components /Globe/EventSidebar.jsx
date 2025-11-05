import React from "react";

const EventsSidebar = ({ country, events, onEventClick, onClose }) => {
  if (!country) return null;

  return (
    <div className="absolute top-24 right-5 w-80 max-h-[70vh] overflow-y-auto bg-black/90 text-white p-4 rounded-lg shadow-lg z-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{country.properties.name} Events</h2>
        <button
          onClick={onClose}
          className="text-red-500 font-bold text-lg hover:text-red-400"
        >
          ✖
        </button>
      </div>
      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.id}
            onClick={() => onEventClick(event)}
            className="p-2 bg-gray-800 rounded hover:bg-blue-600 transition cursor-pointer"
          >
            <p className="font-semibold">{event.title}</p>
            <p className="text-sm text-gray-300">
              Lat: {event.coords.lat.toFixed(2)}, Lng: {event.coords.lng.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsSidebar;
