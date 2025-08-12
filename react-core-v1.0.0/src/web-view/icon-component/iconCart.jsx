import React, { useState } from "react";
import { IconButton, Modal, Box, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartModal from "../modal/CartModal";

const CartIcon = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Icon giỏ hàng cố định */}
      <IconButton
        onClick={handleOpen}
        sx={{
          position: "fixed", // Luôn cố định
          right: "20px", // Cách lề phải 20px
          bottom: "20px", // Cách lề dưới 20px (có thể đổi thành top nếu muốn)
          zIndex: 1300, // Đè lên các thành phần khác
          color: "#1976d2",
          backgroundColor: "#fff",
          boxShadow: 3,
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
        size="large"
      >
        <ShoppingCartIcon fontSize="medium" />
      </IconButton>

      {/* Modal hiển thị hình ảnh */}
      <CartModal open={open} handleClose={handleClose} />
    </>
  );
};

export default CartIcon;
