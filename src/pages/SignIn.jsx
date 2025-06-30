import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!", { position: "top-center" });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(to right, #667eea, #764ba2)",
      padding: "20px",
    },
    box: {
      backgroundColor: "white",
      padding: "40px 30px",
      borderRadius: "20px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
      boxSizing: "border-box",
      textAlign: "center",
    },
    title: {
      marginBottom: "20px",
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none",
    },
    button: {
      padding: "12px",
      background: "#667eea",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
    },
    linkText: {
      marginTop: "15px",
      fontSize: "14px",
    },
    link: {
      color: "#667eea",
      fontWeight: "500",
      textDecoration: "none",
      marginLeft: "5px",
    },
  };

  return (
    <>
      <Header />
    <div style={styles.page}>
      <div style={styles.box}>
        <h2 style={styles.title}>Sign In</h2>
        <form style={styles.form} onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            style={styles.input}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            style={styles.input}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
        <p style={styles.linkText}>
          Don't have an account?
          <Link to="/signup" style={styles.link}>
            Create Account
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
    <Footer />
    </>
  );
}

export default SignIn;
