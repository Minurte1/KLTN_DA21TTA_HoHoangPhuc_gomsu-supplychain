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
  ListItemText,
  CircularProgress,
} from "@mui/material";

import materialOrderMasterServices from "../../../services/materialOrderMasterServices";

const MaterialsOrderViewModal = ({ open, onClose, material }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Gọi API khi mở modal và có material
  useEffect(() => {
    const fetchOrders = async () => {
      if (!material) return;

      setLoading(true);
      try {
        const data = await materialOrderMasterServices.getOrdersByMaterialId(
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

    if (open) {
      fetchOrders();
    }
  }, [open, material]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Đơn yêu cầu mua vật liệu: {material?.NAME_}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : orders.length === 0 ? (
          <Typography>Không có đơn đặt hàng nào.</Typography>
        ) : (
          <List>
            {orders.map((order, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Đơn hàng từ công ty: ${order.BUYER_COMPANY_NAME}`}
                  secondary={`Số lượng: ${
                    order.QUANTITY
                  } - Ngày yêu cầu: ${new Date(
                    order.CREATED_AT
                  ).toLocaleDateString()}`}
                />
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
