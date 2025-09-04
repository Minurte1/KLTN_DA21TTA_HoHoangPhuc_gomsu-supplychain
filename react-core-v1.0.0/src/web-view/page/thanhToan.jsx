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
import Footer from "../../components/footer";
import { Backdrop, CircularProgress } from "@mui/material";

export default function ThanhToan() {
  const [orderData, setOrderData] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

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
    // ✅ Validate số điện thoại Việt Nam
    const phoneRegex = /^(0|\+84)(3|5|7|8|9|1[2|6|8|9])[0-9]{7,8}$/;
    if (!phoneRegex.test(phone)) {
      enqueueSnackbar("Số điện thoại không hợp lệ", { variant: "warning" });
      return;
    }

    setLoading(true); // 🔥 hiện overlay

    try {
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
        FULLNAME_ORDER: fullName,
        PHONE_ORDER: phone,
        orderItems: orderData,
      };

      await orderServices.createOrder(newOrder);
      enqueueSnackbar("Đơn hàng đã được tạo thành công!", {
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      enqueueSnackbar("Có lỗi xảy ra khi tạo đơn hàng", { variant: "error" });
    } finally {
      setLoading(false); // 🔥 tắt overlay
    }
  };

  const stylePadding = {
    marginTop: "20px",
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: "8px",
    padding: "16px 0px",
  };

  return (
    <>
      {" "}
      <div style={stylePadding}>
        {" "}
        <Box p={3} maxWidth={600} mx="auto">
          <Typography variant="h5" mb={3} textAlign="center">
            Xác Nhận Thanh Toán
          </Typography>
          <Box
            maxHeight={500} // chiều cao tối đa trước khi scroll
            overflow="auto" // bật scroll khi nội dung vượt quá
            mb={3} // khoảng cách với phần khác
          >
            {orderData.map((item) => (
              <Box key={item.ID_CART} mb={2}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar
                    variant="square"
                    src={item.IMAGE_URL_PRODUCTS}
                    alt={item.NAME_PRODUCTS}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {item.NAME_PRODUCTS}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.QUANTITY} x{" "}
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
              </Box>
            ))}
          </Box>

          <Box mt={3}>
            <TextField
              label="Họ tên người mua"
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              sx={{ mb: 2 }}
              size="small"
            />

            <TextField
              label="Số điện thoại"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 2 }}
              size="small"
            />

            <TextField
              label="Địa chỉ giao hàng"
              fullWidth
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              sx={{ mb: 2 }}
              size="small"
            />

            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel>Phương thức thanh toán</InputLabel>
              <Select value="COD" disabled label="Phương thức thanh toán">
                <MenuItem value="COD">Thanh toán khi nhận hàng (COD)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box textAlign="right" mt={2}>
            <Typography variant="h6" fontWeight={600}>
              Tổng cộng:{" "}
              {(totalPrice + shippingCost).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Typography>
          </Box>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <button
              className="custom-outline-btn-cancel"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </button>
            <button className="custom-outline-btn" onClick={handleConfirm}>
              Xác nhận thanh toán
            </button>
          </Box>
        </Box>
      </div>
      <div style={stylePadding}>
        <Footer />
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
