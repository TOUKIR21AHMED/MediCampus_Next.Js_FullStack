import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../components/firebase"; // make sure auth is imported
import { collection, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const deliveryCharge = 100;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCart(updatedCart);
    updateSubtotal(updatedCart);
  }, []);

  const extractPrice = (price) =>
    parseFloat(price.toString().replace(/[^\d.]/g, "")) || 0;

  const updateSubtotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + extractPrice(item.price) * item.quantity,
      0
    );
    setSubtotal(total);
  };

  const handleQuantityChange = (index, qty) => {
    const updated = [...cart];
    updated[index].quantity = qty;
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    updateSubtotal(updated);
  };

  const handleRemove = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    localStorage.setItem("cartCount", updated.length);
    window.dispatchEvent(new Event("cartUpdated"));
    updateSubtotal(updated);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name required";
    if (!formData.email.trim()) errs.email = "Email required";
    if (!formData.phone.trim()) errs.phone = "Phone required";
    if (!formData.address.trim()) errs.address = "Address required";
    if (!paymentMethod) errs.payment = "Select a payment method";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrder = async () => {
  if (!validate()) return toast.error("Please fill all fields!");

  try {
    const user = auth.currentUser;

    // Always save in orders collection
    await addDoc(collection(db, "orders"), {
      ...formData,
      cart,
      subtotal,
      total: subtotal + deliveryCharge,
      paymentMethod,
      createdAt: new Date(),
    });

    // If user logged in → ALSO save in profile/{uid}/orders
    if (user) {
      const userOrdersRef = collection(db, "profile", user.uid, "orders");
      await addDoc(userOrdersRef, {
        ...formData,
        cart,
        subtotal,
        total: subtotal + deliveryCharge,
        paymentMethod,
        createdAt: new Date(),
      });
    }

    toast.success("Thanks for your purchase!");
    localStorage.removeItem("cart");
    setTimeout(() => navigate("/"), 2000);
  } catch (err) {
    console.error(err);
    toast.error("Failed to place order. Try again.");
  }
};


  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          padding: "30px",
          background: "linear-gradient(to right top, #dfe9f3, #ffffff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        <ToastContainer />

        {/* Billing Info */}
        <div
          style={{
            flex: "1",
            maxWidth: "500px",
            padding: "30px",
            borderRadius: "20px",
            background: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Billing Details</h2>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            style={inputStyle(errors.name)}
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style={inputStyle(errors.email)}
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            style={inputStyle(errors.phone)}
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Shipping Address"
            style={{ ...inputStyle(errors.address), height: "80px" }}
          ></textarea>

          <h4 style={{ marginTop: "20px" }}>Payment Method</h4>
          <div style={{ marginBottom: "20px" }}>
            <label>
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="payment"
                value="bKash"
                checked={paymentMethod === "bKash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              bKash
            </label>
            {errors.payment && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.payment}</p>
            )}
          </div>
          <button
            onClick={handleOrder}
            style={{
              padding: "12px 25px",
              background: "#4f46e5",
              color: "white",
              borderRadius: "10px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
          >
            Place Order
          </button>
        </div>

        {/* Cart Items */}
        <div
          style={{
            flex: "1",
            minWidth: "320px",
            padding: "30px",
            borderRadius: "20px",
            background: "#f9fafb",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  padding: "10px",
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 5px 10px rgba(0,0,0,0.05)",
                  gap: "15px",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
                <div style={{ flex: "1" }}>
                  <p style={{ margin: "0", fontWeight: "600" }}>{item.name}</p>
                  <p style={{ margin: "5px 0" }}>
                    Price: {extractPrice(item.price)}৳
                  </p>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                    style={{
                      width: "60px",
                      padding: "5px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  style={{
                    background: "red",
                    color: "#fff",
                    border: "none",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              </div>
            ))
          )}

          {/* Totals */}
          <div style={{ marginTop: "30px" }}>
            <p>
              Subtotal: <strong>{subtotal}৳</strong>
            </p>
            <p>
              Delivery: <strong>{deliveryCharge}৳</strong>
            </p>
            <p>
              Total: <strong>{subtotal + deliveryCharge}৳</strong>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

const inputStyle = (error) => ({
  width: "100%",
  padding: "10px 14px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: `2px solid ${error ? "red" : "#ddd"}`,
  background: "#f9f9f9",
});

const extractPrice = (price) =>
  parseFloat(price.toString().replace(/[^\d.]/g, "")) || 0;
