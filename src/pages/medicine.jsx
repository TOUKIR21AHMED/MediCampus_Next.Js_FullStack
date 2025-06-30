import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../components/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MedicinePage() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "medicines"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      const filtered = data.filter(
        (item) => item.category?.toLowerCase() === "medicine"
      );
      setMedicines(filtered);
      setFilteredMedicines(filtered);
    } catch (err) {
      setError("Failed to fetch medicines.");
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

  // Search input handler from Header
  const handleSearchChange = (text) => {
    setSearchText(text);

    if (!text.trim()) {
      setFilteredMedicines(medicines);
      return;
    }

    const lower = text.toLowerCase();
    const filtered = medicines.filter((item) =>
      item.name.toLowerCase().includes(lower)
    );
    setFilteredMedicines(filtered);
  };

  // Suggestions for search dropdown (max 5)
  const filteredSuggestionList = medicines
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
          All Medicines
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>Loading...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        ) : filteredMedicines.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>
            No medicine found matching your search.
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
            {filteredMedicines.map((m, index) => (
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
                  src={m.image}
                  alt={m.name}
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
                  {m.name}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#777",
                    marginBottom: "10px",
                  }}
                >
                  {m.description}
                </p>
                <p style={{ marginBottom: "15px" }}>
                  <span
                    style={{
                      color: "#28a745",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    ৳ {m.price}/{m.unit}
                  </span>{" "}
                  {m.oldPrice && (
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#999",
                        fontSize: "14px",
                        marginLeft: "8px",
                      }}
                    >
                      ৳ {m.oldPrice}
                    </span>
                  )}
                </p>
                <button
                  onClick={() =>
                    addToCart({
                      name: m.name,
                      image: m.image,
                      price: m.price,
                      unit: m.unit,
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

export default MedicinePage;
