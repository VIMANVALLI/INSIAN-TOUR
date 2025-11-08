import React, { useState, useEffect } from "react";

export default function States({ selectedState, onSelectState, onBack }) {
  const [states] = useState([
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Puducherry",
    "Jammu and Kashmir",
    "Ladakh",
  ]);

  const [currentState, setCurrentState] = useState(selectedState || null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (currentState) {
      fetch(`http://localhost:8000/places?state=${encodeURIComponent(currentState)}`)
        .then((r) => r.json())
        .then(setPlaces)
        .catch((e) => console.error("Error fetching places:", e));
    }
  }, [currentState]);

  // Filter places based on search term
  const filteredPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={page}>
      <h1 style={heading}>Indian States</h1>

      {/* --- Show all states --- */}
      {!currentState && (
        <div style={buttonGrid}>
          {states.map((st) => (
            <button
              key={st}
              style={stateButton}
              onClick={() => {
                setCurrentState(st);
                if (onSelectState) onSelectState(st);
              }}
              onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.background = "#007bff")}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* --- Show places for a selected state --- */}
      {currentState && !selectedPlace && (
        <div style={placesSection}>
          <button
            style={backBtn}
            onClick={() => {
              setCurrentState(null);
              if (onBack) onBack();
            }}
          >
            ← Back to States
          </button>

          <h2 style={stateTitle}>{currentState}</h2>

          {/* 🔍 Search bar */}
          <input
            type="text"
            placeholder="Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchBox}
          />

          {filteredPlaces.length === 0 ? (
            <p style={{ textAlign: "center" }}>No places found.</p>
          ) : (
            <div style={placesGrid}>
              {filteredPlaces.map((p) => (
                <div key={p.id} style={placeCard}>
                  <h3>{p.name}</h3>
                  <p>{p.description?.slice(0, 60)}...</p>
                  {p.photos && p.photos[0] && (
                    <img
                      src={`http://localhost:8000/uploads/${p.photos[0]}`}
                      alt={p.name}
                      style={photoSmall}
                      onClick={() => setSelectedPlace(p)}
                    />
                  )}
                  <button
                    style={viewBtn}
                    onClick={() => setSelectedPlace(p)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- Show expanded place details --- */}
      {selectedPlace && (
        <div style={placeDetail}>
          <button
            style={backBtn}
            onClick={() => setSelectedPlace(null)}
          >
            ← Back to {currentState} Places
          </button>

          <h2 style={stateTitle}>{selectedPlace.name}</h2>
          <p style={desc}>{selectedPlace.description}</p>

          {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
            <div style={photosGrid}>
              {selectedPlace.photos.map((ph, i) => (
                <img
                  key={i}
                  src={`http://localhost:8000/uploads/${ph}`}
                  alt={`${selectedPlace.name}-${i}`}
                  style={photoLarge}
                />
              ))}
            </div>
          ) : (
            <p>No photos available.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---- STYLES ---- */
const page = {
  padding: "20px",
  background: "#f0f8ff",
  minHeight: "100vh",
};

const heading = {
  textAlign: "center",
  fontSize: "2em",
  marginBottom: "20px",
  fontWeight: "bold",
  color: "#004080",
};

const buttonGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "15px",
  justifyItems: "center",
};

const stateButton = {
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  width: "100%",
  fontSize: "1em",
  cursor: "pointer",
  transition: "all 0.3s",
};

const placesSection = {
  textAlign: "center",
};

const backBtn = {
  marginBottom: "15px",
  padding: "8px 16px",
  background: "#ff5722",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const searchBox = {
  width: "60%",
  maxWidth: "400px",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "20px",
  fontSize: "1em",
};

const stateTitle = {
  fontSize: "1.6em",
  marginBottom: "10px",
  color: "#004080",
};

const placesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const placeCard = {
  background: "white",
  borderRadius: "10px",
  padding: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
};

const photoSmall = {
  width: "100%",
  height: "120px",
  borderRadius: "8px",
  objectFit: "cover",
  marginTop: "8px",
  cursor: "pointer",
  transition: "transform 0.3s",
};

const viewBtn = {
  marginTop: "8px",
  background: "#28a745",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.9em",
  alignSelf: "center",
};

const placeDetail = {
  textAlign: "center",
};

const desc = {
  maxWidth: "700px",
  margin: "10px auto",
  lineHeight: "1.6",
  fontSize: "1.1em",
  color: "#333",
};

const photosGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const photoLarge = {
  width: "100%",
  height: "300px",
  borderRadius: "10px",
  objectFit: "contain",
};
