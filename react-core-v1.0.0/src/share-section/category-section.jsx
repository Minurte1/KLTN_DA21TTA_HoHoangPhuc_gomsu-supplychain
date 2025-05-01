// src/components/CategorySection.jsx
import React from "react";

const mockCategories = [
  { id: 1, name: "Đồng hồ nam" },
  { id: 2, name: "Đồng hồ nữ" },
  { id: 3, name: "Thể thao" },
];

const CategorySection = () => {
  return (
    <div style={{ margin: "40px auto", maxWidth: 1200, padding: "0 20px" }}>
      <h2 style={{ fontSize: 24, marginBottom: 20 }}>Danh mục</h2>
      <div style={{ display: "flex", gap: 20 }}>
        {mockCategories.map((cate) => (
          <div
            key={cate.id}
            style={{
              border: "1px solid #ccc",
              padding: "20px 30px",
              borderRadius: 5,
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
            }}
          >
            {cate.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
