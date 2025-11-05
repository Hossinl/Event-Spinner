import React from "react";

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-96 max-w-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 font-bold text-lg"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <p className="text-gray-700 mb-4">{event.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          Location: Lat {event.coords.lat.toFixed(2)}, Lng {event.coords.lng.toFixed(2)}
        </p>
        <div className="flex gap-4 justify-end">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">
            Book Event
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition">
            Book Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
