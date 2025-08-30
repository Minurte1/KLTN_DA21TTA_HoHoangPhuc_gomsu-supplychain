import React from "react";
import PropTypes from "prop-types";

import styles from "./scss/productList.module.scss";
import ProductCard from "./section/product-section";

const ProductList = ({
  products,
  ProductComponent = ProductCard,
  itemsPerRow = 5,
  rows = 2,
}) => {
  // Tính số lượng sản phẩm hiển thị max
  const maxItems = itemsPerRow * rows;

  // Lấy sản phẩm cần hiển thị
  const displayProducts = products.slice(0, maxItems);
  const gridStyle = {
    gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
  };

  return (
    <div className={styles["product-list"]} style={gridStyle}>
      {displayProducts.map((product) => (
        <ProductComponent
          key={product.ID_PRODUCT_INSTANCE || product.id}
          product={product}
        />
      ))}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  ProductComponent: PropTypes.elementType,
  itemsPerRow: PropTypes.number,
  rows: PropTypes.number,
};

export default ProductList;
