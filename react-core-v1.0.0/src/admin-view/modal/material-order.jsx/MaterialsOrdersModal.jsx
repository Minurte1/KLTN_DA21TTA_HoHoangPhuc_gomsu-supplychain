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
  MenuItem,
} from "@mui/material";
import materialOrderMasterServices from "../../../services/materialOrderMasterServices";
import ReduxExportUseAuthState from "../../../redux/redux-export/useAuthServices";
import { enqueueSnackbar } from "notistack";

const MaterialsOrdersModal = ({ open, onClose, material }) => {
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { userInfo } = ReduxExportUseAuthState();
  useEffect(() => {
    if (material && quantity > 0) {
      setTotalCost(quantity * material.COST_PER_UNIT_);
    } else {
      setTotalCost(0);
    }
  }, [quantity, material]);

  const handleOrder = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    if (quantity <= 0) {
      enqueueSnackbar("Vui lòng nhập số lượng và ngày giao hàng hợp lệ.");
      return;
    }

    const data = {
      ID_COMPANY_BUYER: companyId, // công ty hiện tại (mua)
      ID_COMPANY_SELLER: material.ID_COMPANY, // công ty cung cấp vật liệu
      ID_COMPANY_SHIP: null, // bạn có thể thêm dropdown chọn đơn vị vận chuyển nếu có
      ID_MATERIALS_: material.ID_MATERIALS_,
      QUANTITY_ORDERED: quantity,
      DELIVERY_DATE: deliveryDate,
    };

    try {
      setIsLoading(true);
      const res =
        await materialOrderMasterServices.createMaterialOrderMasterFull(data);
      setMessage(
        `✅ Đặt hàng thành công! Mã đơn hàng: ${
          res.ID_MATERIAL_ORDER_MASTER || "N/A"
        }`
      );
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Lỗi đặt hàng:", err);
      setMessage("❌ Đặt hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
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

        {/* <Box mt={2}>
          <TextField
            label="Ngày giao hàng"
            type="date"
            fullWidth
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box> */}

        <Box mt={2}>
          <Typography variant="h6">
            Tổng chi phí: {totalCost.toLocaleString()} VNĐ
          </Typography>
        </Box>

        {message && (
          <Box mt={2}>
            <Typography color={message.includes("✅") ? "primary" : "error"}>
              {message}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          onClick={handleOrder}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Đang gửi..." : "Gửi yêu cầu mua"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialsOrdersModal;
