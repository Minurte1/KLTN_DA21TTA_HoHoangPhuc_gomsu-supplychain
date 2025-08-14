import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import moment from "moment";

const OrderDetailsViewModal = ({ open, onClose, order, onUpdateStatus }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết đơn hàng #{order.ID_ORDERS_}</DialogTitle>
      <DialogContent dividers>
        {/* Thông tin khách hàng */}
        <Typography variant="h6" gutterBottom>
          Thông tin khách hàng
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={order.user?.AVATAR} alt={order.user?.HO_TEN} />
              <Typography>{order.user?.HO_TEN}</Typography>
            </Box>
            <Typography>Email: {order.user?.EMAIL}</Typography>
            <Typography>SĐT: {order.PHONE_ORDER}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Địa chỉ: {order.SHIPPING_ADDRESS}</Typography>
            <Typography>
              Ngày đặt: {moment(order.DATE_ORDER).format("DD/MM/YYYY HH:mm")}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Thông tin đơn hàng */}
        <Typography variant="h6" gutterBottom>
          Thông tin đơn hàng
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography>
              Trạng thái thanh toán đơn hàng:{" "}
              <Chip
                label={order.PAYMENT_STATUS_ORDER}
                color={
                  order.PAYMENT_STATUS_ORDER === "PAID" ? "success" : "warning"
                }
              />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              Trạng thái vận chuyển:{" "}
              <Chip
                label={order.SHIPPING_STATUS_ORDER}
                color={
                  order.SHIPPING_STATUS_ORDER === "DELIVERED"
                    ? "success"
                    : "warning"
                }
              />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              Phương thức thanh toán: {order.PAYMENT_METHOD}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              Phương thức giao hàng: {order.SHIPPING_METHOD}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Phí vận chuyển: {order.SHIPPING_COST} đ</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography fontWeight="bold" color="error">
              Tổng tiền: {order.TOTAL_AMOUNT_ORDER.toLocaleString()} đ
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Danh sách sản phẩm */}
        <Typography variant="h6" gutterBottom>
          Sản phẩm
        </Typography>
        {order.products?.map((item) => (
          <Box
            key={item.ID_ORDER_ITEMS}
            display="flex"
            alignItems="center"
            gap={2}
            sx={{
              p: 1,
              borderBottom: "1px solid #ddd",
            }}
          >
            <Avatar
              variant="square"
              src={item.IMAGE_URL_PRODUCTS}
              alt={item.NAME_PRODUCTS}
              sx={{ width: 64, height: 64 }}
            />
            <Box flexGrow={1}>
              <Typography>{item.NAME_PRODUCTS}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.category?.NAME_CATEGORIES_}
              </Typography>
              <Typography variant="body2">
                SL: {item.QUANTITY_INVENTORY}
              </Typography>
            </Box>
            <Typography fontWeight="bold">
              {item.PRICE_ORDER_ITEMS.toLocaleString()} đ
            </Typography>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Đóng
        </Button>
        <Button
          onClick={() => onUpdateStatus(order.ID_ORDERS_)}
          variant="contained"
          color="primary"
        >
          Cập nhật trạng thái
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsViewModal;
