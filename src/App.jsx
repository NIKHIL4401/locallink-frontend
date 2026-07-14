import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // NEW: Toast Library
import './index.css';

function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      // UPDATED LINK
      const response = await fetch(`https://locallink-backend-whpe.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (!response.ok) return toast.error(data.error); // UPGRADED: Toast
      
      if (isLogin) {
        toast.success("Login successful!");
        onLogin(data.token, data.user);
      } else {
        toast.success("Registration complete! You can now log in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err) { toast.error("Network connection failed."); }
  };

  return (
    <div className="card" style={{ maxWidth: "400px", margin: "60px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        {isLogin ? "Welcome Back" : "Create an Account"}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input required placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="btn btn-primary">
          {isLogin ? "Secure Login" : "Sign Up"}
        </button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} style={{ textAlign: "center", color: "var(--primary-accent)", cursor: "pointer", marginTop: "20px", fontWeight: "500" }}>
        {isLogin ? "No account? Register here." : "Already have an account? Log in."}
      </p>
    </div>
  );
}

function Dashboard({ token, user }) {
  const [communities, setCommunities] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  const fetchCommunities = async () => {
    // UPDATED LINK
    const res = await fetch("https://locallink-backend-whpe.onrender.com/api/communities");
    const data = await res.json();
    setCommunities(data);
  };

  useEffect(() => { fetchCommunities(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    // UPDATED LINK
    const res = await fetch("https://locallink-backend-whpe.onrender.com/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ name, description })
    });
    
    if (res.ok) {
      toast.success("Hub launched successfully!");
      setName(""); setDescription("");
      fetchCommunities();
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
  };

  const handleLike = async (id) => {
    // UPDATED LINK
    const res = await fetch(`https://locallink-backend-whpe.onrender.com/api/communities/${id}/like`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      const updatedCommunity = await res.json();
      setCommunities(communities.map(c => c._id === id ? updatedCommunity : c));
    }
  };

  // NEW: Delete logic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this hub?")) return;
    
    // UPDATED LINK
    const res = await fetch(`https://locallink-backend-whpe.onrender.com/api/communities/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (res.ok) {
      toast.success("Hub deleted permanently.");
      setCommunities(communities.filter(c => c._id !== id));
    } else {
      toast.error("Failed to delete hub.");
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="card" style={{ marginBottom: "40px" }}>
        <h2 style={{ marginTop: 0 }}>Start a New Hub</h2>
        <form onSubmit={handleCreate}>
          <input required placeholder="Hub Name (e.g., React Developers)" value={name} onChange={e => setName(e.target.value)} />
          <textarea required placeholder="What is this hub about?..." value={description} onChange={e => setDescription(e.target.value)} rows="3" />
          <button type="submit" className="btn btn-success">Launch Hub</button>
        </form>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Active Communities</h2>
      </div>

      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search for a community or topic..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="community-grid">
        {filteredCommunities.map(c => {
          const hasLiked = c.likes.includes(user.id);
          const isAuthor = c.author?._id === user.id; // SECURITY: Verify ownership

          return (
            <div key={c._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "22px", color: "var(--primary-accent)" }}>{c.name}</h3>
                
                {/* CONDITIONAL RENDER: Only the author sees the Delete button */}
                {isAuthor && (
                  <button onClick={() => handleDelete(c._id)} className="btn btn-outline" style={{ padding: "4px 8px", fontSize: "12px", color: "#dc3545", borderColor: "#dc3545" }}>
                    🗑️ Delete
                  </button>
                )}
              </div>
              
              <p style={{ margin: "0 0 20px 0", color: "var(--text-secondary)", lineHeight: "1.5" }}>{c.description}</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="timestamp">By {c.author?.username}</span>
                
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <button onClick={() => handleLike(c._id)} className={`like-btn ${hasLiked ? 'liked' : ''}`}>
                    {hasLiked ? '❤️' : '🤍'} {c.likes.length}
                  </button>
                  <Link to={`/community/${c._id}`} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "14px" }}>
                    Enter Hub →
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
        {filteredCommunities.length === 0 && (
          <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>No communities match your search.</p>
        )}
      </div>
    </div>
  );
}

function CommunityHub({ token, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchCommunity = async () => {
    // UPDATED LINK
    const res = await fetch(`https://locallink-backend-whpe.onrender.com/api/communities/${id}`);
    if (res.ok) setCommunity(await res.json());
    else {
      toast.error("Hub not found.");
      navigate("/"); 
    }
  };

  useEffect(() => { fetchCommunity(); }, [id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    // UPDATED LINK
    const res = await fetch(`https://locallink-backend-whpe.onrender.com/api/communities/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ text: commentText })
    });
    if (res.ok) {
      toast.success("Comment posted!");
      setCommentText("");
      fetchCommunity();
    }
  };

  if (!community) return <h3 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h3>;

  return (
    <div>
      <button onClick={() => navigate("/")} className="btn btn-outline" style={{ marginBottom: "20px" }}>
        ← Back to Dashboard
      </button>
      
      <div className="card" style={{ marginBottom: "40px", borderTop: "4px solid var(--primary-accent)" }}>
        <h1 style={{ marginTop: 0, fontSize: "32px" }}>{community.name}</h1>
        <p style={{ fontSize: "18px", lineHeight: "1.6" }}>{community.description}</p>
        <div className="timestamp" style={{ marginTop: "15px" }}>Started by {community.author?.username}</div>
      </div>

      <h3>Live Discussion ({community.comments?.length || 0})</h3>
      
      <form onSubmit={handlePostComment} style={{ display: "flex", gap: "10px", marginBottom: "40px" }}>
        <input 
          required 
          placeholder="Add to the discussion..." 
          value={commentText} 
          onChange={e => setCommentText(e.target.value)} 
          style={{ marginBottom: 0 }}
        />
        <button type="submit" className="btn btn-primary">Post</button>
      </form>

      <div className="community-grid">
        {community.comments?.slice().reverse().map((comment, index) => (
          <div key={index} className="comment-box">
            <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "var(--primary-accent)" }}>
              {comment.author?.username}
            </p>
            <p style={{ margin: 0, lineHeight: "1.5" }}>{comment.text}</p>
            <div className="timestamp">{new Date(comment.createdAt).toLocaleString()}</div>
          </div>
        ))}
        {community.comments?.length === 0 && (
          <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>No comments yet. Be the first to start the discussion!</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast("Logged out successfully.", { icon: '👋' });
  };

  return (
    <BrowserRouter>
      {/* NEW: Global Toaster Component */}
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="brand-logo">LocalLink</Link>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Hello, <b>{user.username}</b></span>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          )}
        </nav>

        {!token ? (
          <AuthScreen onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard token={token} user={user} />} />
            <Route path="/community/:id" element={<CommunityHub token={token} user={user} />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}