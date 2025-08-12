import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import spService from "../../share-service/spService";

export default function ThanhToan() {
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const encryptedData = localStorage.getItem("orderGomSu");
    if (!encryptedData) {
      navigate("/"); // Nếu không có dữ liệu thì quay về trang chủ
      return;
    }
    const decryptedData = spService.decryptData(encryptedData);
    if (!decryptedData || decryptedData.length === 0) {
      navigate("/");
      return;
    }
    setOrderData(decryptedData);
  }, [navigate]);

  const totalPrice = orderData.reduce(
    (acc, item) => acc + (item.PRICE_PRODUCTS || 0) * (item.QUANTITY || 0),
    0
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Xác Nhận Thanh Toán
      </Typography>

      {orderData.map((item) => (
        <React.Fragment key={item.ID_CART}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              variant="square"
              src={item.IMAGE_URL_PRODUCTS}
              alt={item.NAME_PRODUCTS}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Box flex={1}>
              <Typography variant="subtitle1">{item.NAME_PRODUCTS}</Typography>
              <Typography variant="body2" color="text.secondary">
                Số lượng: {item.QUANTITY} x{" "}
                {item.PRICE_PRODUCTS.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Công ty: {item.NAME_COMPANY}
              </Typography>
            </Box>
          </Box>
          <Divider />
        </React.Fragment>
      ))}

      <Box textAlign="right" mt={2}>
        <Typography variant="h6">
          Tổng tiền:{" "}
          {totalPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Typography>
      </Box>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => alert("Thanh toán thành công!")}
        >
          Xác nhận thanh toán
        </Button>
      </Box>
    </Box>
  );
}
