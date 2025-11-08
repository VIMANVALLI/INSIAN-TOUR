import React, { useState } from "react";

export default function AddPlace({ token, onDone }) {
  const [name, setName] = useState("");
  const [stateName, setStateName] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState(null);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const statesList = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh",
  ];

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (!token) {
      setErr("Login required");
      return;
    }
    if (!stateName) {
      setErr("Please select a state");
      return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("state", stateName);
    fd.append("description", desc);
    fd.append("token", token);

    // ✅ Append multiple files
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        fd.append("files", files[i]); // backend expects 'files'
      }
    }

    // ✅ Debug: check files before sending
    for (let pair of fd.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await fetch("http://localhost:8000/places", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.detail || "Failed to add place");
      } else {
        setSuccess(`✅ Place added successfully to ${stateName}!`);
        setName("");
        setDesc("");
        setFiles(null);
        setStateName("");
        onDone && onDone(stateName);
      }
    } catch (err) {
      console.error(err);
      setErr("Network error");
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "80vh" }}>
      <div style={card}>
        <h2 style={{ color: "white", marginBottom: "15px" }}>Add New Place</h2>
        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Place Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={input}
          />

          {/* State dropdown */}
          <select
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            style={input}
            required
          >
            <option value="">Select State</option>
            {statesList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ ...input, height: "80px" }}
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            style={input}
          />

          <button type="submit" style={button}>
            Add Place
          </button>

          {err && <div style={{ color: "yellow", marginTop: "10px" }}>{err}</div>}
          {success && (
            <div style={{ color: "#00ff99", marginTop: "10px" }}>{success}</div>
          )}
        </form>
      </div>
    </div>
  );
}

const card = {
  background: "linear-gradient(135deg, #ff9966, #ff5e62)",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  width: "400px",
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
  ...input,
  background: "#fff",
  color: "#333",
  cursor: "pointer",
  fontWeight: "bold",
};
