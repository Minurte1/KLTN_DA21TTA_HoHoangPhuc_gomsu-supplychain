import React from "react";
import { useNavigate } from "react-router-dom";
import "../component-view/scss/header.scss";
import logo from "../../public/images/logo.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="container">
        {/* Logo */}
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Logo" />
        </div>

        {/* Navbar */}
        <nav className="navbar">
          <ul>
            <li onClick={() => navigate("/")}>Giới thiệu</li>
            <li onClick={() => navigate("/companies")}>Các công ty</li>
            <li onClick={() => navigate("/san-pham")}>Sản phẩm công ty</li>
            <li onClick={() => navigate("/van-hoa-nguon-goc")}>
              Văn hóa & Nguồn gốc
            </li>
          </ul>
        </nav>

        {/* Search + Account */}
        <div className="header-actions">
          <input type="text" placeholder="Tìm kiếm..." />
          <button onClick={() => navigate("/account")} className="account-btn">
            Tài khoản
          </button>
          <button onClick={() => navigate("/cart")} className="cart-btn">
            Giỏ hàng
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
