import React from "react";
const Header = ({ onFeelingLucky }) => {
  return (
    <header className="w-full flex justify-between items-center p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Event Spinner</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={onFeelingLucky}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          I'm feeling lucky today
        </button>
      </div>
    </header>
  );
};

export default Header;
