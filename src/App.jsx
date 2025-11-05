import { useRef } from "react";
import WorldGlobe from "../Components /WorldGlobe";


function App() {
  const globeRef = useRef();

  const handleFeelingLucky = () => {
    if (globeRef.current && globeRef.current.feelingLucky) {
      globeRef.current.feelingLucky();
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-black/50 backdrop-blur-sm z-20">
        <div className="text-2xl font-bold flex items-center gap-2">
          🌍 <span>Event Spinner</span>
        </div>
        <nav className="flex gap-6 text-gray-300 font-medium">
          <a href="#" className="hover:text-blue-400 transition">
            Home
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Events
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Flights
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            About
          </a>
        </nav>
      </header>

      {/* Intro Section */}
      <section className="absolute top-32 left-1/2 -translate-x-1/2 text-center z-20 max-w-xl">
        <h1 className="text-4xl font-bold mb-2">Welcome to Event Spinner</h1>
        <p className="text-gray-300 mb-6">
          Discover the biggest events happening around the world — right from
          your screen.
        </p>
        <button
          onClick={handleFeelingLucky}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
        >
          🎲 I'm Feeling Lucky Today 💆‍♂️
        </button>
      </section>

      {/* Globe */}
      <div className="w-full h-full">
        <WorldGlobe ref={globeRef} />
      </div>
    </div>
  );
}

export default App;
