import React, { useState } from "react";

export default function Signup({ onSignup, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    const fd = new FormData();
    fd.append("username", username);
    fd.append("email", email);
    fd.append("password", password);
    if (file) fd.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.detail) setErr(data.detail);
        else setErr("Signup failed");
        return;
      }

      // ✅ Send all user info to parent App.js
      onSignup(data.token, data.username, data.profile_photo);
    } catch {
      setErr("Network error");
    }
  }

  return (
    <div style={outer}>
      <div style={card}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>Sign Up</h2>
        <form onSubmit={submit}>
          <input
            style={input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            style={input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label style={{ color: "white", fontSize: 14 }}>
            Profile photo (0–2MB)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              ...input,
              background: "white",
              color: "#333",
              border: "none",
            }}
          />

          <button type="submit" style={button}>
            Sign Up
          </button>

          {err && (
            <div style={{ color: "yellow", marginTop: "10px" }}>{err}</div>
          )}
        </form>

        <div style={{ color: "white", marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            onClick={onSwitchToLogin}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

const outer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh",
  background: "linear-gradient(120deg, #c850c0, #4158d0)",
};

const card = {
  background: "linear-gradient(135deg, #c850c0, #4158d0)",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  width: "350px",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "none",
  outline: "none",
};

const button = {
  width: "100%",
  padding: "10px",
  background: "#fff",
  borderRadius: "6px",
  color: "#333",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: "10px",
};
