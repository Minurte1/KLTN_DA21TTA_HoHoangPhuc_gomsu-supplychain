import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Divider,
  Box,
  Button,
  Stack,
} from "@mui/material";

const formatDateTime = (dateStr) => {
  if (!dateStr) return "Chưa cập nhật";
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getTrangThaiStyle = (status) => {
  switch (status) {
    case "ACTIVE":
      return { backgroundColor: "#e6f4ea", color: "#2e7d32" };
    case "INACTIVE":
      return { backgroundColor: "#fbe9e7", color: "#d84315" };
    case "DELETED":
      return { backgroundColor: "#f3e5f5", color: "#6a1b9a" };
    case "WORKING":
    case "CONFIRMED":
      return { backgroundColor: "#e3f2fd", color: "#1565c0" };
    case "DELIVERED":
      return { backgroundColor: "#dcedc8", color: "#558b2f" };
    default:
      return { backgroundColor: "#eeeeee", color: "#424242" };
  }
};

const ViewOrderModal = ({
  open,
  onClose,
  data,
  title = "Đã nhận hàng",
  handleConfirmOrder = () => {},
}) => {
  if (!data) return null;
  console.log("data ", data);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết đơn hàng công ty đã mua</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Bên mua */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Bên mua:
            </Typography>
            <Typography>{data.NAME_COMPANY_BUYER}</Typography>
            <Typography>SĐT: {data.PHONE_BUYER}</Typography>
            <Typography>Email: {data.EMAIL_BUYER}</Typography>
          </Grid>

          {/* Bên bán */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Bên bán:
            </Typography>
            <Typography>{data.NAME_COMPANY_SELLER}</Typography>
            <Typography>SĐT: {data.PHONE_SELLER}</Typography>
            <Typography>Email: {data.EMAIL_SELLER}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Vận chuyển */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Công ty vận chuyển:
            </Typography>
            <Typography>{data.NAME_COMPANY_SHIP}</Typography>
            <Typography>SĐT: {data.PHONE_SHIP}</Typography>
            <Typography>Email: {data.EMAIL_SHIP}</Typography>
          </Grid>

          {/* Ngày đặt và trạng thái */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Ngày đặt hàng:
            </Typography>
            <Typography>{formatDateTime(data.ORDER_DATE)}</Typography>

            <Box mt={2}>
              <Typography variant="subtitle2" fontWeight="bold">
                Trạng thái:
              </Typography>
              <Typography
                sx={{
                  ...getTrangThaiStyle(data.STATUS),
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  display: "inline-block",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {data.STATUS.toLowerCase()}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Thông tin vật liệu */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Tên vật liệu:
            </Typography>
            <Typography>{data.MATERIAL_NAME}</Typography>
            <Typography>
              Số lượng: {data.QUANTITY_ORDERED} {data.UNIT_}
            </Typography>
            <Typography>
              Đơn giá: {data.COST_PER_UNIT_?.toLocaleString()} đ
            </Typography>
            <Typography>
              Tổng tiền: {data.TOTAL_COST_DETAIL?.toLocaleString()} đ
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Xuất xứ:
            </Typography>
            <Typography>{data.ORIGIN || "Chưa cập nhật"}</Typography>
            <Typography>
              Hạn sử dụng: {formatDateTime(data.EXPIRY_DATE)}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <Box p={2} display="flex" justifyContent="flex-end">
        {data.STATUS_DETAIL === "DELIVERED" && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleConfirmOrder(data?.ID_MATERIAL_ORDER_MASTER)}
            >
              {title}
            </Button>
          </Stack>
        )}
        <Button onClick={onClose} variant="outlined" color="primary">
          Đóng
        </Button>
      </Box>
    </Dialog>
  );
};

export default ViewOrderModal;
