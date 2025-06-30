import React from "react";

function CategoryFilter({ selected, onChange }) {
  const categories = ["All", "Medicine", "Kit"];
  return (
    <select value={selected} onChange={(e) => onChange(e.target.value)}>
      {categories.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
}

export default CategoryFilter;
