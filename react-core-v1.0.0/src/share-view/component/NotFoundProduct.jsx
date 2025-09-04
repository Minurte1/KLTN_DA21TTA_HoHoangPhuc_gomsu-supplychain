import React from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import "./scss/NotFoundProduct.scss";

const NotFoundProduct = () => {
  return (
    <div className="not-found-container">
      <SearchOffIcon className="not-found-icon" />
      <h2 className="not-found-title">Không tìm thấy sản phẩm gốm sứ 🏺</h2>
      <p className="not-found-text">Vui lòng thử lại với từ khóa khác.</p>
    </div>
  );
};

export default NotFoundProduct;
