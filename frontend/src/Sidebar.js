import React from "react";

export default function Sidebar({ onNavigate, user }) {
  return (
    <div style={sidebar}>
      <h3 style={title}>Menu</h3>
      <button style={btn} onClick={() => onNavigate("home")}>Home</button>
      <button style={btn} onClick={() => onNavigate("states")}>States</button>
      <button style={btn} onClick={() => onNavigate("addplace")}>Add Place</button>

      {user ? (
        <button style={btn} onClick={() => onNavigate("profile")}>
          Profile
        </button>
      ) : (
        <>
          <button style={btn} onClick={() => onNavigate("login")}>
            Login
          </button>
          <button style={btn} onClick={() => onNavigate("signup")}>
            Signup
          </button>
        </>
      )}
    </div>
  );
}

const sidebar = {
  width: "200px",
  background: "#f2dede",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

const title = {
  color: "#b71c1c",
  marginBottom: "10px",
};

const btn = {
  width: "100%",
  padding: "8px",
  border: "none",
  background: "white",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
