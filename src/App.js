import React from "react";
import 'aos/dist/aos.css';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MedicineDetails from "./pages/MedicineDetails";
import Cart from "./pages/cart";
import Medicine from "./pages/medicine";
import Kit from "./pages/kit";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/medicine" element={<Medicine />} />
      <Route path="/kit" element={<Kit />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/medicine/:id" element={<MedicineDetails />} />
    </Routes>
  );
}

export default App;
