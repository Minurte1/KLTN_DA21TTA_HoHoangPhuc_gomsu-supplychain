// src/components/ProductSection.jsx
import React from "react";
import PropTypes from "prop-types";
ư;
import "./ProductSection.css";

const ProductSection = ({ products }) => {
  return (
    <div className="section-container">
      <h2 className="section-title">Sản phẩm nổi bật</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

ProductSection.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProductSection;
