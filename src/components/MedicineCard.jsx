import React from "react";
import { useNavigate } from "react-router-dom";

function MedicineCard({ medicine }) {
  const navigate = useNavigate();
  return (
    <div className="card" onClick={() => navigate(`/medicine/${medicine.id}`)}>
      <img src={medicine.image} alt={medicine.name} className="medicine-img" />
      <div className="card-content">
        <h3>{medicine.name}</h3>
        <p>{medicine.description}</p>
        <p className="price">৳{medicine.price}/1</p>
      </div>
    </div>
  );
}

export default MedicineCard;
