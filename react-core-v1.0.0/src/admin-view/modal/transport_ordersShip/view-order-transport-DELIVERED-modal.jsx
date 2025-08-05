import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Divider,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import ViewUsersShipModal from "../order-confirmed/ctyShip-add-user-order";
import ReduxExportUseAuthState from "../../../redux/redux-export/useAuthServices";
import { getAllUsers } from "../../../services/userAccountService";
import DeleteIcon from "@mui/icons-material/Delete";
import transportOrderServices from "../../../services/transportOrderServices";
import { enqueueSnackbar } from "notistack";

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
    default:
      return { backgroundColor: "#eeeeee", color: "#424242" };
  }
};

const OrderShipDetailViewDELIVERING = ({
  open,
  onClose,
  data,
  STATUS = "",
}) => {
  const [selectOrderShip, setSeletOrderShip] = useState(null);
  const [openUserShipModal, setOpenUserShipModal] = useState(false);
  const { userInfo } = ReduxExportUseAuthState();
  const [usersShip, setUsersShip] = useState([]);
  const [selectUserShip, setSelectUserShip] = useState(null);
  useEffect(() => {
    if (open && data) {
      setSeletOrderShip(data);
      fetchUserCtyShip();
    }
  }, [open, userInfo]);

  const fetchUserCtyShip = async () => {
    const companyId = userInfo?.companyInfo?.ID_COMPANY || null;
    const data = await getAllUsers(companyId);

    // Lọc trạng thái
    const filteredUsers = data.filter(
      (user) =>
        user.TRANG_THAI_USER === "ACTIVE" || user.TRANG_THAI_USER === "WORKING"
    );
    setUsersShip(filteredUsers);
  };

  const handleAddUserShip = (user) => {
    setSeletOrderShip((prev) => ({
      ...prev,
      ID_USERS_SHIP: user.ID_USERS,
    }));
    console.log("user được chọn:", user);
    setOpenUserShipModal(false);
    setSelectUserShip(user);
  };

  const onConfirmShip = async (key) => {
    if (!selectUserShip) {
      enqueueSnackbar("Vui lòng chọn người vận chuyển");
    }
    const input = {
      ID_COMPANY_SHIP: selectOrderShip?.ID_COMPANY_SHIP || "",
      ID_MATERIAL_ORDER: selectOrderShip?.ID_MATERIAL_ORDER || "",
      ID_ORDER: selectOrderShip?.ID_MATERIAL_ORDER_MASTER || "",
      DELIVERY_DATE: selectOrderShip?.DELIVERY_DATE || "",
      STATUS: key === "FAILED" ? "FAILED" : "DELIVERED" || "",
      SHIPPING_COST: selectOrderShip?.SHIPPING_COST || "",
      NOTE: selectOrderShip?.ID_COMPANY_SHIP || "",
      ID_FEE: selectOrderShip?.ID_FEE || "",
      ID_USERS_SHIP: selectOrderShip?.ID_USERS_SHIP || "",
      ID_MATERIAL_ORDER_MASTER: selectOrderShip?.ID_MATERIAL_ORDER_MASTER,
    };
    const id = selectOrderShip?.ID_TRANSPORT_ORDER;
    const data = await transportOrderServices.updateTransportOrder(id, input);
    onClose();
  };

  if (!data) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <>
        <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
          Chi tiết đơn hàng vận chuyển
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Bên mua */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="info.main"
              >
                Bên mua:
              </Typography>
              <Typography>{data.BUYER_NAME}</Typography>
              <Typography>SĐT: {data.BUYER_PHONE}</Typography>
              <Typography>Email: {data.BUYER_EMAIL}</Typography>
              <Typography>
                Địa chỉ:{" "}
                {`${data.BUYER_STREET}, ${data.BUYER_WARD}, ${data.BUYER_DISTRICT}, ${data.BUYER_PROVINCE}`}
              </Typography>
            </Grid>

            {/* Bên bán */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="warning.main"
              >
                Bên bán:
              </Typography>
              <Typography>{data.SELLER_NAME}</Typography>
              <Typography>SĐT: {data.SELLER_PHONE}</Typography>
              <Typography>Email: {data.SELLER_EMAIL}</Typography>
              <Typography>
                Địa chỉ:{" "}
                {`${data.SELLER_STREET}, ${data.SELLER_WARD}, ${data.SELLER_DISTRICT}, ${data.SELLER_PROVINCE}`}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Công ty vận chuyển */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="primary.main"
              >
                Công ty vận chuyển:
              </Typography>
              <Typography>{data.COMPANY_SHIP_NAME}</Typography>
              <Typography>SĐT: {data.SHIP_PHONE}</Typography>
              <Typography>Email: {data.SHIP_EMAIL}</Typography>
              <Typography>
                Địa chỉ:{" "}
                {`${data.SHIP_STREET}, ${data.SHIP_WARD}, ${data.SHIP_DISTRICT}, ${data.SHIP_PROVINCE}`}
              </Typography>
            </Grid>

            {/* Thời gian và trạng thái */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight="bold">
                Ngày đặt hàng:
              </Typography>
              <Typography>{formatDateTime(data.MASTER_ORDER_DATE)}</Typography>

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
                  }}
                >
                  {data.STATUS}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Thông tin vật liệu */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="success.main"
              >
                Thông tin vật liệu:
              </Typography>
              <Typography>Tên: {data.MATERIAL_NAME}</Typography>
              <Typography>
                Loại: {data.NAME_MATERIAL_TYPES || "Chưa có thông tin"}
              </Typography>
              <Typography>
                Số lượng: {data.QUANTITY_ORDERED} {data.UNIT}
              </Typography>
              <Typography>
                Đơn giá: {data.COST_PER_UNIT_?.toLocaleString()} đ
              </Typography>
              <Typography>
                Tổng tiền: {data.MATERIAL_TOTAL_COST?.toLocaleString()} đ
              </Typography>
            </Grid>

            {/* Xuất xứ và hạn */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight="bold">
                Xuất xứ:
              </Typography>
              <Typography>{data.ORIGIN}</Typography>
              <Typography>
                Hạn sử dụng: {formatDateTime(data.EXPIRY_DATE)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Người vận chuyển */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="primary.dark"
              >
                Người vận chuyển:
              </Typography>
              <Typography>
                {data?.SHIPPER_NAME} - {data?.SHIPPER_PHONE}
              </Typography>
              <Typography>{data?.SHIPPER_EMAIL}</Typography>
            </Grid>

            {/* Dịch vụ và phí ship */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight="bold">
                Dịch vụ giao hàng:
              </Typography>
              <Typography>{data.SERVICE_NAME || "Không rõ"}</Typography>
              <Typography fontWeight="bold" mt={1}>
                Phí giao hàng:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(data?.SHIPPING_PRICE || 0)}
              </Typography>
            </Grid>

            {/* Hiển thị người ship được chọn */}
            {data.STATUS === "CONFIRMED" && selectUserShip && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}
            {data.STATUS === "CONFIRMED" && selectUserShip && (
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography color="success.main" variant="body2">
                  {selectUserShip?.EMAIL}
                </Typography>
                <IconButton
                  onClick={() => setSelectUserShip(null)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        {/* Footer buttons */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <Button onClick={onClose} variant="outlined" color="secondary">
            Đóng
          </Button>{" "}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            {" "}
            {STATUS === "DELIVERING" && (
              <Box display="flex" gap={2}>
                <Button
                  onClick={() => onConfirmShip("FAILED")}
                  variant="contained"
                  color="error"
                  disabled={
                    data.STATUS !== "DELIVERING" || usersShip.length === 0
                  }
                >
                  Giao thất bại
                </Button>
              </Box>
            )}
            {STATUS === "DELIVERING" && (
              <Box display="flex" gap={2}>
                <Button
                  onClick={onConfirmShip}
                  variant="contained"
                  color="primary"
                  disabled={
                    data.STATUS !== "DELIVERING" || usersShip.length === 0
                  }
                >
                  Đã giao
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </>
    </Dialog>
  );
};

export default OrderShipDetailViewDELIVERING;
