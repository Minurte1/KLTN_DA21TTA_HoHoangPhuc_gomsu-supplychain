import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./scss/productSection.module.scss";
import Tooltip from "@mui/material/Tooltip";
import cartServices from "../../services/cartServices";

import { enqueueSnackbar } from "notistack";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { userInfo } = ReduxExportUseAuthState();
  const handleClick = () => {
    navigate(`/product-details/${product.SERIAL_CODE}`);
  };

  const handleAddToCart = async (product) => {
    if (!userInfo)
      return enqueueSnackbar("Bạn cần đăng nhập!", { variant: "warning" });

    const userId = userInfo?.ID_USERS;

    try {
      await cartServices.createCart({
        ID_PRODUCT_INSTANCE: product.ID_PRODUCT_INSTANCE,
        ID_USERS: userId,
        ID_COMPANY: product.ID_COMPANY,
        QUANTITY: 1,
        CREATED_AT_CART: new Date().toISOString(),
      });

      enqueueSnackbar("Đã thêm vào giỏ hàng!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Lỗi khi thêm sản phẩm vào giỏ hàng.", {
        variant: "error",
      });
    }
  };
  return (
    <div
      className={styles["product-card"]}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {/* Logo công ty */}
      {product.AVATAR && (
        <Tooltip title={product.NAME_COMPANY || "Tên công ty"} arrow>
          <img
            src={product.AVATAR}
            alt={product.NAME_COMPANY || "Logo công ty"}
            className={styles["company-logo"]}
          />
        </Tooltip>
      )}

      <img
        src={product.IMAGE_URL_PRODUCTS}
        alt={product.NAME_PRODUCTS}
        className={styles["product-img"]}
      />
      <h3 className={styles["product-name"]}>{product.NAME_PRODUCTS}</h3>

      <div className={styles["product-price"]}>
        {product.PRICE_PRODUCTS.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </div>
      <div className={styles["product-category"]}>
        {product.NAME_CATEGORIES_}
      </div>
      {/* <div className={styles["product-serial"]}>
        {product.DESCRIPTION_PRODUCTS}
      </div> */}

      {/* 🔘 Nút thêm vào giỏ hàng */}
      <button
        className={styles["add-to-cart"]}
        onClick={(e) => {
          e.stopPropagation(); // tránh trigger navigate khi bấm "+"
          handleAddToCart(product);
        }}
      >
        +
      </button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    IMAGE_URL_PRODUCTS: PropTypes.string.isRequired,
    NAME_PRODUCTS: PropTypes.string.isRequired,
    DESCRIPTION_PRODUCTS: PropTypes.string.isRequired,
    PRICE_PRODUCTS: PropTypes.number.isRequired,

    NAME_CATEGORIES_: PropTypes.string.isRequired,
    SERIAL_CODE: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCard;
