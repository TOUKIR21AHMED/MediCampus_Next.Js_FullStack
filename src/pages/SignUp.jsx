import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../components/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter an email first.");
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    try {
     
      const response = await fetch(
        "https://send-otp-smtp-server.onrender.com/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: newOtp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "OTP sent successfully!");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setIsOtpVerified(true);
      toast.success("OTP verified!");
    } else {
      toast.error("Incorrect OTP");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      toast.error("Verify OTP first.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        firstName: fname,
        lastName: lname,
        phone,
        gender,
        age,
      });
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
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
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "20px",
      width: "100%",
      maxWidth: "500px",
      textAlign: "center",
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
    },
    button: {
      padding: "12px",
      background: "#667eea",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    link: {
      marginTop: "15px",
    },
  };

  return (
    <>
      <Header />
    <div style={styles.page}>
      <div style={styles.box}>
        <h2>Create Account</h2>
        <form style={styles.form} onSubmit={handleSignUp}>
          

          <input
            type="text"
            placeholder="First Name"
            style={styles.input}
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            // disabled={!isOtpVerified}
            // required={isOtpVerified}
          />
          <input
            type="text"
            placeholder="Last Name"
            style={styles.input}
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            // disabled={!isOtpVerified}
          />
          <input
            type="tel"
            placeholder="Phone"
            style={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            // disabled={!isOtpVerified}
            // required={isOtpVerified}
          />
          <input
  type="email"
  placeholder="Email"
  style={styles.input}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  disabled={isOtpVerified}
/>

{!isOtpVerified && (
  <>
    <button
      type="button"
      style={styles.button}
      onClick={sendOtp}
    >
      Send OTP
    </button>
    <input
      type="text"
      placeholder="Enter OTP"
      style={styles.input}
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
    <button
      type="button"
      style={styles.button}
      onClick={verifyOtp}
    >
      Verify OTP
    </button>
  </>
)}

          <select
            style={styles.input}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={!isOtpVerified}
            required={isOtpVerified}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Age"
            style={styles.input}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={!isOtpVerified}
            required={isOtpVerified}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isOtpVerified}
            required={isOtpVerified}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!isOtpVerified}
            required={isOtpVerified}
          />
          <button type="submit" style={styles.button} disabled={!isOtpVerified}>
            Sign Up
          </button>
        </form>
        <div style={styles.link}>
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
        <ToastContainer />
      </div>
    </div>
    <Footer />
    </>
  );
}
