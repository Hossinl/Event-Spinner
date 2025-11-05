import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Globe from "react-globe.gl";
import * as topojson from "topojson-client"; 
const WorldGlobe = forwardRef((props, ref) => {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Load countries (topojson world data)
  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((res) => res.json())
      .then((worldData) => {
        const features = topojson.feature(
          worldData,
          worldData.objects.countries
        ).features;
        setCountries(features);
      })
      .catch((err) => console.error("Error loading world data:", err));
  }, []);

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.warn("Geolocation error:", err.message)
      );
    }
  }, []);

  // Handle click on a country
  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    console.log("Selected country:", country.properties.name);
  };

  // “I'm Feeling Lucky” logic
  useImperativeHandle(ref, () => ({
    feelingLucky() {
      if (!countries.length || !globeRef.current) return;

      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];
      setSelectedCountry(randomCountry);

      const lat = Math.random() * 180 - 90;
      const lng = Math.random() * 360 - 180;

      globeRef.current.pointOfView({ lat, lng, altitude: 2 }, 2000);
    },
  }));

  return (
    <div className="w-full h-full relative">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        polygonsData={countries}
        polygonCapColor={({ properties }) =>
          selectedCountry?.properties.name === properties.name
            ? "rgba(0,150,255,0.6)"
            : "rgba(0,100,200,0.3)"
        }
        polygonSideColor={() => "rgba(0,100,200,0.15)"}
        polygonStrokeColor={() => "#222"}
        onPolygonClick={handleCountryClick}
        polygonLabel={({ properties: d }) => `<b>${d.name}</b>`}
        pointsData={userLocation ? [userLocation] : []}
        pointAltitude={0.02}
        pointColor={() => "orange"}
        pointLabel={() => "You are here 📍"}
      />

      {selectedCountry && (
        <div className="absolute top-5 right-5 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg z-10">
          <h3 className="font-semibold text-lg">
            {selectedCountry.properties.name}
          </h3>
          <p className="text-gray-300 text-sm">
            Top 10 events will load here...
          </p>
        </div>
      )}
    </div>
  );
});

export default WorldGlobe;
