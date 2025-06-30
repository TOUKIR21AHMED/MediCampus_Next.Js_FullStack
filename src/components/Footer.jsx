import React from "react";
import "./HeaderFooter.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="main-footer"
      style={{
        backgroundColor: "#222222",  // ash black background
        color: "#fff",
        padding: "60px 20px 40px", // more top padding for logo space
        fontSize: "14px",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "30px",
          paddingTop: "50px", // extra padding so content is pushed below logo
        }}
      >
        {/* About Section */}
        <div style={{ flex: "1 1 250px", minWidth: "250px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "18px" }}>About Medcampus</h3>
          <p style={{ lineHeight: "1.5" }}>
            Medcampus is your trusted online pharmacy providing authentic medicines,
            health products, and wellness kits at affordable prices with fast delivery across Bangladesh.
          </p>
          <p style={{ marginTop: "20px", fontSize: "12px", color: "#bbbbbb" }}>
            © 2025 Medcampus. All rights reserved.
          </p>
        </div>

        {/* Terms & Policies Section */}
        <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "18px" }}>Terms & Policies</h3>
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "20px",
              lineHeight: "1.8",
            }}
          >
            <li>
              <a href="/terms" style={{ color: "#bbb", textDecoration: "none" }}>
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy" style={{ color: "#bbb", textDecoration: "none" }}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/refund" style={{ color: "#bbb", textDecoration: "none" }}>
                Refund Policy
              </a>
            </li>
            <li>
              <a href="/shipping" style={{ color: "#bbb", textDecoration: "none" }}>
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="/faq" style={{ color: "#bbb", textDecoration: "none" }}>
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div style={{ flex: "1 1 250px", minWidth: "250px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "18px" }}>Contact Us</h3>
          <p style={{ lineHeight: "1.5" }}>
            <strong>Address:</strong>
            <br />
            PSTU, Dhuki-8602,Patuakhali, Bangladesh
          </p>
          <p style={{ lineHeight: "1.5" }}>
            <strong>Phone:</strong>
            <br />
            +880 1709164091
          </p>
          <p style={{ lineHeight: "1.5" }}>
            <strong>Email:</strong>
            <br />
            support@medcampus.com
          </p>
          <p>
            <a href="/contact" style={{ color: "#bbb", textDecoration: "underline" }}>
              Get in touch
            </a>
          </p>
        </div>
      </div>

     {/* Center Logo */}
  <Link to="/">
<div
  style={{
    position: "absolute",
    top: "0",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#222222",
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
    cursor: "default",
    userSelect: "none",
    color: "white",
    border: "3px solid rgba(230, 237, 237, 0.7)",
    zIndex: 10,
    padding: "5px",
    fontWeight: "bold",
  }}
  title="Medcampus Logo"
>
  <span style={{ fontSize: "28px", lineHeight: 1, marginBottom: "-4px" }}>💊</span>
  <br></br>
  <span style={{ fontSize: "12px", lineHeight: 1, textAlign: "center", marginTop: "2px" }}>
    MediCampus
  </span>
</div>
</Link>


    </footer>
  );
}

export default Footer;
