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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReduxExportUseAuthState from "../../redux/redux-export/useAuthServices";
import { getUserById, updateUserById } from "../../services/userAccountService";

import { enqueueSnackbar } from "notistack";
import orderServices from "../../services/orderServices";

const Input = styled("input")({
  display: "none",
});

const OrdersUsers = () => {
  const { userInfo } = ReduxExportUseAuthState();
  const [infoUser, setInfoUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userInfo) {
      getInfoUsers(userInfo.ID_USERS);
      getUserOrders(userInfo.ID_USERS);
    }
  }, [userInfo]);

  const getInfoUsers = async (ID_USERS) => {
    const response = await getUserById(ID_USERS);
    setInfoUser(response);
    setFormData(response);
    if (response?.AVATAR) {
      setAvatarPreview(response.AVATAR);
    }
  };

  const getUserOrders = async (ID_USERS) => {
    try {
      const response = await orderServices.getOrderByUsers(ID_USERS); // New service call to get orders
      console.log("response", response);
      setOrders(response || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      enqueueSnackbar("Không thể tải danh sách đơn hàng", { variant: "error" });
    }
  };

  if (!infoUser) return null;

  return (
    <Card sx={{ maxWidth: 900, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        {/* Lịch sử đơn hàng */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Lịch sử đơn hàng
        </Typography>
        {Array.isArray(orders) && orders.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn hàng</TableCell>
                  <TableCell>Ngày đặt</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Trạng thái thanh toán</TableCell>
                  <TableCell>Trạng thái vận chuyển</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.ID_ORDERS_}>
                    <TableCell>{order.ID_ORDERS_ || "N/A"}</TableCell>
                    <TableCell>
                      {order.DATE_ORDER
                        ? new Date(order.DATE_ORDER).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {order.TOTAL_AMOUNT_ORDER != null
                        ? `${order.TOTAL_AMOUNT_ORDER.toLocaleString()} VNĐ`
                        : "N/A"}
                    </TableCell>
                    <TableCell>{order.PAYMENT_STATUS_ORDER || "N/A"}</TableCell>
                    <TableCell>
                      {order.SHIPPING_STATUS_ORDER || "N/A"}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(order.products) &&
                      order.products.length > 0 ? (
                        order.products.map((product) => (
                          <Box key={product.ID_ORDER_ITEMS} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              {product.NAME_PRODUCTS || "Sản phẩm không tên"}
                            </Typography>
                            <Typography variant="caption">
                              Số lượng: {product.QUANTITY_INVENTORY ?? 0} - Giá:{" "}
                              {product.PRICE_ORDER_ITEMS != null
                                ? `${product.PRICE_ORDER_ITEMS.toLocaleString()} VNĐ`
                                : "N/A"}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="caption">
                          Không có sản phẩm
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Không có đơn hàng nào.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersUsers;
