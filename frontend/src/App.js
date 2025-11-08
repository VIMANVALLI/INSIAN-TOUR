import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import AddPlace from "./AddPlace";
import States from "./States";
import Profile from "./Profile";

function App() {
  const [view, setView] = useState("home");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [selectedState, setSelectedState] = useState(null);

  // Persist user info in localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 🔹 MARQUEE SCROLLING LABEL ON TOP */}
      <div style={marqueeContainer}>
        <marquee
          behavior="scroll"
          direction="left"
          scrollamount="6"
          style={marqueeText}
        >
          🌍✨ Explore Incredible India! | Visit famous states, discover hidden
          gems, and experience the beauty of our culture 🇮🇳✨
        </marquee>
      </div>

      {/* HEADER */}
      <div style={headerStyle}>
        <div style={{ fontWeight: "bold", fontSize: 22 }}>
          Welcome to Indian Tourism
        </div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user.profile_photo && (
              <img
                src={`http://localhost:8000/uploads/${user.profile_photo}`}
                alt="Profile"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid white",
                }}
              />
            )}
            <span>{user.username}</span>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                setUser(null);
                setView("home");
              }}
              style={logoutBtn}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 14, fontWeight: 500 }}>❌ Guest Mode</div>
        )}
      </div>

      {/* BODY */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <Sidebar
          onNavigate={(v) => {
            setView(v);
            if (v === "states") setSelectedState(null);
          }}
          user={user}
        />

        {/* MAIN VIEW */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            background: "#f5f5f5",
            overflowY: "auto",
          }}
        >
          {view === "home" && (
            <Home
              onSelectState={(s) => {
                setSelectedState(s);
                setView("states");
              }}
            />
          )}

          {view === "states" && (
            <States
              selectedState={selectedState}
              onSelectState={(s) => setSelectedState(s)}
              onBack={() => setView("home")}
            />
          )}

          {view === "addplace" && (
            <AddPlace
              token={user?.token}
              onDone={(st) => {
                if (st) {
                  setSelectedState(st);
                  setView("states");
                } else {
                  setView("home");
                }
              }}
            />
          )}

          {view === "profile" && <Profile user={user} />}

          {view === "signup" && (
            <Signup
              onSignup={(token, username, profile_photo) => {
                const newUser = { token, username, profile_photo };
                setUser(newUser);
                setView("home");
              }}
              onSwitchToLogin={() => setView("login")}
            />
          )}

          {view === "login" && (
            <Login
              onLogin={(token, username, profile_photo) => {
                const newUser = { token, username, profile_photo };
                setUser(newUser);
                setView("home");
              }}
              onSwitchToSignup={() => setView("signup")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

/* ---- STYLES ---- */
const headerStyle = {
  background: "linear-gradient(90deg, #e53935, #ff7043)",
  color: "white",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

const logoutBtn = {
  background: "white",
  color: "#e53935",
  border: "none",
  borderRadius: "6px",
  padding: "5px 10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const marqueeContainer = {
  background: "linear-gradient(90deg, #2196f3, #21cbf3)",
  color: "white",
  padding: "6px 0",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const marqueeText = {
  fontSize: "15px",
  color: "white",
};
