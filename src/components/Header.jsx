import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import "./HeaderFooter.css";

function Header({ onSearchChange, searchSuggestions = [] }) {
  const [userName, setUserName] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUserName(snap.data().firstName);
        }
      } else {
        setUserName(null);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearchChange && onSearchChange(value);
  };

  const handleSuggestionClick = (name) => {
    setSearchInput(name);
    onSearchChange && onSearchChange(name);
  };

  return (
    <header className="main-header animate-slide">
      <div className="left-group">
        <div className="logo" onClick={() => navigate("/")}>🩺 MediCampus</div>
        <nav className="nav-links">
          <Link to="/">🏠 Home</Link>
          <Link to="/medicine">💊 Medicine</Link>
          <Link to="/Kit">🧰 Kit</Link>
        </nav>
      </div>

      <div className="right-icons">
        <span
          className="icon"
          title="Search"
          onClick={() => setShowSearch(!showSearch)}
        >
          🔍
        </span>
        {showSearch && (
          <div style={{ position: "relative" }}>
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={handleSearchInput}
            />
            {searchInput && searchSuggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto"
                }}
              >
                {searchSuggestions.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => handleSuggestionClick(s.name)}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="cart-icon-wrapper">
          <Link to="/cart" className="icon" title="Cart">🛒</Link>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>

        <span
          className="user-info hover-highlight"
          title="Profile"
          onClick={() => navigate("/Profile")}
        >
          👤
        </span>
        <span
          className="user-info hover-highlight"
          title="SignIn"
          onClick={() => navigate("/SignIn")}
        >
          {userName ? `👋 ${userName} ` : "Sign In"}
        </span>
      </div>
    </header>
  );
}

export default Header;
