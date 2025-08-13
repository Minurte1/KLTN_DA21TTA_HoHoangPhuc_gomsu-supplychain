import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../component-view/scss/header.scss";
import logo from "../../public/images/logo.png";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import axios from "axios";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Menu, MenuItem } from "@mui/material";
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = ReduxExportUseAuthState();

  const dispatch = useDispatch();
  const isActive = (path) => location.pathname === path;

  const api = process.env.REACT_APP_URL_SERVER;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${api}/logout`);
      Cookies.remove("accessToken");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
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

          {userInfo ? (
            <div className="account-dropdown" style={{ position: "relative" }}>
              <button onClick={handleClick} className="account-btn">
                {userInfo?.HO_TEN || "Không xác định"}
              </button>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleClose();
                  }}
                >
                  Tài khoản
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="account-btn">
              Tài khoản
            </button>
          )}
          {/* 
          <button onClick={() => navigate("/cart")} className="cart-btn">
            Giỏ hàng
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
