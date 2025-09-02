import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import { getUserById, updateUserById } from "../../services/userAccountService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import orderServices from "../../services/orderServices";
import OrderDetailModal from "./orderDetailsModal";
import DynamicTable from "../../share-view/dynamic/table/table";

const Input = styled("input")({
  display: "none",
});

const OrdersUsersModal = ({
  open,
  onClose,
  order,
  getUserOrders = () => {},
}) => {
  const { userInfo } = ReduxExportUseAuthState();

  const [isOrderDetailModal, setIsOrderDetailModal] = useState(false);

  const [orders, setOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (order) {
      const data = order?.orders;
      setOrders(data);
    }
  }, [order]);

  const onUpdateStatus = async (ID_ORDERS_, STATUS) => {
    try {
      await orderServices.onUpdateStatus(ID_ORDERS_, STATUS);
      setIsOrderDetailModal(false);
      if (typeof getUserOrders === "function") {
        getUserOrders();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  if (!order) return null;

  return (
    <>
      {" "}
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
            width: {
              xs: "95%", // màn hình nhỏ (mobile)
              sm: "90%", // tablet
              md: "70%", // laptop
              lg: "60%", // desktop lớn
            },
            maxHeight: "90vh", // tránh tràn chiều cao
            overflowY: "auto", // thêm scroll nếu nội dung quá dài
          }}
        >
          <Box mt={4}>
            <DynamicTable
              data={orders}
              filters={[
                {
                  key: "STATUS",
                  label: "Trạng thái",
                  options: [
                    { value: "PENDING", label: "Chờ xử lý" },
                    { value: "DELIVERING", label: "Đang giao hàng" },
                    { value: "DELIVERED", label: "Đã giao hàng" },
                    { value: "CANCELLED", label: "Đã hủy" },
                    { value: "SUCCESS", label: "Giao thành công" },
                  ],
                },
                {
                  key: "PAYMENT_STATUS_ORDER",
                  label: "Thanh toán",
                  options: [
                    { value: "PAID", label: "Đã thanh toán" },
                    { value: "PENDING", label: "Chờ xử lý" },
                  ],
                },
              ]}
              statusColumns={[
                "STATUS",
                "PAYMENT_STATUS_ORDER",
                "SHIPPING_STATUS_ORDER",
                "PAYMENT_METHOD",
              ]}
              keyStatus={"order"}
              columns={[
                { key: "FULLNAME_ORDER", label: "Người nhận" },
                { key: "PHONE_ORDER", label: "SĐT" },
                { key: "SHIPPING_ADDRESS", label: "Địa chỉ giao hàng" },
                {
                  key: "DATE_ORDER",
                  label: "Ngày đặt",
                  render: (value) => moment(value).format("DD/MM/YYYY HH:mm"),
                },
                { key: "TOTAL_AMOUNT_ORDER", label: "Tổng tiền" },
                { key: "PAYMENT_STATUS_ORDER", label: "Thanh toán" },
                { key: "SHIPPING_STATUS_ORDER", label: "Vận chuyển" },
                { key: "STATUS", label: "Trạng thái đơn hàng" },
                { key: "NAME_COMPANY", label: "Tên công ty" },

                { key: "PAYMENT_METHOD", label: "PT Thanh toán" },
                {
                  key: "actions",
                  label: "Hành động",
                  render: (_, row) => (
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedOrder(row);
                        setIsOrderDetailModal(true);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  ),
                },
              ]}
            />
          </Box>

          <OrderDetailModal
            open={isOrderDetailModal}
            onClose={() => setIsOrderDetailModal(false)}
            order={selectedOrder}
            onUpdateStatus={onUpdateStatus}
          />
        </Box>
      </Modal>
    </>
  );
};

export default OrdersUsersModal;
