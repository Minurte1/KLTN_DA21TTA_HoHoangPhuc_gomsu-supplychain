import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";

const MaterialsOrdersModal = ({ open, onClose, material }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (material && quantity > 0) {
      setTotalCost(quantity * material.COST_PER_UNIT_);
    } else {
      setTotalCost(0);
    }
  }, [quantity, material]);

  const handleOrder = () => {
    if (quantity <= 0) {
      alert("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    // TODO: Gửi API tạo đơn đặt hàng
    alert(
      `Đã gửi yêu cầu mua ${quantity} x ${
        material.NAME_
      } (Tổng: ${totalCost.toLocaleString()} VNĐ)`
    );
    onClose();
  };

  if (!material) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yêu cầu mua vật liệu</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <strong>Tên vật liệu:</strong> {material.NAME_}
        </Typography>
        <Typography gutterBottom>
          <strong>Loại:</strong> {material.NAME_MATERIAL_TYPES}
        </Typography>
        <Typography gutterBottom>
          <strong>Công ty cung cấp:</strong> {material.NAME_COMPANY}
        </Typography>
        <Typography gutterBottom>
          <strong>Đơn vị:</strong> {material.UNIT_}
        </Typography>
        <Typography gutterBottom>
          <strong>Giá mỗi đơn vị:</strong>{" "}
          {material.COST_PER_UNIT_.toLocaleString()} VNĐ
        </Typography>
        <Typography gutterBottom>
          <strong>Số lượng có sẵn:</strong> {material.QUANTITY}
        </Typography>

        <Box mt={2}>
          <TextField
            label="Số lượng cần mua"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            inputProps={{ min: 1 }}
          />
        </Box>

        <Box mt={2}>
          <Typography variant="h6">
            Tổng chi phí: {totalCost.toLocaleString()} VNĐ
          </Typography>
        </Box>
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
