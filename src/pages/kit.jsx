import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../components/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";

function KitPage() {
  const [kits, setKits] = useState([]);
  const [filteredKits, setFilteredKits] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "medicines"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      const filtered = data.filter(
        (item) => item.category?.toLowerCase() === "kit"
      );
      setKits(filtered);
      setFilteredKits(filtered);
    } catch (err) {
      setError("Failed to fetch kits.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    if (!item || !item.name) {
      console.error("Invalid product item passed.");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, item];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Search input handler
  const handleSearchChange = (text) => {
    setSearchText(text);

    if (!text.trim()) {
      setFilteredKits(kits);
      return;
    }

    const lower = text.toLowerCase();
    const filtered = kits.filter((item) =>
      item.name.toLowerCase().includes(lower)
    );
    setFilteredKits(filtered);
  };

  // Suggestions for search dropdown (max 5)
  const filteredSuggestionList = kits
    .filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    .slice(0, 5);

  return (
    <>
      <Header
        onSearchChange={handleSearchChange}
        searchSuggestions={filteredSuggestionList}
      />

      <div
        style={{
          padding: "20px",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "30px",
            color: "#2c3e50",
          }}
        >
          All Kits
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>Loading...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        ) : filteredKits.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>
            No kits found matching your search.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              padding: "0 10px",
            }}
          >
            {filteredKits.map((k, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  textAlign: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={k.image}
                  alt={k.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "contain",
                    marginBottom: "15px",
                    borderRadius: "8px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "20px",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  {k.name}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#777",
                    marginBottom: "10px",
                  }}
                >
                  {k.description}
                </p>
                <p style={{ marginBottom: "15px" }}>
                  <span
                    style={{
                      color: "#28a745",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    ৳ {k.price}/{k.unit}
                  </span>{" "}
                  {k.oldPrice && (
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#999",
                        fontSize: "14px",
                        marginLeft: "8px",
                      }}
                    >
                      ৳ {k.oldPrice}
                    </span>
                  )}
                </p>
                <button
                  onClick={() =>
                    addToCart({
                      name: k.name,
                      image: k.image,
                      price: k.price,
                      unit: k.unit,
                    })
                  }
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0056b3")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007bff")
                  }
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default KitPage;
