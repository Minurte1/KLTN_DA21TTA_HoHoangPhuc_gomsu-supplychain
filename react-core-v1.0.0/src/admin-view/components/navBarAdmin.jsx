import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse, // Đừng quên import Collapse
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People"; // Quản lý người dùng
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Quản lý đơn hàng
import InventoryIcon from "@mui/icons-material/Inventory"; // Quản lý sản phẩm
import GroupIcon from "@mui/icons-material/Group"; // Tương tác người dùng
import ExpandLess from "@mui/icons-material/ExpandLess"; // Import đúng từ đây
import ExpandMore from "@mui/icons-material/ExpandMore"; // Import đúng từ đây
import BarChartIcon from "@mui/icons-material/BarChart";
import { Link, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
const NavBarAdmin = () => {
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  const [openCategory, setOpenCategory] = useState(false);

  const handleClick = () => {
    setOpenCategory(!openCategory);
  };
  return (
    <>
      {" "}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#fff",
          padding: "30px 20px",
          borderRight: "1px solid #ddd",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "1px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#0d1117",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#fff",
          },
        }}
      >
        <Typography
          variant="h6"
          style={{
            marginBottom: "20px",
            color: "#1f1f1f",
          }}
        >
          Quản lý hệ thống
        </Typography>
        <List component="nav">
          {adminMenuConfig.map((item, index) => {
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
                    color: "#1f1f1f",
                    backgroundColor:
                      location.pathname === item.path
                        ? "#8aad51"
                        : "transparent",
                    "&:hover": { backgroundColor: "#8aad51" },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              );
            }

            // Với mục có children
            return (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={() => toggleSection(index)}
                  sx={{
                    borderRadius: "12px",
                    color: "#1f1f1f",
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  {isOpen ? <ExpandLess /> : <ExpandMore />}
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
                          color: "#1f1f1f",
                          borderRadius: "12px",
                          backgroundColor:
                            location.pathname === child.path
                              ? "#8aad51"
                              : "transparent",
                          "&:hover": { backgroundColor: "#8aad51" },
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
      </Box>{" "}
    </>
  );
};

export default NavBarAdmin;
