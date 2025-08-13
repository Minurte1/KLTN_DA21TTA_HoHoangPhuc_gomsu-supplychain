import React from "react";
import "../component-view/scss/header.scss";

const Header = () => {
  return (
    <header className="main-header">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <a href="/">
            <img src="/logo.png" alt="Logo" />
          </a>
        </div>

        {/* Navbar */}
        <nav className="navbar">
          <ul>
            <li>
              <a href="/gioi-thieu">Giới thiệu</a>
            </li>
            <li>
              <a href="/companies">Các công ty</a>
            </li>
            <li>
              <a href="/san-pham">Sản phẩm công ty</a>
            </li>
            <li>
              <a href="/van-hoa-nguon-goc">Văn hóa & Nguồn gốc</a>
            </li>
          </ul>
        </nav>

        {/* Search + Account */}
        <div className="header-actions">
          <input type="text" placeholder="Tìm kiếm..." />
          <a href="/account" className="account-btn">
            Tài khoản
          </a>
          <a href="/cart" className="cart-btn">
            Giỏ hàng
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
