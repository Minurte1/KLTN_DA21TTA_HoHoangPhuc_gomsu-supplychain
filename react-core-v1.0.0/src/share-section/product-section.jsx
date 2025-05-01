// src/components/ProductSection.jsx
import React from "react";
import "./ProductSection.css"; // Tạo file CSS nếu muốn tách riêng style

const mockProducts = [
  {
    id: 1,
    name: "Đồng hồ nam cao cấp",
    price: 5000000,
    image: "/images/watch1.jpg",
  },
  {
    id: 2,
    name: "Đồng hồ nữ thời trang",
    price: 3000000,
    image: "/images/watch2.jpg",
  },
];

const ProductSection = () => {
  return (
    <div className="section-container">
      <h2 className="section-title">Sản phẩm nổi bật</h2>
      <div className="product-grid">
        {mockProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-img"
            />
            <h3>{product.name}</h3>
            <p className="product-price">{product.price.toLocaleString()} đ</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
