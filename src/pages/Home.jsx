import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db, collection, getDocs } from "../components/firebase";
import "../styles.css";

import carousel1 from "./carousel1.png";
import carousel2 from "./carousel2.png";
import carousel3 from "./carousel3.png";
import carousel4 from "./carousel4.png";

function Home() {
  const navigate = useNavigate();

  const [firebaseMedicines, setFirebaseMedicines] = useState([]);
  const [firebaseKits, setFirebaseKits] = useState([]);
  const [firebasePopular, setFirebasePopular] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [filteredKits, setFilteredKits] = useState([]);
  const [filteredPopular, setFilteredPopular] = useState([]);

  // For suggestion dropdown (combine all products for suggestions)
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 0,
      offset: 0,
      once: true,
      disable: "mobile",
    });

    fetchFirebaseData();
  }, []);

  const fetchFirebaseData = async () => {
    const querySnapshot = await getDocs(collection(db, "medicines"));
    const data = querySnapshot.docs.map((doc) => doc.data());

    const medicineItems = data.filter(
      (item) => item.category?.toLowerCase() === "medicine"
    );
    const kitItems = data.filter(
      (item) => item.category?.toLowerCase() === "kit"
    );

    setFirebaseMedicines(medicineItems.slice(0, 10));
    setFirebaseKits(kitItems.slice(0, 10));
    setFirebasePopular(data.slice(0, 10));

    // Initialize filtered with full data
    setFilteredMedicines(medicineItems.slice(0, 10));
    setFilteredKits(kitItems.slice(0, 10));
    setFilteredPopular(data.slice(0, 10));
    setAllProducts(data); // for search suggestions
  };

  const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, item];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated")); // notify Header
  };

  // Handle search input from Header
  const handleSearchChange = (text) => {
    setSearchText(text);

    if (!text.trim()) {
      // Reset to original filtered sets
      setFilteredMedicines(firebaseMedicines);
      setFilteredKits(firebaseKits);
      setFilteredPopular(firebasePopular);
      return;
    }

    const lower = text.toLowerCase();

    // Filter medicine, kits, popular separately by name includes search text
    setFilteredMedicines(
      firebaseMedicines.filter((item) =>
        item.name.toLowerCase().includes(lower)
      )
    );
    setFilteredKits(
      firebaseKits.filter((item) => item.name.toLowerCase().includes(lower))
    );
    setFilteredPopular(
      firebasePopular.filter((item) =>
        item.name.toLowerCase().includes(lower)
      )
    );
  };

  // Suggestions list: limit to 5 matching items from allProducts
  const filteredSuggestionList = allProducts
    .filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    .slice(0, 5);

  return (
    <>
      <Header
        onSearchChange={handleSearchChange}
        searchSuggestions={filteredSuggestionList}
      />

      <div className="home-container">
        {/* Carousel */}
        <div className="carousel-container" data-aos="fade-in">
          <div className="carousel">
            <div className="slides">
              <img src={carousel1} alt="Slide 1" />
              <img src={carousel2} alt="Slide 2" />
              <img src={carousel3} alt="Slide 3" />
              <img src={carousel4} alt="Slide 4" />
            </div>
          </div>
        </div>

        {/* Firebase Medicine Section */}
        <section className="section" data-aos="fade-up">
          <div className="section-header">
            <h2>Medicine</h2>
            <button onClick={() => navigate("/medicine")}>
              Show More
            </button>
          </div>
          <div className="product-slider">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((m, index) => (
                <div className="product-card" key={index}>
                  <img src={m.image} alt={m.name} />
                  <h4>{m.name}</h4>
                  <p>{m.description}</p>
                  <p className="price">
                    <span className="current">
                      ৳ {m.price}/{m.unit}
                    </span>{" "}
                    {m.oldPrice && <span className="old">৳ {m.oldPrice}</span>}
                  </p>
                  <button
                    className="add-to-cart"
                    onClick={() =>
                      addToCart({
                        name: m.name,
                        image: m.image,
                        price: m.price,
                        unit: m.unit,
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No medicines found matching your search.</p>
            )}
          </div>
        </section>

        {/* Firebase Kit Section */}
        <section className="section" data-aos="fade-up">
          <div className="section-header">
            <h2>Kit</h2>
            <button onClick={() => navigate("/kit")}>Show More</button>
          </div>
          <div className="product-slider">
            {filteredKits.length > 0 ? (
              filteredKits.map((k, index) => (
                <div className="product-card" key={index}>
                  <img src={k.image} alt={k.name} />
                  <h4>{k.name}</h4>
                  <p>{k.description}</p>
                  <p className="price">
                    <span className="current">
                      ৳ {k.price}/{k.unit}
                    </span>{" "}
                    {k.oldPrice && <span className="old">৳ {k.oldPrice}</span>}
                  </p>
                  <button
                    className="add-to-cart"
                    onClick={() =>
                      addToCart({
                        name: k.name,
                        image: k.image,
                        price: k.price,
                        unit: k.unit,
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No kits found matching your search.</p>
            )}
          </div>
        </section>

        {/* Firebase Most Saled Section */}
        <section className="section" data-aos="fade-up">
          <div className="section-header">
            <h2>Most Saled</h2>
            {/* <button onClick={() => navigate("/category/Medicine")}>
              Show More
            </button> */}
          </div>
          <div className="product-slider">
            {filteredPopular.length > 0 ? (
              filteredPopular.map((p, index) => (
                <div className="product-card" key={index}>
                  <img src={p.image} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                  <p className="price">
                    <span className="current">
                      ৳ {p.price}/{p.unit}
                    </span>{" "}
                    {p.oldPrice && <span className="old">৳ {p.oldPrice}</span>}
                  </p>
                  <button
                    className="add-to-cart"
                    onClick={() =>
                      addToCart({
                        name: p.name,
                        image: p.image,
                        price: p.price,
                        unit: p.unit,
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No popular products found matching your search.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Home;
