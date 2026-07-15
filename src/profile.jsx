import { useState, useEffect } from "react";

function Profile({ token }) {
  // 1. Setup state for all the profile fields
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [university, setUniversity] = useState("");
  const [city, setCity] = useState("");
  const [usState, setUsState] = useState(""); // Named usState to avoid React reserved word conflicts
  const [message, setMessage] = useState("");

  // 2. The exact same array we used in the backend
  const indianStates = [
    "", "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
    "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", 
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
    "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
    "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  // 3. Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Updating profile...");

    try {
      const response = await fetch("https://locallink-backend-whpe.onrender.com/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Securely identifying the user
        },
        body: JSON.stringify({ 
          bio, 
          title, 
          university, 
          city, 
          state: usState 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to update profile.");
      } else {
        setMessage("Profile updated successfully!");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Profile</h2>
      
      {message && <p style={{ textAlign: "center", color: "var(--primary-accent)" }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <div>
          <label>Professional Title</label>
          <input 
            type="text" 
            placeholder="e.g., B.Tech CSE Student or Student Executive" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        <div>
          <label>University</label>
          <input 
            type="text" 
            placeholder="e.g., MBM University" 
            value={university} 
            onChange={(e) => setUniversity(e.target.value)} 
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>City</label>
            <input 
              type="text" 
              placeholder="e.g., Jodhpur" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>State</label>
            <select 
              value={usState} 
              onChange={(e) => setUsState(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
            >
              <option value="" disabled>Select a state...</option>
              {indianStates.filter(s => s !== "").map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label>Bio</label>
          <textarea 
            placeholder="Tell the community about your technical stack and interests..." 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            rows="4"
            style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: "10px" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;