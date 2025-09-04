import React, { useState } from "react";
import PropTypes from "prop-types";
import { Pagination } from "@mui/material";

import styles from "./scss/productList.module.scss";
import ProductCard from "./section/product-section";

const ProductList = ({
  products = [], // ✅ mặc định mảng rỗng
  ProductComponent = ProductCard,
  itemsPerPage = 10, // mỗi trang bao nhiêu sản phẩm
  itemsPerRow = 5,
}) => {
  const [page, setPage] = useState(1);

  // tổng số trang
  const pageCount = Math.ceil(products.length / itemsPerPage);

  // dữ liệu hiển thị cho page hiện tại
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayProducts = products.slice(startIndex, endIndex);

  const gridStyle = {
    gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <div className={styles["product-list"]} style={gridStyle}>
        {displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <ProductComponent
              key={product.ID_PRODUCT_INSTANCE || product.id}
              product={product}
            />
          ))
        ) : (
          <p className={styles["no-data"]}>Không có sản phẩm</p>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className={styles["pagination-container"]}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
            className={styles["custom-pagination"]}
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "50%", // hình tròn
                color: "#8b5e3c",
                border: "1px solid #8b5e3c",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#8b5e3c",
                color: "#fff",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "rgba(139, 94, 60, 0.1)",
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  ProductComponent: PropTypes.elementType,
  itemsPerPage: PropTypes.number,
  itemsPerRow: PropTypes.number,
};

export default ProductList;
