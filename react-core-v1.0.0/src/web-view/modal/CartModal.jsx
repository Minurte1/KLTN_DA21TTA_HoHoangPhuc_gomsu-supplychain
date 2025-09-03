import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
  Checkbox,
  Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import cartServices from "../../services/cartServices";
import CryptoJS from "crypto-js";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import imageCart from "../../public/images/cart.png";
import spService from "../../share-service/spService";
import { Add, Remove } from "@mui/icons-material";
// Khóa bí mật để mã hóa (nên lưu trong .env để bảo mật hơn)
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "my-secret-key";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1100,
  // height: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  overflowY: "auto",
  borderRadius: 2,
};

export default function CartModal({ open, handleClose }) {
  const { userInfo } = ReduxExportUseAuthState();
  const [listCart, setListCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (open) {
      fetchCartUser();
    }
  }, [userInfo, open]);

  const fetchCartUser = async () => {
    if (!userInfo) return;
    const ID_USERS = userInfo?.ID_USERS || null;
    const data = await cartServices.getCartsByUser(ID_USERS);
    setListCart(data || []);
    setSelectedItems([]);
  };

  const safeCart = Array.isArray(listCart) ? listCart : [];

  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === safeCart.length) {
      setSelectedItems([]); // bỏ chọn hết
    } else {
      setSelectedItems(safeCart.map((item) => item.ID_CART)); // chọn hết
    }
  };

  const handleIncrease = async (item) => {
    try {
      const ID_USERS = userInfo?.ID_USERS || null;
      const data = {
        ID_PRODUCT_INSTANCE: item.ID_PRODUCT_INSTANCE,
        ID_USERS: ID_USERS,
        CREATED_AT_CART: new Date().toISOString(),
        ID_COMPANY: item.ID_COMPANY,
        QUANTITY: 1, // tăng thêm 1
      };
      await cartServices.createCart(data);
      fetchCartUser();
      // cập nhật lại state sau khi gọi API
      // setListCart((prev) =>
      //   prev.map((c) =>
      //     c.ID_CART === item.ID_CART ? { ...c, QUANTITY: c.QUANTITY + 1 } : c
      //   )
      // );
    } catch (err) {
      console.error(err);
    }
  };
  const handleDecrease = async (item) => {
    try {
      const ID_USERS = userInfo?.ID_USERS || null;
      const data = {
        ID_PRODUCT_INSTANCE: item.ID_PRODUCT_INSTANCE,
        ID_USERS: ID_USERS,
        CREATED_AT_CART: new Date().toISOString(),
        ID_COMPANY: item.ID_COMPANY,
        QUANTITY: -1, // tăng thêm 1
      };
      await cartServices.createCart(data);
      fetchCartUser();
      // cập nhật lại state sau khi gọi API
      // setListCart((prev) =>
      //   prev.map((c) =>
      //     c.ID_CART === item.ID_CART ? { ...c, QUANTITY: c.QUANTITY - 1 } : c
      //   )
      // );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = () => {
    const selectedProducts = safeCart.filter((item) =>
      selectedItems.includes(item.ID_CART)
    );
    if (selectedProducts.length === 0) {
      enqueueSnackbar("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    const encryptedData = spService.encryptData(selectedProducts);
    localStorage.setItem("orderGomSu", encryptedData);
    enqueueSnackbar(`Thanh toán ${selectedProducts.length} sản phẩm`);
    handleClose();
    navigate("/thanh-toan");
  };
  const totalPrice = safeCart
    .filter((item) => selectedItems.includes(Number(item.ID_CART)))
    .reduce(
      (acc, item) => acc + (item.PRICE_PRODUCTS || 0) * (item.QUANTITY || 0),
      0
    );
  console.log("safeCart", safeCart);
  if (!userInfo) return;
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="cart-modal-title">
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Giỏ Hàng Của Bạn</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {safeCart.length === 0 ? (
          <>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%" }}
              gap={2}
              py={4}
            >
              {/* Giữ lại tấm hình cũ */}
              <img
                src={
                  imageCart ||
                  "https://dev.chothongminh.com/_next/static/media/noproduct.424263ad.png"
                }
                alt="Giỏ hàng trống"
                style={{ width: 200, height: "auto" }}
              />

              <Typography variant="h6" color="text.secondary">
                Giỏ hàng của bạn đang trống
              </Typography>

              {/* Nút tròn mua sắm ngay */}
              <Fab
                variant="extended"
                onClick={() => {
                  handleClose();
                  navigate("/san-pham");
                }}
                sx={{
                  mt: 3,
                  backgroundColor: "#8b5e3c",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#7a5230", // đậm hơn khi hover
                  },
                }}
              >
                🛍️ Mua sắm ngay
              </Fab>
            </Box>
          </>
        ) : (
          <>
            {/* ✅ Checkbox chọn tất cả */}
            <Box display="flex" alignItems="center" mb={1}>
              <Checkbox
                checked={
                  selectedItems.length === safeCart.length &&
                  safeCart.length > 0
                }
                indeterminate={
                  selectedItems.length > 0 &&
                  selectedItems.length < safeCart.length
                }
                onChange={handleSelectAll}
              />
              <Typography variant="body1">Chọn tất cả</Typography>
            </Box>

            <List>
              {safeCart.map((item) => (
                <React.Fragment key={item.ID_CART}>
                  <ListItem alignItems="flex-start">
                    <Checkbox
                      checked={selectedItems.includes(item.ID_CART)}
                      onChange={() => handleSelect(item.ID_CART)}
                    />
                    <ListItemAvatar>
                      <Avatar
                        variant="square"
                        src={item.IMAGE_URL_PRODUCTS}
                        alt={item.NAME_PRODUCTS}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.NAME_PRODUCTS}
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {/* Nút giảm */}
                            <IconButton
                              size="small"
                              onClick={() => handleDecrease(item)}
                              disabled={item.QUANTITY <= 1} // không cho giảm dưới 1
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <span>{item.QUANTITY}</span>
                            {/* Nút tăng */}
                            <IconButton
                              size="small"
                              onClick={() => handleIncrease(item)}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                            x{" "}
                            {item.PRICE_PRODUCTS.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Công ty: {item.NAME_COMPANY} ({item.TYPE_COMPANY})
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box mt={2} textAlign="right">
              <Typography variant="h6">
                Tổng tiền:{" "}
                {totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
            </Box>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <button className="custom-outline-btn" onClick={handleCheckout}>
                Thanh Toán
              </button>
              <button
                variant="outlined"
                onClick={handleClose}
                className="custom-outline-btn-danger"
              >
                Đóng
              </button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
