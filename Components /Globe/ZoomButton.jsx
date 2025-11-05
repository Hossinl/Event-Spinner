import React from "react";

const ZoomButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-24 right-5 z-10 bg-blue-600 p-3 rounded-full text-white shadow-lg hover:bg-blue-500 transition"
    title="Zoom to My Location"
  >
    📍
  </button>
);

export default ZoomButton;
