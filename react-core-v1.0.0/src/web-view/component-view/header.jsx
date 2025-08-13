import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../component-view/scss/header.scss";
import logo from "../../public/images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy URL hiện tại

  // Hàm kiểm tra URL hiện tại có trùng với menu không
  const isActive = (path) => location.pathname === path;

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
            <li
              onClick={() => navigate("/")}
              className={isActive("/") ? "active" : ""}
            >
              Giới thiệu
            </li>
            <li
              onClick={() => navigate("/companies")}
              className={isActive("/companies") ? "active" : ""}
            >
              Các công ty
            </li>
            <li
              onClick={() => navigate("/san-pham")}
              className={isActive("/san-pham") ? "active" : ""}
            >
              Sản phẩm công ty
            </li>
            <li
              onClick={() => navigate("/van-hoa-nguon-goc")}
              className={isActive("/van-hoa-nguon-goc") ? "active" : ""}
            >
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
