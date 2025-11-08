import React, { useState } from "react";

export default function Login({ onLogin, onSwitchToSignup }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    const fd = new FormData();
    fd.append("username", user); // ✅ must match FastAPI's form field name
    fd.append("password", password);

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        // backend validation errors (like from Pydantic or HTTPException)
        if (Array.isArray(data.detail)) {
          const msg = data.detail.map((e) => e.msg).join(", ");
          setErr(msg);
        } else if (data.detail) {
          setErr(data.detail);
        } else {
          setErr("Login failed");
        }
        return;
      }

      // ✅ success: now send username & profile photo to parent (App.js)
      onLogin(data.token, data.username, data.profile_photo);
    } catch (error) {
      setErr("Network error");
    }
  }

  return (
    <div style={outer}>
      <div style={card}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>Login</h2>

        <form onSubmit={submit}>
          <input
            style={input}
            placeholder="Username or Email"
            value={user}
            onChange={(e) => setUser(e.target.value)}
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

          <button type="submit" style={button}>
            Login
          </button>

          {err && (
            <div style={{ color: "yellow", marginTop: "10px" }}>
              {typeof err === "string" ? err : JSON.stringify(err)}
            </div>
          )}
        </form>

        <div style={{ color: "white", marginTop: "10px" }}>
          Don’t have an account?{" "}
          <span
            onClick={onSwitchToSignup}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Sign Up
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
  background: "linear-gradient(120deg, #1e3c72, #2a5298)",
};

const card = {
  background: "linear-gradient(135deg, #4158d0, #c850c0)",
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
