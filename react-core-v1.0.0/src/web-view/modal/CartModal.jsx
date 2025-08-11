import React from "react";
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

export default function CartModal({ open, handleClose, cartData }) {
  const cartDataFromAPI = [
    {
      ID_CART: 123,
      ID_PRODUCT_INSTANCE: 456,
      ID_USERS: 789,
      CREATED_AT_CART: "2025-08-11T18:09:03.000Z",
      CART_ID_COMPANY: 10,
      QUANTITY: 2,
      ID_PRODUCT: 456,
      ID_CATEGORIES_: 5,
      NAME_PRODUCTS: "Sản phẩm A",
      DESCRIPTION_PRODUCTS: "Mô tả sản phẩm A",
      PRICE_PRODUCTS: 150000,
      STOCK_PRODUCTS: 20,
      IMAGE_URL_PRODUCTS: "https://example.com/images/productA.jpg",
      CREATED_AT_PRODUCTS: "2025-01-01T10:00:00.000Z",
      UPDATED_AT_PRODUCTS: "2025-07-15T15:30:00.000Z",
      PRODUCT_ID_COMPANY: 10,
      NAME_CATEGORIES_: "Danh mục 1",
      NAME_COMPANY: "Công ty ABC",
      TYPE_COMPANY: "MANUFACTURER",
      ADDRESS: "123 Đường ABC",
      DIA_CHI_Provinces: "Hà Nội",
      DIA_CHI_Districts: "Quận 1",
      DIA_CHI_Wards: "Phường A",
      DIA_CHI_STREETNAME: "Đường ABC",
      PHONE: "0123456789",
      EMAIL: "contact@abc.com",
      AVATAR: "https://example.com/images/company_avatar.jpg",
      SLUG: "cong-ty-abc",
      STATUS: "ACTIVE",
      ID_COMPANY_TYPE: 3,
    },
    {
      ID_CART: 124,
      ID_PRODUCT_INSTANCE: 457,
      ID_USERS: 789,
      CREATED_AT_CART: "2025-08-11T19:15:00.000Z",
      CART_ID_COMPANY: 11,
      QUANTITY: 1,
      ID_PRODUCT: 457,
      ID_CATEGORIES_: 6,
      NAME_PRODUCTS: "Sản phẩm B",
      DESCRIPTION_PRODUCTS: "Mô tả sản phẩm B",
      PRICE_PRODUCTS: 250000,
      STOCK_PRODUCTS: 10,
      IMAGE_URL_PRODUCTS: "https://example.com/images/productB.jpg",
      CREATED_AT_PRODUCTS: "2025-02-01T10:00:00.000Z",
      UPDATED_AT_PRODUCTS: "2025-07-20T12:00:00.000Z",
      PRODUCT_ID_COMPANY: 11,
      NAME_CATEGORIES_: "Danh mục 2",
      NAME_COMPANY: "Công ty XYZ",
      TYPE_COMPANY: "SUPPLIER",
      ADDRESS: "456 Đường XYZ",
      DIA_CHI_Provinces: "Hồ Chí Minh",
      DIA_CHI_Districts: "Quận 2",
      DIA_CHI_Wards: "Phường B",
      DIA_CHI_STREETNAME: "Đường XYZ",
      PHONE: "0987654321",
      EMAIL: "contact@xyz.com",
      AVATAR: "https://example.com/images/company_avatar2.jpg",
      SLUG: "cong-ty-xyz",
      STATUS: "ACTIVE",
      ID_COMPANY_TYPE: 2,
    },
  ];
  const totalPrice = cartDataFromAPI.reduce(
    (acc, item) => acc + item.PRICE_PRODUCTS * item.QUANTITY,
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

        {cartDataFromAPI.length === 0 ? (
          <Typography variant="body1">Giỏ hàng của bạn đang trống.</Typography>
        ) : (
          <>
            <List>
              {cartDataFromAPI.map((item) => (
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
                {totalPrice.toLocaleString("vi-VN", {
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
