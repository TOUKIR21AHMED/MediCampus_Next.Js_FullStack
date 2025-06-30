import React from "react";
import { useParams } from "react-router-dom";
import medicines from "../data/medicines";

function MedicineDetails() {
  const { id } = useParams();
  const medicine = medicines.find((m) => m.id === parseInt(id));

  if (!medicine) return <p>Medicine not found</p>;

  return (
    <div className="details">
      <img src={medicine.image} alt={medicine.name} />
      <h2>{medicine.name}</h2>
      <p>{medicine.description}</p>
      <p>Price: ৳{medicine.price}</p>
    </div>
  );
}

export default MedicineDetails;
