import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./scss/productSection.module.scss";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product-details/${product.SERIAL_CODE}`);
  };

  return (
    <div
      className={styles["product-card"]}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={product.IMAGE_URL_PRODUCTS}
        alt={product.NAME_PRODUCTS}
        className={styles["product-img"]}
      />
      <h3 className={styles["product-name"]}>{product.NAME_PRODUCTS}</h3>
      <p className={styles["product-description"]}>
        {product.DESCRIPTION_PRODUCTS}
      </p>
      <div className={styles["product-price"]}>
        {product.PRICE_PRODUCTS.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </div>
      {/* <div className={styles["product-stock"]}>
        {product.STOCK_PRODUCTS > 0
          ? `Còn hàng: ${product.STOCK_PRODUCTS}`
          : "Hết hàng"}
      </div> */}
      <div className={styles["product-category"]}>
        {product.NAME_CATEGORIES_}
      </div>
      <div className={styles["product-serial"]}>
        Mã sản phẩm: {product.SERIAL_CODE}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    IMAGE_URL_PRODUCTS: PropTypes.string.isRequired,
    NAME_PRODUCTS: PropTypes.string.isRequired,
    DESCRIPTION_PRODUCTS: PropTypes.string.isRequired,
    PRICE_PRODUCTS: PropTypes.number.isRequired,
    // STOCK_PRODUCTS: PropTypes.number.isRequired,
    NAME_CATEGORIES_: PropTypes.string.isRequired,
    SERIAL_CODE: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
