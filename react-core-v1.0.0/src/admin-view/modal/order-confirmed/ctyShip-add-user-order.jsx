import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ViewUsersShipModal = ({ open, onClose, users, onAdd }) => {
  const getTrangThaiStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return { backgroundColor: "#e6f4ea", color: "#2e7d32" }; // Xanh lá
      case "INACTIVE":
        return { backgroundColor: "#fbe9e7", color: "#d84315" }; // Cam
      case "DELETED":
        return { backgroundColor: "#f3e5f5", color: "#6a1b9a" }; // Tím
      case "WORKING":
        return { backgroundColor: "#e3f2fd", color: "#1565c0" }; // Xanh dương
      default:
        return { backgroundColor: "#eeeeee", color: "#424242" }; // Xám
    }
  };

  const mapTrangThaiUser = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Đang hoạt động";
      case "INACTIVE":
        return "Không hoạt động";
      case "DELETED":
        return "Đã xoá";
      case "WORKING":
        return "Đang làm việc";
      default:
        return "Không xác định";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Danh sách người dùng</DialogTitle>

      <DialogContent dividers>
        {users?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>SĐT</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, idx) => {
                  const isActive = user.TRANG_THAI_USER === "ACTIVE";
                  const diaChi = [
                    user.DIA_CHI_STREETNAME,
                    user.DIA_CHI_Wards,
                    user.DIA_CHI_Districts,
                    user.DIA_CHI_Provinces,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <TableRow key={idx}>
                      <TableCell>{user.HO_TEN}</TableCell>
                      <TableCell>{user.EMAIL}</TableCell>
                      <TableCell>{user.SO_DIEN_THOAI}</TableCell>
                      <TableCell>{diaChi || "N/A"}</TableCell>
                      <TableCell>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            ...getTrangThaiStyle(user.TRANG_THAI_USER),
                          }}
                        >
                          {mapTrangThaiUser(user.TRANG_THAI_USER)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={() => onAdd(user)}
                          disabled={!isActive}
                        >
                          +
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Không có người dùng nào.</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUsersShipModal;
