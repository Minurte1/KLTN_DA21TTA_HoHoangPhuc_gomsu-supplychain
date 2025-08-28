import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../component-view/scss/header.scss";
import logo from "../../public/images/logo.png";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import axios from "axios";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Menu, MenuItem } from "@mui/material";
import useAuthInit from "../../hook/useAuthInit";
import productInstancesServices from "../../services/product_instancesServices";
const api = process.env.REACT_APP_URL_SERVER;

const Header = () => {
  useAuthInit();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = ReduxExportUseAuthState();
  const dispatch = useDispatch();
  const isActive = (path) => location.pathname === path;
  const wrapperRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() !== "") {
      const data = await productInstancesServices.globalSearch(value);
      setResults(data);
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setResults([]); // Clear dữ liệu khi click ra ngoài
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

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

  const handleNavigate = (item) => {
    const ID_COMPANY = item?.id ? item.id : item.ID_COMPANY;
    if (item.type === "product") {
      navigate(`/product-details/${item?.SERIAL_CODE}`);
    } else if (item.type === "company") {
      navigate(`/companies-details/${ID_COMPANY}`);
    }
    setResults([]); // clear dropdown sau khi chọn
    setKeyword(""); // clear input nếu muốn
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
        <div className="header-actions d-flex align-items-center gap-3">
          <div className="position-relative" ref={wrapperRef}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={handleSearch}
            />

            {results.length > 0 && (
              <ul
                className="list-group position-absolute w-100 mt-1 shadow-sm"
                style={{ zIndex: 1050, maxHeight: "300px", overflowY: "auto" }}
              >
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item list-group-item-action d-flex align-items-center"
                    onClick={() => handleNavigate(item)} // <-- thêm navigate
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={item.IMAGE_URL_PRODUCTS || "/default-image.png"}
                      alt={item.name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                        marginRight: 10,
                      }}
                    />
                    <span
                      className="flex-grow-1"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {userInfo ? (
            <div className="account-dropdown position-relative">
              <button
                onClick={handleClick}
                className="account-btn"
                style={{
                  backgroundColor: "#8b5e3c", // nền giống header
                  color: "#fff", // chữ trắng
                  border: "1px solid #8b5e3c", // viền đồng bộ
                  borderRadius: "4px",
                  padding: "6px 12px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#7a5230"; // hover đậm hơn
                  e.currentTarget.style.borderColor = "#7a5230";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#8b5e3c";
                  e.currentTarget.style.borderColor = "#8b5e3c";
                }}
              >
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
            <button
              onClick={() => navigate("/login")}
              className="account-btn"
              style={{
                backgroundColor: "#8b5e3c",
                color: "#fff",
                border: "1px solid #8b5e3c",
                borderRadius: "4px",
                padding: "6px 12px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#7a5230";
                e.currentTarget.style.borderColor = "#7a5230";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#8b5e3c";
                e.currentTarget.style.borderColor = "#8b5e3c";
              }}
            >
              Tài khoản
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
