import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

const renderCell = (label, value) => (
  <TableRow>
    <TableCell
      component="th"
      scope="row"
      sx={{ fontWeight: "bold", width: "30%" }}
    >
      {label}
    </TableCell>
    <TableCell>{value ?? "—"}</TableCell>
  </TableRow>
);

const MaterialOrderViewModal = ({
  open,
  onClose,
  order,
  onConfirmTransport,
  title = "Xác nhận vận chuyển",
  color = "success",
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết đơn hàng</DialogTitle>
      <DialogContent dividers>
        <Table>
          <TableBody>
            {renderCell("Mã đơn hàng", order.ID_MATERIAL_ORDER_MASTER)}
            {renderCell("Tên vật liệu", order.MATERIAL_NAME)}

            {renderCell("Đơn vị", order.UNIT_)}
            {renderCell("Số lượng đặt", order.QUANTITY_ORDERED)}
            {renderCell(
              "Đơn giá",
              order.COST_PER_UNIT_?.toLocaleString("vi-VN") + " ₫"
            )}
            {renderCell(
              "Tổng chi phí",
              order.TOTAL_COST?.toLocaleString("vi-VN") + " ₫"
            )}
            {renderCell("Trạng thái", order.STATUS)}
            {renderCell("Công ty bán", order.NAME_COMPANY_SELLER)}
            {renderCell("Công ty mua", order.NAME_COMPANY_BUYER)}
            {renderCell("Công ty vận chuyển", order.NAME_COMPANY_SHIP)}
            {renderCell(
              "Ngày đặt hàng",
              new Date(order.ORDER_DATE).toLocaleDateString("vi-VN")
            )}
            {renderCell(
              "Ngày giao hàng",
              order.DELIVERY_DATE
                ? new Date(order.DELIVERY_DATE).toLocaleDateString("vi-VN")
                : "—"
            )}
            {renderCell("Xuất xứ", order.ORIGIN)}
            {renderCell(
              "Hạn sử dụng",
              order.EXPIRY_DATE
                ? new Date(order.EXPIRY_DATE).toLocaleDateString("vi-VN")
                : "—"
            )}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
        <Button
          onClick={() => {
            if (typeof onConfirmTransport === "function") {
              onConfirmTransport(order.ID_MATERIAL_ORDER_MASTER);
            }
          }}
          variant="contained"
          color={color || "primary"}
        >
          {title || "Xác nhận vận chuyển"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialOrderViewModal;
