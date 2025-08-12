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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import cartServices from "../../services/cartServices";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  overflowY: "auto",
  borderRadius: 2,
};

export default function CartModal({ open, handleClose }) {
  const { userInfo } = ReduxExportUseAuthState();
  const [listCart, setListCart] = useState([]);

  useEffect(() => {
    if (open) {
      fetchCartUser();
    }
  }, [userInfo, open]);
  // Hàm lấy danh sách product instances theo company
  const fetchCartUser = async () => {
    if (!userInfo) return;

    const ID_USERS = userInfo.ID_USERS || null;
    const data = await cartServices.getCartsByUser(ID_USERS);
    console.log("data", data);
    setListCart(data);
  };
  // Đảm bảo listCart luôn là mảng
  const safeCart = Array.isArray(listCart) ? listCart : [];

  const totalPrice = safeCart.reduce(
    (acc, item) => acc + (item.PRICE_PRODUCTS || 0) * (item.QUANTITY || 0),
    0
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="cart-modal-title"
      aria-describedby="cart-modal-description"
    >
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography id="cart-modal-title" variant="h6" component="h2">
            Giỏ Hàng Của Bạn
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {safeCart.length === 0 ? (
          <Typography variant="body1">Giỏ hàng của bạn đang trống.</Typography>
        ) : (
          <>
            <List>
              {safeCart.map((item) => (
                <React.Fragment key={item.ID_CART}>
                  <ListItem alignItems="flex-start">
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
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Số lượng: {item.QUANTITY} x{" "}
                            {item.PRICE_PRODUCTS.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
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
                {safeCart
                  .reduce(
                    (acc, item) =>
                      acc + (item.PRICE_PRODUCTS || 0) * (item.QUANTITY || 0),
                    0
                  )
                  .toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
              </Typography>
            </Box>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => alert("Tiến hành thanh toán")}
              >
                Thanh Toán
              </Button>
              <Button variant="outlined" onClick={handleClose}>
                Đóng
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
