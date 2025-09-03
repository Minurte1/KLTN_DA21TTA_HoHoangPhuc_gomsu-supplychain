import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Sử dụng Redux hooks
import axios from "axios";
import { toast } from "react-toastify"; // Đảm bảo bạn đã cài đặt react-toastify
import { setItemCart, setTotalCart } from "../../redux/authSlice"; // Import các action cần thiết
import { enqueueSnackbar } from "notistack";

const CheckOutVnpay = () => {
  const apiUrl = process.env.REACT_APP_URL_SERVER;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [paymentInfo, setPaymentInfo] = useState({});

  // Lấy dữ liệu từ Redux
  const { isAuthenticated, userInfo, itemCart, totalCart } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log("queryParams", queryParams);
    // Lấy dữ liệu từ query parameters
    const info = {
      partnerCode: queryParams.get("partnerCode"),
      accessKey: queryParams.get("accessKey"),
      requestId: queryParams.get("requestId"),
      amount: queryParams.get("amount"),
      orderId: queryParams.get("vnp_TxnRef"),
      orderInfo: queryParams.get("orderInfo"),
      orderType: queryParams.get("orderType"),
      vnp_TransactionStatus: queryParams.get("vnp_TransactionStatus"),
      message: queryParams.get("message"),
      localMessage: queryParams.get("localMessage"),
      responseTime: queryParams.get("responseTime"),
      errorCode: queryParams.get("errorCode"),
      payType: queryParams.get("payType"),
      extraData: queryParams.get("extraData"),
      signature: queryParams.get("signature"),
    };

    // Cập nhật state với thông tin thanh toán
    setPaymentInfo(info);

    // Xóa các query parameters khi component được render
    const newPath = location.pathname;
    navigate(newPath);
  }, [navigate, location.pathname]);

  useEffect(() => {
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    if (orderDetails) {
      // handleOrder(orderDetails);
    }
  }, []);

  // Hàm xử lý đơn hàng khi thanh toán thành công
  const handleOrder = async () => {
    try {
      const orderId = paymentInfo.orderId; // Lấy orderId từ query params

      // Gửi yêu cầu cập nhật trạng thái thanh toán
      const response = await axios.put(
        `${apiUrl}/orders/${orderId}/status-payment`,
        { STATUS: "PAID" } // hoặc "PENDING", "FAILED" tùy logic
      );

      if (response.data.message) {
        toast.success("Cập nhật trạng thái thanh toán thành công!");
        navigate("/");
      } else {
        toast.error("Không thể cập nhật trạng thái đơn hàng.");
      }
    } catch (error) {
      console.error("Error while processing order:", error);
      toast.error("Đã có lỗi khi xử lý đơn hàng.");
    }
  };

  useEffect(() => {
    console.log(paymentInfo);
    console.log(paymentInfo.vnp_TransactionStatus);
    console.log(paymentInfo.vnp_TransactionStatus == "00");
    if (paymentInfo.vnp_TransactionStatus) {
      // Kiểm tra nếu đã có thông tin thanh toán thành công, thực hiện xử lý đơn hàng
      if (paymentInfo.vnp_TransactionStatus == "00") {
        enqueueSnackbar("Đơn hàng thanh toán online thành công !", {
          variant: "success",
        });
        handleOrder(); // Xử lý đơn hàng khi thanh toán thành công
      } else {
        enqueueSnackbar("Đơn hàng thanh toán online thất bại !", {
          variant: "error",
        });
        // navigate("/");
      }
    }
  }, [paymentInfo]); // Chạy khi paymentInfo thay đổi

  return <></>; // Trả về JSX của bạn nếu cần thiết
};

export default CheckOutVnpay;
