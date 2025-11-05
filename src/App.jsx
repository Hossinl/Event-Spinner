import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EventsPage from "./EventsPage";
import WorldGlobe from "../Components /Globe/WorldGlobe";


function App() {
  const globeRef = useRef();

  const handleFeelingLucky = () => {
    if (globeRef.current && globeRef.current.feelingLucky) {
      globeRef.current.feelingLucky();
    }
  };

  return (
    <Router>
      <div className="relative h-screen w-screen bg-black text-white overflow-hidden">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-black/50 backdrop-blur-sm z-20">
          <div className="text-2xl font-bold flex items-center gap-2">
            🌍 <span>World Explorer</span>
          </div>
          <nav className="flex gap-6 text-gray-300 font-medium">
            <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            <Link to="/events" className="hover:text-blue-400 transition">Events</Link>
            <Link to="/flights" className="hover:text-blue-400 transition">Flights</Link>
            <Link to="/about" className="hover:text-blue-400 transition">About</Link>
          </nav>
        </header>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Intro Section */}
                <section className="absolute top-32 left-1/2 -translate-x-1/2 text-center z-20 max-w-xl">
                  <h1 className="text-4xl font-bold mb-2">Welcome to World Explorer</h1>
                  <p className="text-gray-300 mb-6">
                    Discover the biggest events happening around the world — right from your screen.
                  </p>
                  <button
                    onClick={handleFeelingLucky}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
                  >
                    🎲 I'm Feeling Lucky Today
                  </button>
                </section>

                {/* Globe */}
                <div className="w-full h-full">
                  <WorldGlobe ref={globeRef} />
                </div>
              </>
            }
          />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/flights" element={<div className="text-center mt-32">Flights Page Placeholder</div>} />
          <Route path="/about" element={<div className="text-center mt-32">About Page Placeholder</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
