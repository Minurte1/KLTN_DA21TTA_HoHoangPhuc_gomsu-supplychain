import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart,
  AccountCircle,
  Phone,
  Storefront,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import Cookies from "js-cookie";
import axios from "axios";
import useAuthInit from "../../hook/useAuthInit";

const HeaderAdmin = () => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const api = process.env.REACT_APP_URL_SERVER;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  useAuthInit();

  useEffect(() => {
    setAnchorEl(null);
    setIsOpen(false);
  }, [isAuthenticated]);

  const handleMenuOpen = (event) => {
    if (!isAuthenticated) return;
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleMenuClose = () => {
    console.log("handleMenuClose");
    setAnchorEl(null);
    setIsOpen(false);
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
    <AppBar position="static" sx={{ backgroundColor: "#f5f7fa" }}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              marginRight: 2,
              color: "#333333",
              textDecoration: "none",
            }}
          >
            {" "}
          </Typography>{" "}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {" "}
          {isAuthenticated ? (
            <>
              {" "}
              <p style={{ color: "black" }}>
                {userInfo?.companyInfo?.NAME_COMPANY}
              </p>
              <Button
                variant="text"
                sx={{
                  padding: 2,
                  color: "#333333",
                  "&:hover": { backgroundColor: "#ff6f61", color: "#fff" },
                }}
                onClick={handleMenuOpen}
              >
                {" "}
                {userInfo.AVATAR ? (
                  <Avatar
                    src={`${api}/images/${userInfo.AVATAR}`}
                    alt={userInfo.AVATAR}
                  />
                ) : (
                  <AccountCircle sx={{ color: "#333333" }} />
                )}
                <Typography variant="body2" sx={{ ml: 2, color: "#333333" }}>
                  {userInfo.HO_TEN || "Người dùng"}
                </Typography>
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  sx={{
                    color: "#333333",
                    "&:hover": { backgroundColor: "#ff6f61", color: "#fff" },
                  }}
                >
                  Thông tin cá nhân
                </MenuItem>
                <MenuItem
                  onClick={() => handleLogout()}
                  sx={{
                    color: "#333333",
                    "&:hover": { backgroundColor: "#ff6f61", color: "#fff" },
                  }}
                >
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton
              component={Link}
              to="/login"
              sx={{
                color: "#333333",
                textDecoration: "none",
                "&:hover": { backgroundColor: "#ff6f61", color: "#fff" },
              }}
            >
              <AccountCircle />
              <Typography
                variant="body2"
                sx={{ marginLeft: 1, color: "#333333" }}
              >
                Đăng nhập
              </Typography>
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAdmin;
