import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const MaterialsOrdersModal = ({ open, onClose, material }) => {
  if (!material) return null;

  const handleOrder = () => {
    // TODO: Gửi API tạo đơn đặt hàng
    alert(`Đã gửi yêu cầu mua vật liệu: ${material.NAME_}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yêu cầu mua vật liệu</DialogTitle>
      <DialogContent dividers>
        <Typography>
          <strong>Tên vật liệu:</strong> {material.NAME_}
        </Typography>
        <Typography>
          <strong>Loại:</strong> {material.NAME_MATERIAL_TYPES}
        </Typography>
        <Typography>
          <strong>Công ty cung cấp:</strong> {material.NAME_COMPANY}
        </Typography>
        <Typography>
          <strong>Đơn vị:</strong> {material.UNIT_}
        </Typography>
        <Typography>
          <strong>Giá mỗi đơn vị:</strong> {material.COST_PER_UNIT_}
        </Typography>
        <Typography>
          <strong>Số lượng có sẵn:</strong> {material.QUANTITY}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleOrder} variant="contained" color="primary">
          Gửi yêu cầu mua
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialsOrdersModal;
