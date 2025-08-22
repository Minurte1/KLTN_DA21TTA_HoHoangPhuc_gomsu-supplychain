import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { userMenuConfig } from "../../share-service/menu-user";
import { Link, useLocation } from "react-router-dom";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";

const NavBarUser = () => {
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();
  const { listPermission, userInfo } = ReduxExportUseAuthState();
  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const canAccessMenu = (menuItem, permissions) => {
    if (permissions.some((p) => p.router === "SYSTEM")) return true;

    // Hàm lấy router từ path
    const getRouterFromPath = (path) => {
      if (typeof path !== "string") return null;
      const segments = path.split("/");
      // Tìm phần tử sau 'admin', ví dụ: /admin/order/hoan-tat -> 'order'
      const adminIndex = segments.indexOf("admin");
      return adminIndex !== -1 && segments.length > adminIndex + 1
        ? segments[adminIndex + 1]
        : null;
    };

    // Kiểm tra nếu có path trực tiếp
    if (menuItem.path) {
      const router = getRouterFromPath(menuItem.path);
      return permissions.some((p) => p.router === router);
    }

    // Kiểm tra trong children
    if (Array.isArray(menuItem.children)) {
      return menuItem.children.some((child) => {
        const router = getRouterFromPath(child.path);
        return permissions.some((p) => p.router === router);
      });
    }

    return false;
  };

  return (
    <Box
      sx={{
        width: "250px",
        background: "linear-gradient(180deg, #f5f7fa 0%, #e8ecef 100%)",
        padding: "30px 20px",
        borderRight: "1px solid #d1d5db",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#e8ecef",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#ff6f61",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#e65a50",
        },
      }}
    >
      <Typography
        variant="h6"
        style={{
          marginBottom: "20px",
          color: "#333333",
        }}
      >
        Thông tin người dùng
      </Typography>
      <List component="nav">
        {userMenuConfig.map((item, index) => {
          const isOpen = openSection === index;

          if (!item.children) {
            return (
              <ListItem
                key={index}
                button
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: "12px",
                  color: "#333333",
                  backgroundColor:
                    location.pathname === item.path ? "#ff6f61" : "transparent",
                  "&:hover": { backgroundColor: "#ff6f61" },
                }}
              >
                <ListItemIcon sx={{ color: "#333333" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            );
          }

          return (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => toggleSection(index)}
                sx={{
                  borderRadius: "12px",
                  color: "#333333",
                }}
              >
                <ListItemIcon sx={{ color: "#333333" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {isOpen ? (
                  <ExpandLess sx={{ color: "#333333" }} />
                ) : (
                  <ExpandMore sx={{ color: "#333333" }} />
                )}
              </ListItem>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child, childIndex) => (
                    <ListItem
                      key={childIndex}
                      button
                      component={Link}
                      to={child.path}
                      sx={{
                        pl: 4,
                        color: "#333333",
                        borderRadius: "12px",
                        backgroundColor:
                          location.pathname === child.path
                            ? "#ff6f61"
                            : "transparent",
                        "&:hover": { backgroundColor: "#ff6f61" },
                      }}
                    >
                      <ListItemText primary={child.label} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default NavBarUser;
