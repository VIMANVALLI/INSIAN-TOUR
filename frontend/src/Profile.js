import React from "react";

export default function Profile({ user }) {
  if (!user) {
    return (
      <div style={box}>
        <h2>Please login to view your profile</h2>
      </div>
    );
  }

  return (
    <div style={box}>
      <h1 style={{ color: "#e53935" }}>Your Profile</h1>
      {user.profile_photo && (
        <img
          src={`http://localhost:8000/uploads/${user.profile_photo}`}
          alt="Profile"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #e53935",
            marginBottom: "20px",
          }}
        />
      )}
      <h3>👤 Username: {user.username}</h3>
      <p>🔑 Token: {user.token?.slice(0, 10)}...</p>
    </div>
  );
}

const box = {
  textAlign: "center",
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  marginTop: "30px",
  width: "400px",
  marginLeft: "auto",
  marginRight: "auto",
};
