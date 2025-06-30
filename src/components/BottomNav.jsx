import React from "react";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";

function BottomNav() {
  return (
    <div className="bottom-nav">
      <button><AiFillHome size={20} /> Home</button>
      <button><AiOutlineUser size={20} /> Profile</button>
    </div>
  );
}

export default BottomNav;
