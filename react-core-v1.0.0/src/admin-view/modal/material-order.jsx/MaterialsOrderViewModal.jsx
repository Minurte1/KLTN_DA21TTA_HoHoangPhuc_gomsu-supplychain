import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";

import materialOrderMasterServices from "../../../services/materialOrderMasterServices";
import ReduxExportUseAuthState from "../../../redux/redux-export/useAuthServices";

const MaterialsOrderViewModal = ({ open, onClose, material }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = ReduxExportUseAuthState();

  const fetchOrders = async () => {
    if (!material) return;

    setLoading(true);
    try {
      const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
      const data =
        await materialOrderMasterServices.getOrdersByCompanyAndMaterial(
          companyId,
          material.ID_MATERIALS_
        );
      setOrders(data);
    } catch (error) {
      console.error("Lỗi khi tải đơn đặt hàng:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open, material]);

  // Gọi API xác nhận đơn hàng
  const handleConfirmOrder = async (orderId) => {
    try {
      await materialOrderMasterServices.confirmOrder(orderId); // 👈 bạn phải tự viết API này trong service
      fetchOrders(); // refresh lại
    } catch (error) {
      console.error("Xác nhận đơn hàng thất bại:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Đơn yêu cầu mua vật liệu: {material?.NAME_}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : orders.length === 0 ? (
          <Typography>Không có đơn đặt hàng nào.</Typography>
        ) : (
          <List>
            {orders.map((order, index) => (
              <ListItem key={index} sx={{ display: "block", mb: 2 }}>
                <Box border={1} borderRadius={2} p={2} borderColor="grey.300">
                  <Typography variant="h6" gutterBottom>
                    Công ty đặt hàng: {order.BUYER_NAME}
                  </Typography>
                  <Typography>
                    Loại hình: {order.BUYER_COMPANY_TYPE || "Chưa rõ"}
                  </Typography>
                  <Typography>Địa chỉ: {order.BUYER_ADDRESS}</Typography>
                  <Typography>Email: {order.BUYER_EMAIL}</Typography>
                  <Typography>SĐT: {order.BUYER_PHONE}</Typography>
                  <Typography sx={{ mt: 1 }}>
                    Ngày đặt hàng:{" "}
                    {new Date(order.ORDER_DATE).toLocaleDateString()}
                  </Typography>
                  <Typography>Trạng thái: {order.ORDER_STATUS}</Typography>
                  <Typography>
                    Số lượng: {order.QUANTITY_ORDERED} {order.UNIT_}
                  </Typography>
                  <Typography>
                    Tổng chi phí: {order.ITEM_TOTAL_COST.toLocaleString()} VNĐ
                  </Typography>

                  {order.ORDER_STATUS === "Đang xử lý" && (
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          handleConfirmOrder(order.ID_MATERIAL_ORDER_MASTER)
                        }
                      >
                        Xác nhận đơn hàng
                      </Button>
                    </Stack>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialsOrderViewModal;
