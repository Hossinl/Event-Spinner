import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EventsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  if (!event) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Event Selected</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded transition font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-300 mb-2">
        Location: Lat {event.coords.lat.toFixed(2)}, Lng{" "}
        {event.coords.lng.toFixed(2)}
      </p>
      <p className="text-gray-300 mb-4">
        Date: 2025-12-10
      </p>
      <p className="text-gray-300 max-w-2xl text-center mb-6">
        DLorem ipsum dolor sit amet, consectetur adipiscing elit.
        Nulla quis lorem uescription: t libero malesuada feugiat.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded transition font-semibold"
      >
        Back to Globe
      </button>
    </div>
  );
};

export default EventsPage;
