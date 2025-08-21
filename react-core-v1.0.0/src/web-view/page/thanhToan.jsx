import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import spService from "../../share-service/spService";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import orderServices from "../../services/orderServices";
import { enqueueSnackbar } from "notistack";

export default function ThanhToan() {
  const [orderData, setOrderData] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const { userInfo } = ReduxExportUseAuthState();

  useEffect(() => {
    const encryptedData = localStorage.getItem("orderGomSu");
    if (!encryptedData) {
      navigate("/");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleConfirm = async () => {
    if (!userInfo) {
      enqueueSnackbar("Vui lòng đăng nhập để tiếp tục");
      return;
    }

    if (!fullName || !phone || !shippingAddress) {
      enqueueSnackbar("Vui lòng nhập đầy đủ thông tin giao hàng", {
        variant: "warning",
      });
      return;
    }

    const newOrder = {
      ID_USERS: userInfo?.ID_USERS,
      DATE_ORDER: new Date(),
      TOTAL_AMOUNT_ORDER: totalPrice + shippingCost,
      PAYMENT_STATUS_ORDER: "PENDING",
      SHIPPING_STATUS_ORDER: "PENDING",
      SHIPPING_ADDRESS: shippingAddress,
      SHIPPING_METHOD: shippingMethod,
      SHIPPING_COST: shippingCost,
      ID_COMPANY: orderData[0]?.ID_COMPANY || null,
      ID_TRANSPORT_ORDER: null,
      PAYMENT_METHOD: paymentMethod,
      FULLNAME_ORDER: fullName, // 📌 Họ tên người mua
      PHONE_ORDER: phone, // 📌 Số điện thoại
      orderItems: orderData,
    };

    await orderServices.createOrder(newOrder);
    enqueueSnackbar("Đơn hàng đã được tạo thành công!", { variant: "success" });
    navigate("/");
  };
  const stylePadding = {
    marginTop: "20px",
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: "8px",
    padding: "16px 0px",
  };

  return (
    <div style={stylePadding}>
      {" "}
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
                <Typography variant="subtitle1">
                  {item.NAME_PRODUCTS}
                </Typography>
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

        <Box mt={3}>
          <TextField
            label="Họ tên người mua"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Số điện thoại"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Địa chỉ giao hàng"
            fullWidth
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="COD">Thanh toán khi nhận hàng (COD)</MenuItem>
              <MenuItem value="MOMO">Momo</MenuItem>
              <MenuItem value="VNPAY">VNPay</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box textAlign="right" mt={2}>
          <Typography variant="h6">
            Tổng tiền hàng:{" "}
            {totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Typography>

          <Typography variant="h5" mt={1}>
            Tổng cộng:{" "}
            {(totalPrice + shippingCost).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Typography>
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Xác nhận thanh toán
          </Button>
        </Box>
      </Box>
    </div>
  );
}
