import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Globe from "react-globe.gl";
import * as topojson from "topojson-client";
import { useNavigate } from "react-router-dom";

const WorldGlobe = forwardRef((props, ref) => {
  const globeRef = useRef();
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [allCountryEvents, setAllCountryEvents] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [events, setEvents] = useState([]);
  const [flights, setFlights] = useState([]);
  const [showEventsPanel, setShowEventsPanel] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load world data and events from backend
  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        // 1️⃣ Load world map geometry
        const worldData = await fetch(
          "https://unpkg.com/world-atlas@2.0.2/countries-110m.json"
        ).then((res) => res.json());
        const features = topojson.feature(
          worldData,
          worldData.objects.countries
        ).features;
        setCountries(features);

        // 2️⃣ Load all countries with events from backend
        const response = await fetch("http://10.250.68.115:8000/countries");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const events = await response.json();
        setAllCountryEvents(events);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountriesData();
  }, []);

  // Get user location and zoom in
  const fetchUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          globeRef.current.pointOfView(
            { lat: coords.lat, lng: coords.lng, altitude: 1.5 },
            2000
          );
        },
        (err) => alert("Could not get your location: " + err.message)
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  // Country centroid calculation
  const countryCentroid = (country) => {
    const coords = country.geometry.coordinates.flat(3);
    let lats = [];
    let lngs = [];
    for (let i = 0; i < coords.length; i += 2) {
      lngs.push(coords[i]);
      lats.push(coords[i + 1]);
    }
    return [
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
      lats.reduce((a, b) => a + b, 0) / lats.length,
    ];
  };

  // Filter and display events for a specific country
  const fetchEventsForCountry = (country) => {
    const centroid = countryCentroid(country);

    // Match backend country
    const matchingCountry =
      allCountryEvents.find(
        (c) =>
          c.country_code === country.id ||
          c.name === country.properties.name ||
          c.iso2 === country.properties.ISO_A2
      ) || {};

    const foundEvents = matchingCountry.events || [];

    if (!foundEvents.length) {
      alert(`No events found for ${country.properties.name}`);
      setEvents([]);
      setFlights([]);
      return;
    }

    const formattedEvents = foundEvents.map((ev, i) => ({
      id: i,
      title: ev.name || ev.title || `Event ${i + 1}`,
      coords: {
        lat: ev.lat || centroid[1] + (Math.random() - 0.5) * 5,
        lng: ev.lng || centroid[0] + (Math.random() - 0.5) * 5,
      },
      description: ev.description || "No description available.",
    }));

    setEvents(formattedEvents);

    // Arcs from centroid to events
    const arcs = formattedEvents.map((ev) => ({
      startLat: centroid[1],
      startLng: centroid[0],
      endLat: ev.coords.lat,
      endLng: ev.coords.lng,
      color: "rgba(255,165,0,0.7)",
    }));
    setFlights(arcs);
  };

  // Handle country click
  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setSelectedEvent(null);
    setShowEventsPanel(true);
    const centroid = countryCentroid(country);
    globeRef.current.pointOfView(
      { lat: centroid[1], lng: centroid[0], altitude: 1.8 },
      1500
    );
    fetchEventsForCountry(country);
  };

  // Handle event click → show event popup
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventsPanel(false); // hide sidebar when popup shows

    // Optional: draw flight from user to event
    if (userLocation) {
      const userToEventArc = {
        startLat: userLocation.lat,
        startLng: userLocation.lng,
        endLat: event.coords.lat,
        endLng: event.coords.lng,
        color: "red",
      };
      setFlights([userToEventArc]);
    }

    globeRef.current.pointOfView(
      { lat: event.coords.lat, lng: event.coords.lng, altitude: 1.5 },
      1500
    );
  };

  // “I’m Feeling Lucky” button → random country
  useImperativeHandle(ref, () => ({
    feelingLucky() {
      if (!countries.length || !globeRef.current) return;
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];
      setSelectedCountry(randomCountry);
      setShowEventsPanel(true);
      const centroid = countryCentroid(randomCountry);
      globeRef.current.pointOfView(
        { lat: centroid[1], lng: centroid[0], altitude: 1.5 },
        2000
      );
      fetchEventsForCountry(randomCountry);
    },
  }));

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p>🌍 Loading world data and events...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Zoom to my location */}
      <button
        onClick={fetchUserLocation}
        className="absolute top-24 right-5 z-10 bg-blue-600 p-3 rounded-full text-white shadow-lg hover:bg-blue-500 transition"
        title="Zoom to My Location"
      >
        📍
      </button>

      {/* Globe */}
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        polygonsData={countries}
        polygonCapColor={({ properties }) =>
          selectedCountry?.properties.name === properties.name
            ? "rgba(0,150,255,0.6)"
            : "rgba(0,100,200,0.4)"
        }
        polygonSideColor={() => "rgba(0,100,200,0.2)"}
        polygonStrokeColor={() => "#000"}
        onPolygonClick={handleCountryClick}
        polygonLabel={({ properties: d }) => `<b>${d.name}</b>`}
        polygonAltitude={0.01}
        showAtmosphere={true}
        atmosphereAltitude={0.25}
        pointsData={userLocation ? [userLocation] : []}
        pointAltitude={0.03}
        pointColor={() => "orange"}
        pointLabel={() => "You are here 📍"}
        arcsData={flights}
        arcColor={"color"}
        arcDashLength={0.3}
        arcDashGap={0.5}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
      />

      {/* Sidebar with events */}
      {showEventsPanel && (
        <div className="absolute top-24 right-5 w-80 max-h-[70vh] overflow-y-auto bg-black/90 text-white p-4 rounded-lg shadow-lg z-20">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">
              {selectedCountry?.properties.name} Events
            </h2>
            <button
              onClick={() => setShowEventsPanel(false)}
              className="text-red-500 font-bold text-lg hover:text-red-400"
            >
              ✖
            </button>
          </div>
          <ul className="space-y-2">
            {events.map((event) => (
              <li
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="p-2 bg-gray-800 rounded hover:bg-blue-600 transition cursor-pointer"
              >
                <p className="font-semibold">{event.title}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popup card for selected event */}
      {selectedEvent && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="bg-gray-900 text-white p-6 rounded-lg w-96 shadow-lg relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-2 right-2 text-red-500 text-xl hover:text-red-400"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
            <p className="text-gray-300 mb-4">
              Location: Lat {selectedEvent.coords.lat.toFixed(2)}, Lng{" "}
              {selectedEvent.coords.lng.toFixed(2)}
            </p>
            <p className="text-gray-300 mb-6">
              {selectedEvent.description ||
                "No description available for this event."}
            </p>
            <button
              onClick={() =>
                navigate("/events", { state: { event: selectedEvent } })
              }
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded transition text-white font-semibold"
            >
              Explore Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default WorldGlobe;
