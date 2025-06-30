import React, { useState, useEffect } from "react";
import { auth, db } from "../components/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(auth.currentUser);
  const uid = user?.uid;

  // Listen for auth state changes so user updates on sign in/out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const [activeTab, setActiveTab] = useState("profile"); // "profile", "orders", "password"
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Password change form states
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    if (!uid) {
      setProfileData(null);
      return;
    }
    async function fetchProfile() {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      } else {
        setProfileData(null);
      }
    }
    fetchProfile();
  }, [uid]);

  useEffect(() => {
    if (activeTab !== "orders" || !uid) return;

    async function fetchOrders() {
      setLoadingOrders(true);
      const ordersCol = collection(db, "profile", uid, "orders");
      const q = query(ordersCol, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const userOrders = [];
      querySnapshot.forEach((doc) =>
        userOrders.push({ id: doc.id, ...doc.data() })
      );
      setOrders(userOrders);
      setLoadingOrders(false);
    }

    fetchOrders();
  }, [activeTab, uid]);

  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      toast.error("Please fill all password fields");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (!user || !user.email) {
      toast.error("No authenticated user");
      return;
    }

    setChangingPass(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPass);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPass);
      toast.success("Password changed successfully!");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (error) {
      toast.error("Failed to change password: " + error.message);
    }
    setChangingPass(false);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // Login button handler (redirect to signin)
  const handleLogin = () => {
    navigate("/signin");
  };

  const sidebarButtonStyle = (selected) => ({
    padding: "15px 25px",
    cursor: "pointer",
    border: "none",
    background: selected ? "#4f46e5" : "transparent",
    color: selected ? "white" : "#333",
    fontWeight: selected ? "700" : "500",
    fontSize: "16px",
    borderLeft: selected ? "5px solid #6366f1" : "5px solid transparent",
    textAlign: "left",
    width: "100%",
  });

  const containerStyle = {
    display: "flex",
    
    minHeight: "90vh",
    maxWidth: "3000px",
    margin: "30px auto",
    background: "white",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    overflow: "hidden",
  };

  const sidebarStyle = {
    width: "220px",
    background: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #ddd",
    justifyContent: "space-between",
  };

  const sidebarTopStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const contentStyle = {
    flex: 1,
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div style={containerStyle}>
        <nav style={sidebarStyle}>
          <div style={sidebarTopStyle}>
            <button
              style={sidebarButtonStyle(activeTab === "profile")}
              onClick={() => setActiveTab("profile")}
              disabled={!user}
              title={!user ? "Please log in to view profile" : ""}
            >
              My Profile
            </button>
            <button
              style={sidebarButtonStyle(activeTab === "orders")}
              onClick={() => setActiveTab("orders")}
              disabled={!user}
              title={!user ? "Please log in to view orders" : ""}
            >
              My Orders
            </button>
            <button
              style={sidebarButtonStyle(activeTab === "password")}
              onClick={() => setActiveTab("password")}
              disabled={!user}
              title={!user ? "Please log in to change password" : ""}
            >
              Password Setting
            </button>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              style={{
                padding: "15px 25px",
                cursor: "pointer",
                border: "none",
                background: "#b91c1c",
                color: "white",
                fontWeight: "700",
                fontSize: "16px",
                borderLeft: "5px #AE56E8",
                textAlign: "left",
                width: "100%",
                marginBottom: "50px",
              }}
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={handleLogin}
              style={{
                padding: "15px 25px",
                cursor: "pointer",
                border: "none",
                background: "#4f46e5",
                color: "white",
                fontWeight: "700",
                fontSize: "16px",
                borderLeft: "5px #AE56E8",
                textAlign: "left",
                width: "100%",
                marginBottom: "50px",
              }}
            >
              Log In
            </button>
          )}
        </nav>

        <section style={contentStyle}>
          {activeTab === "profile" && (
            <>
              <h2 style={{ marginBottom: "20px" }}>My Profile</h2>
              {profileData ? (
                <div style={{ lineHeight: "1.8", fontSize: "18px" }}>
                  <p>
                    <strong>Name:</strong>{" "}
                    {profileData.firstName || profileData.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Age:</strong> {profileData.age || "N/A"}
                  </p>
                  <p>
                    <strong>Gender:</strong> {profileData.gender || "N/A"}
                  </p>
                </div>
              ) : (
                <p>No profile data found.</p>
              )}
            </>
          )}

          {activeTab === "orders" && (
            <>
              <h2 style={{ marginBottom: "20px" }}>My Orders</h2>
              {loadingOrders ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      padding: "15px",
                      marginBottom: "15px",
                      borderRadius: "10px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      background: "#fafafa",
                    }}
                  >
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {order.createdAt?.toDate
                        ? order.createdAt.toDate().toLocaleString()
                        : new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Payment Method:</strong> {order.paymentMethod}
                    </p>
                    <p>
                      <strong>Total:</strong> {order.total}৳
                    </p>
                    <p>
                      <strong>Items:</strong>
                    </p>
                    <ul style={{ marginLeft: "20px" }}>
                      {order.cart?.map((item, i) => (
                        <li key={i}>
                          {item.name} x {item.quantity} - {item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "password" && (
            <>
              <h2 style={{ marginBottom: "20px" }}>Change Password</h2>
              <div style={{ maxWidth: "400px" }}>
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                  disabled={!user}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                  disabled={!user}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "20px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                  disabled={!user}
                />
                <button
                  onClick={handleChangePassword}
                  disabled={changingPass || !user}
                  style={{
                    padding: "12px 25px",
                    background: "#4f46e5",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: changingPass || !user ? "not-allowed" : "pointer",
                    opacity: changingPass || !user ? 0.7 : 1,
                    transition: "background-color 0.3s ease",
                  }}
                  title={!user ? "Please log in to change password" : ""}
                >
                  {changingPass ? "Changing..." : "Change Password"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
